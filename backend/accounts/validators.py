import dns.resolver
from django.core.exceptions import ValidationError

def validate_real_email_domain(email):
    try:
        domain = email.split('@')[1]
    except IndexError:
        raise ValidationError('E-mail inválido.')

    try:
        dns.resolver.resolve(domain, 'MX')
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers):
        raise ValidationError('Esse domínio de e-mail não existe ou não recebe e-mails.')
    except dns.exception.Timeout:
        raise ValidationError('Não foi possível verificar o domínio do e-mail. Tente novamente.')