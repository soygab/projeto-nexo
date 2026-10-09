from django.db import migrations, models

def preserve_existing(apps, schema_editor):
    apps.get_model('accounts', 'User').objects.filter(is_active=True).update(email_verified=True)

class Migration(migrations.Migration):
    dependencies = [('accounts', '0002_alter_user_email')]
    operations = [
        migrations.AddField('user', 'bio', models.CharField(max_length=500, blank=True)),
        migrations.AddField('user', 'interests', models.CharField(max_length=250, blank=True)),
        migrations.AddField('user', 'email_verified', models.BooleanField(default=False)),
        migrations.AddField('user', 'verification_nonce', models.CharField(max_length=64, blank=True)),
        migrations.RunPython(preserve_existing, migrations.RunPython.noop),
    ]
