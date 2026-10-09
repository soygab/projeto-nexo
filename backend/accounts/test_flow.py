import re
import smtplib
from unittest.mock import patch
from django.test import TestCase, override_settings
from django.core import mail
from django.core.cache import cache
from rest_framework.test import APIClient
from .models import User

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', DEFAULT_FROM_EMAIL='nexo@example.com')
class AccountFlowTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.data = dict(first_name='Ana', last_name='Silva', email='ana@gmail.com',
                         instituicao='UGB', curso='Computação', password='A-long-test-password!93')

    def register(self):
        self.assertEqual(self.client.post('/api/auth/register/', self.data).status_code, 201)
        return re.search(r'http[^\s]+', mail.outbox[-1].body).group()

    def test_complete_flow_profile_and_refresh(self):
        link = self.register()
        self.assertEqual(self.client.post('/api/auth/login/', self.data).status_code, 403)
        self.assertIn('success', self.client.get(link)['Location'])
        self.assertIn('invalid', self.client.get(link)['Location'])
        result = self.client.post('/api/auth/login/', self.data).json()
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + result['access'])
        self.assertEqual(self.client.patch('/api/auth/me/', {'bio':'Olá!', 'first_name':'Ana Maria'}, format='json').status_code, 200)
        self.assertEqual(self.client.get('/api/auth/me/').json()['bio'], 'Olá!')
        self.assertEqual(self.client.post('/api/auth/login/refresh/', {'refresh':result['refresh']}).status_code, 200)

    def test_resend_preserves_account_and_invalidates_old_link(self):
        old = self.register()
        original = User.objects.get(email=self.data['email']).password
        self.assertEqual(self.client.post('/api/auth/register/', self.data).status_code, 400)
        self.client.post('/api/auth/resend-verification/', self.data)
        new = re.search(r'http[^\s]+', mail.outbox[-1].body).group()
        self.assertIn('invalid', self.client.get(old)['Location'])
        self.assertIn('success', self.client.get(new)['Location'])
        self.assertEqual(User.objects.get(email=self.data['email']).password, original)

    def test_failed_resend_keeps_existing_user(self):
        link = self.register()
        with patch('accounts.views.send_mail', side_effect=smtplib.SMTPException):
            self.assertEqual(self.client.post('/api/auth/resend-verification/', self.data).status_code, 503)
        self.assertIn('success', self.client.get(link)['Location'])

    def test_disabled_account_not_reactivated(self):
        link = self.register()
        User.objects.filter(email=self.data['email']).update(is_active=False)
        self.assertIn('invalid', self.client.get(link)['Location'])
        self.assertFalse(User.objects.get(email=self.data['email']).is_active)

    def test_expired_token(self):
        with patch('django.core.signing.time.time', return_value=1):
            link = self.register()
        self.assertIn('invalid', self.client.get(link)['Location'])

    def test_profile_cannot_change_identity_or_permissions(self):
        link = self.register()
        self.client.get(link)
        token = self.client.post('/api/auth/login/', self.data).json()['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.client.patch('/api/auth/me/', {'email':'other@gmail.com','is_superuser':True}, format='json')
        user = User.objects.get(email=self.data['email'])
        self.assertFalse(user.is_superuser)
