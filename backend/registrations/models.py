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
    attendance_code = models.CharField(_('attendance code'), max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('registration')
        verbose_name_plural = _('registrations')
        unique_together = ('admin_user', 'event')
        indexes = [
            models.Index(fields=['attendance_code']),
        ]

    def __str__(self):
        return f"{self.admin_user.email} - {self.event.name}"
    
    def save(self, *args, **kwargs):
        # Generate attendance code for guest users if not provided
        if not self.attendance_code and self.admin_user.role == 'guest':
            # Generate a random 6-character alphanumeric code
            self.attendance_code = ''.join(
                [uuid.uuid4().hex[:6].upper()]
            )
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
    
    @classmethod
    def confirm_attendance(cls, event_qr_code, user, attendance_code=None):
        """
        Confirm attendance using event QR code or attendance code.
        
        Args:
            event_qr_code: The QR code of the event
            user: The user confirming attendance
            attendance_code: Optional attendance code for guest users
            
        Returns:
            Registration object if successful, None otherwise
        """
        from events.models import Event
        
        try:
            # Find the event by QR code
            event = Event.objects.get(qr_code=event_qr_code)
            
            # Check if QR code is valid (not expired)
            if not event.is_qr_code_valid:
                return None, "Event QR code has expired"
                
            # For guest users, require attendance code
            if user.role == 'guest':
                if not attendance_code:
                    return None, "Attendance code is required for guest users"
                    
                # Find registration by user, event and attendance code
                registration = cls.objects.filter(
                    admin_user=user,
                    event=event,
                    attendance_code=attendance_code
                ).first()
                
                if not registration:
                    return None, "Invalid attendance code"
            else:
                # For regular users, find registration by user and event
                registration = cls.objects.filter(
                    admin_user=user,
                    event=event
                ).first()
                
                if not registration:
                    return None, "You are not registered for this event"
            
            # Check if already checked in
            if registration.status == 'checked_in':
                return registration, "Already checked in"
                
            # Check if cancelled
            if registration.status == 'cancelled':
                return None, "Registration has been cancelled"
                
            # Mark as checked in
            registration.check_in()
            return registration, "Check-in successful"
            
        except Event.DoesNotExist:
            return None, "Invalid event QR code" 