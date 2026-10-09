from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .validators import validate_real_email_domain
User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    activity = serializers.SerializerMethodField()

    def get_activity(self, user):
        # No activity models exist yet: never attribute demo records to users.
        return {'projects': [], 'contributions': [], 'badges': [],
                'followers_count': 0, 'following_count': 0}

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'instituicao', 'curso', 'bio', 'interests', 'email_verified', 'activity']
        read_only_fields = ['id', 'email', 'email_verified']
        extra_kwargs = {'first_name': {'required': True, 'allow_blank': False}}

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    email = serializers.EmailField(validators=[validate_real_email_domain])
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'instituicao', 'curso', 'password']
        extra_kwargs = {'first_name': {'required': True, 'allow_blank': False}}
    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Este e-mail já está cadastrado. Entre ou solicite outro link.')
        return value
    def validate(self, attrs):
        validate_password(attrs['password'], User(**{k: v for k, v in attrs.items() if k != 'password'}))
        return attrs
    def create(self, validated_data):
        return User.objects.create_user(username=validated_data['email'], **validated_data)
