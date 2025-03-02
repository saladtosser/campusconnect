from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
import qrcode
import io
from django.http import HttpResponse
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


class EventQRCodeView(APIView):
    """View for generating a QR code for an event (admin only)."""
    
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, pk):
        """Generate a new QR code for the event."""
        event = get_object_or_404(Event, pk=pk)
        
        # Generate a new QR code
        event.generate_qr_code()
        
        return Response({
            'qr_code': event.qr_code,
            'qr_code_generated_at': event.qr_code_generated_at,
            'message': 'QR code generated successfully. It will expire in 10 minutes.'
        })
    
    def get(self, request, pk):
        """Get the QR code image for the event."""
        event = get_object_or_404(Event, pk=pk)
        
        # Check if QR code exists
        if not event.qr_code:
            return Response(
                {"detail": "No QR code has been generated for this event."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if QR code is valid
        if not event.is_qr_code_valid:
            return Response(
                {"detail": "QR code has expired. Please generate a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate QR code image
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(event.qr_code)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save QR code to buffer
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        
        # Return QR code as image
        return HttpResponse(buffer, content_type="image/png") 