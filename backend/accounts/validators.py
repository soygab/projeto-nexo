from django.core.exceptions import ValidationError

def validate_real_email_domain(email):
    domain = email.rsplit('@', 1)[-1].lower()
    if domain != 'gmail.com':
        raise ValidationError('Use um endereço do Gmail (@gmail.com).')
