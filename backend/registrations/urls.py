from django.urls import path
from .views import (
    RegistrationListView,
    RegistrationCreateView,
    RegistrationDetailView,
    RegistrationCancelView,
    RegistrationQRCodeView,
    CheckInView,
    AdminRegistrationListView
)

urlpatterns = [
    path('', RegistrationListView.as_view(), name='registration-list'),
    path('create/', RegistrationCreateView.as_view(), name='registration-create'),
    path('<int:pk>/', RegistrationDetailView.as_view(), name='registration-detail'),
    path('<int:pk>/cancel/', RegistrationCancelView.as_view(), name='registration-cancel'),
    path('<int:pk>/qr-code/', RegistrationQRCodeView.as_view(), name='registration-qr-code'),
    path('check-in/', CheckInView.as_view(), name='registration-check-in'),
    path('admin/', AdminRegistrationListView.as_view(), name='admin-registration-list'),
] 