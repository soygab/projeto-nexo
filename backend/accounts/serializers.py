from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .validators import validate_real_email_domain

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(validators=[validate_real_email_domain])

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'instituicao', 'curso', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este e-mail já está cadastrado.')
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],  # e-mail como username
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            instituicao=validated_data['instituicao'],
            curso=validated_data['curso'],
        )
        user.set_password(validated_data['password'])  # nunca salvar senha em texto puro
        user.save()
        return user