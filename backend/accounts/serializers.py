from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'instituicao', 'curso', 'password']

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