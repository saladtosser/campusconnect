from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class AdminUserManager(BaseUserManager):
    """Define a model manager for AdminUser model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class AdminUser(AbstractUser):
    """Custom user model that uses email as the unique identifier instead of username."""

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
        ('guest', 'Guest'),
    )

    username = None
    email = models.EmailField(_('email address'), unique=True)
    name = models.CharField(_('full name'), max_length=255)
    role = models.CharField(_('role'), max_length=10, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(_('phone number'), max_length=20, blank=True, null=True)
    guest_code = models.CharField(_('guest code'), max_length=50, blank=True, null=True, unique=True)
    oauth_provider = models.CharField(_('oauth provider'), max_length=50, blank=True, null=True)
    oauth_uid = models.CharField(_('oauth uid'), max_length=255, blank=True, null=True)
    reset_password_token = models.CharField(_('reset password token'), max_length=255, blank=True, null=True)
    reset_password_sent_at = models.DateTimeField(_('reset password sent at'), blank=True, null=True)
    remember_created_at = models.DateTimeField(_('remember created at'), blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = AdminUserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['guest_code']),
        ]

    def __str__(self):
        return self.email 