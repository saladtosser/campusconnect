from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for the Event model."""
    
    list_display = ('name', 'location', 'start_time', 'end_time', 'capacity', 'active')
    list_filter = ('active',)
    search_fields = ('name', 'description', 'location')
    date_hierarchy = 'start_time'
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'location', 'background_image')
        }),
        ('Timing', {
            'fields': ('start_time', 'end_time')
        }),
        ('Settings', {
            'fields': ('capacity', 'active')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 