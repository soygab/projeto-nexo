from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    instituicao = models.CharField(max_length=150)
    curso = models.CharField(max_length=150)
    bio = models.CharField(max_length=500, blank=True)
    interests = models.CharField(max_length=250, blank=True)
    email_verified = models.BooleanField(default=False)
    verification_nonce = models.CharField(max_length=64, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
