from django.db import models
from django.utils.translation import gettext_lazy as _


class Event(models.Model):
    """Model for university events."""
    
    name = models.CharField(_('name'), max_length=255)
    description = models.TextField(_('description'), blank=True, null=True)
    location = models.CharField(_('location'), max_length=255)
    start_time = models.DateTimeField(_('start time'))
    end_time = models.DateTimeField(_('end time'))
    capacity = models.PositiveIntegerField(_('capacity'), blank=True, null=True)
    active = models.BooleanField(_('active'), default=True)
    background_image = models.ImageField(_('background image'), upload_to='events/', blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('event')
        verbose_name_plural = _('events')
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['start_time']),
            models.Index(fields=['active']),
        ]

    def __str__(self):
        return self.name
    
    @property
    def is_past(self):
        """Check if the event is in the past."""
        from django.utils import timezone
        return self.end_time < timezone.now()
    
    @property
    def is_full(self):
        """Check if the event is at full capacity."""
        if self.capacity is None:
            return False
        return self.registrations.count() >= self.capacity
    
    @property
    def available_spots(self):
        """Calculate the number of available spots."""
        if self.capacity is None:
            return None
        return max(0, self.capacity - self.registrations.count()) 