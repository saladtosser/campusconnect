from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import AdminUser


class AdminUserAdmin(UserAdmin):
    """Admin interface for the AdminUser model."""
    
    list_display = ('email', 'name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'name', 'phone', 'guest_code')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('name', 'phone')}),
        (_('Role'), {'fields': ('role', 'guest_code')}),
        (_('OAuth'), {'fields': ('oauth_provider', 'oauth_uid')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'name', 'role'),
        }),
    )


admin.site.register(AdminUser, AdminUserAdmin) 