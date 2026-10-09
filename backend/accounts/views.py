import secrets
import smtplib
from urllib.parse import urlencode
from django.conf import settings
from django.core import signing
from django.core.mail import send_mail
from django.db import transaction, IntegrityError
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, ProfileSerializer
from .models import User

class AuthThrottle(AnonRateThrottle):
    rate = '10/min'

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)

def send_verification(request, user):
    if settings.EMAIL_BACKEND.endswith('smtp.EmailBackend') and not (settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD):
        raise smtplib.SMTPException('SMTP not configured')
    nonce = secrets.token_urlsafe(32)
    token = signing.dumps({'id': user.pk, 'email': user.email, 'nonce': nonce}, salt='nexo-email-v2')
    path = f"{reverse('verify-email')}?{urlencode({'token': token})}"
    url = f'{settings.NEXO_PUBLIC_URL}{path}' if settings.NEXO_PUBLIC_URL else request.build_absolute_uri(path)
    send_mail('Confirme seu e-mail no NEXO',
              f'Confirme seu cadastro:\n{url}\n\nLink válido por 24 horas. Se não solicitou, ignore este e-mail.',
              settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
    user.verification_nonce = nonce
    user.save(update_fields=['verification_nonce'])

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([AuthThrottle])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        with transaction.atomic():
            user = serializer.save()
            send_verification(request, user)
    except (smtplib.SMTPException, OSError):
        return Response({'detail': 'Não foi possível enviar a confirmação. Tente novamente mais tarde.'}, status=503)
    except IntegrityError:
        return Response({'detail': 'Este e-mail já está cadastrado.'}, status=400)
    return Response({'detail': 'Enviamos um link de confirmação para seu Gmail.', 'requires_verification': True}, status=201)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([AuthThrottle])
def resend_view(request):
    data = LoginSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    try:
        with transaction.atomic():
            user = User.objects.select_for_update().filter(email__iexact=data.validated_data['email']).first()
            if user and user.is_active and not user.email_verified and user.check_password(data.validated_data['password']):
                send_verification(request, user)
    except (smtplib.SMTPException, OSError):
        return Response({'detail': 'Não foi possível enviar a confirmação. Tente novamente mais tarde.'}, status=503)
    return Response({'detail': 'Se os dados estiverem corretos e a confirmação estiver pendente, enviaremos um novo link.'})

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def verify_email_view(request):
    try:
        data = signing.loads(request.query_params.get('token', ''), salt='nexo-email-v2', max_age=86400)
        updated = User.objects.filter(pk=data['id'], email=data['email'], verification_nonce=data['nonce'],
                                      email_verified=False, is_active=True).exclude(verification_nonce='').update(email_verified=True, verification_nonce='')
    except (signing.BadSignature, KeyError, TypeError, ValueError):
        updated = False
    return HttpResponseRedirect('/?verification=' + ('success' if updated else 'invalid'))

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([AuthThrottle])
def login_view(request):
    data = LoginSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    user = User.objects.filter(email__iexact=data.validated_data['email']).first()
    if user is None:
        return Response({'detail': 'Não encontramos uma conta cadastrada com este e-mail.'}, status=401)
    if not user.check_password(data.validated_data['password']):
        return Response({'detail': 'Senha incorreta. Verifique e tente novamente.'}, status=401)
    if not user.is_active:
        return Response({'detail': 'Esta conta está desativada. Entre em contato com o suporte.'}, status=403)
    if not user.email_verified:
        return Response({'detail': 'Confirme seu Gmail antes de entrar. Você pode reenviar o link abaixo.'}, status=403)
    refresh = RefreshToken.for_user(user)
    return Response({'access': str(refresh.access_token), 'refresh': str(refresh), 'user': ProfileSerializer(user).data})

@api_view(['GET', 'PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if not request.user.email_verified:
        return Response({'detail': 'Confirme seu e-mail.'}, status=403)
    serializer = ProfileSerializer(request.user, data=request.data, partial=True) if request.method == 'PATCH' else ProfileSerializer(request.user)
    if request.method == 'PATCH':
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return Response(serializer.data)
