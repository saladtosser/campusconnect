import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Registration(models.Model):
    """Model for event registrations."""
    
    STATUS_CHOICES = (
        ('registered', 'Registered'),
        ('checked_in', 'Checked In'),
        ('cancelled', 'Cancelled'),
    )
    
    admin_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='registrations',
        verbose_name=_('user')
    )
    event = models.ForeignKey(
        'events.Event',
        on_delete=models.CASCADE,
        related_name='registrations',
        verbose_name=_('event')
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='registered'
    )
    checked_in_at = models.DateTimeField(_('checked in at'), blank=True, null=True)
    qr_code = models.CharField(_('QR code'), max_length=255, unique=True, blank=True)
    qr_code_expires_at = models.DateTimeField(_('QR code expires at'), blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('registration')
        verbose_name_plural = _('registrations')
        unique_together = ('admin_user', 'event')
        indexes = [
            models.Index(fields=['qr_code']),
        ]

    def __str__(self):
        return f"{self.admin_user.email} - {self.event.name}"
    
    def save(self, *args, **kwargs):
        # Generate QR code if not provided
        if not self.qr_code:
            self.qr_code = str(uuid.uuid4())
            # Set QR code expiration to 24 hours after the event start time
            self.qr_code_expires_at = self.event.start_time + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    def check_in(self):
        """Mark the registration as checked in."""
        if self.status != 'checked_in':
            self.status = 'checked_in'
            self.checked_in_at = timezone.now()
            self.save()
    
    def cancel(self):
        """Cancel the registration."""
        if self.status != 'cancelled':
            self.status = 'cancelled'
            self.save()
    
    @property
    def is_qr_code_valid(self):
        """Check if the QR code is still valid."""
        if not self.qr_code_expires_at:
            return False
        return timezone.now() < self.qr_code_expires_at 