# Generated by Django 4.2.10 on 2025-03-02 03:11

from django.db import migrations, models
import django.utils.timezone
import users.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email address')),
                ('name', models.CharField(max_length=255, verbose_name='full name')),
                ('role', models.CharField(choices=[('admin', 'Admin'), ('student', 'Student'), ('guest', 'Guest')], default='student', max_length=10, verbose_name='role')),
                ('phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='phone number')),
                ('guest_code', models.CharField(blank=True, max_length=50, null=True, unique=True, verbose_name='guest code')),
                ('oauth_provider', models.CharField(blank=True, max_length=50, null=True, verbose_name='oauth provider')),
                ('oauth_uid', models.CharField(blank=True, max_length=255, null=True, verbose_name='oauth uid')),
                ('reset_password_token', models.CharField(blank=True, max_length=255, null=True, verbose_name='reset password token')),
                ('reset_password_sent_at', models.DateTimeField(blank=True, null=True, verbose_name='reset password sent at')),
                ('remember_created_at', models.DateTimeField(blank=True, null=True, verbose_name='remember created at')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'indexes': [models.Index(fields=['email'], name='users_admin_email_96f120_idx'), models.Index(fields=['guest_code'], name='users_admin_guest_c_7d61fb_idx')],
            },
            managers=[
                ('objects', users.models.AdminUserManager()),
            ],
        ),
    ]
