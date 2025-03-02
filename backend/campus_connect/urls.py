"""
URL configuration for campus_connect project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include([
        # Authentication endpoints
        path('auth/', include([
            path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
            path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
            path('', include('users.urls')),
        ])),
        
        # App endpoints
        path('events/', include('events.urls')),
        path('registrations/', include('registrations.urls')),
    ])),
    
    # Django AllAuth URLs
    path('accounts/', include('allauth.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 