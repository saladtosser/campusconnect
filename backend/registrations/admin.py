from django.contrib import admin
from .models import Registration


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    """Admin interface for the Registration model."""
    
    list_display = ('admin_user', 'event', 'status', 'checked_in_at', 'created_at')
    list_filter = ('status',)
    search_fields = ('admin_user__email', 'admin_user__name', 'event__name', 'qr_code')
    date_hierarchy = 'created_at'
    readonly_fields = ('qr_code', 'qr_code_expires_at', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('admin_user', 'event')
        }),
        ('Status', {
            'fields': ('status', 'checked_in_at')
        }),
        ('QR Code', {
            'fields': ('qr_code', 'qr_code_expires_at')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 