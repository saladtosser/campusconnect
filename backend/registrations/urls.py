from django.urls import path
from .views import (
    RegistrationListView,
    RegistrationCreateView,
    RegistrationDetailView,
    RegistrationCancelView,
    AttendanceConfirmView,
    AdminRegistrationListView,
    EventRegistrationsView
)

urlpatterns = [
    path('', RegistrationListView.as_view(), name='registration-list'),
    path('create/', RegistrationCreateView.as_view(), name='registration-create'),
    path('<int:pk>/', RegistrationDetailView.as_view(), name='registration-detail'),
    path('<int:pk>/cancel/', RegistrationCancelView.as_view(), name='registration-cancel'),
    path('confirm-attendance/', AttendanceConfirmView.as_view(), name='confirm-attendance'),
    path('admin/', AdminRegistrationListView.as_view(), name='admin-registration-list'),
    path('admin/event/<int:event_id>/', EventRegistrationsView.as_view(), name='event-registrations'),
] 