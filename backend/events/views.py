from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event
from .serializers import EventSerializer, EventListSerializer


class IsAdminUser(permissions.BasePermission):
    """Permission to only allow admin users to access the view."""
    
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'


class EventListView(generics.ListAPIView):
    """View for listing events."""
    
    queryset = Event.objects.filter(active=True)
    serializer_class = EventListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['active']
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['start_time', 'end_time', 'name']
    ordering = ['start_time']
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by upcoming events
        upcoming = self.request.query_params.get('upcoming')
        if upcoming and upcoming.lower() == 'true':
            from django.utils import timezone
            queryset = queryset.filter(start_time__gt=timezone.now())
        
        return queryset


class EventDetailView(generics.RetrieveAPIView):
    """View for retrieving event details."""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]


class EventCreateView(generics.CreateAPIView):
    """View for creating events (admin only)."""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


class EventUpdateView(generics.UpdateAPIView):
    """View for updating events (admin only)."""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


class EventDeleteView(generics.DestroyAPIView):
    """View for deleting events (admin only)."""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


class AdminEventListView(generics.ListAPIView):
    """View for listing all events (admin only)."""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['active']
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['start_time', 'end_time', 'name', 'created_at']
    ordering = ['-created_at']
    permission_classes = [permissions.IsAuthenticated, IsAdminUser] 