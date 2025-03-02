from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
import qrcode
import io
from django.http import HttpResponse
from .models import Registration
from .serializers import (
    RegistrationSerializer, 
    RegistrationCreateSerializer, 
    RegistrationListSerializer,
    CheckInSerializer
)
from events.models import Event
from events.views import IsAdminUser


class RegistrationListView(generics.ListAPIView):
    """View for listing user's registrations."""
    
    serializer_class = RegistrationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Registration.objects.filter(admin_user=self.request.user)


class RegistrationCreateView(generics.CreateAPIView):
    """View for creating a registration."""
    
    serializer_class = RegistrationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class RegistrationDetailView(generics.RetrieveAPIView):
    """View for retrieving registration details."""
    
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Registration.objects.all()
        return Registration.objects.filter(admin_user=self.request.user)


class RegistrationCancelView(generics.UpdateAPIView):
    """View for cancelling a registration."""
    
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Registration.objects.filter(admin_user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        registration = self.get_object()
        registration.cancel()
        return Response(self.get_serializer(registration).data)


class RegistrationQRCodeView(APIView):
    """View for generating a QR code for a registration."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        # Get the registration
        if request.user.role == 'admin':
            registration = get_object_or_404(Registration, pk=pk)
        else:
            registration = get_object_or_404(Registration, pk=pk, admin_user=request.user)
        
        # Check if QR code is valid
        if not registration.is_qr_code_valid:
            return Response(
                {"detail": "QR code has expired."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(registration.qr_code)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save QR code to buffer
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        
        # Return QR code as image
        return HttpResponse(buffer, content_type="image/png")


class CheckInView(APIView):
    """View for checking in a registration."""
    
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        serializer = CheckInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        qr_code = serializer.validated_data['qr_code']
        registration = get_object_or_404(Registration, qr_code=qr_code)
        
        registration.check_in()
        
        return Response(
            RegistrationSerializer(registration).data,
            status=status.HTTP_200_OK
        )


class AdminRegistrationListView(generics.ListAPIView):
    """View for listing all registrations (admin only)."""
    
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by event
        event_id = self.request.query_params.get('event_id')
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset 