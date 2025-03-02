from rest_framework import serializers
from .models import Registration
from events.serializers import EventSerializer
from users.serializers import AdminUserSerializer
from django.utils import timezone


class RegistrationSerializer(serializers.ModelSerializer):
    """Serializer for the Registration model."""
    
    event = EventSerializer(read_only=True)
    admin_user = AdminUserSerializer(read_only=True)
    
    class Meta:
        model = Registration
        fields = [
            'id', 'event', 'admin_user', 'status', 'checked_in_at',
            'attendance_code', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'event', 'admin_user', 'attendance_code',
            'created_at', 'updated_at', 'checked_in_at'
        ]


class RegistrationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a registration."""
    
    event_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Registration
        fields = ['event_id']
    
    def validate_event_id(self, value):
        from events.models import Event
        
        try:
            event = Event.objects.get(pk=value)
        except Event.DoesNotExist:
            raise serializers.ValidationError("Event does not exist.")
        
        # Check if event is active
        if not event.active:
            raise serializers.ValidationError("Event is not active.")
        
        # Check if event is in the past
        if event.is_past:
            raise serializers.ValidationError("Event has already ended.")
        
        # Check if event is full
        if event.is_full:
            raise serializers.ValidationError("Event is at full capacity.")
        
        # Check if user is already registered
        user = self.context['request'].user
        if Registration.objects.filter(admin_user=user, event=event).exists():
            raise serializers.ValidationError("You are already registered for this event.")
        
        return value
    
    def create(self, validated_data):
        event_id = validated_data.pop('event_id')
        user = self.context['request'].user
        
        from events.models import Event
        event = Event.objects.get(pk=event_id)
        
        registration = Registration.objects.create(
            admin_user=user,
            event=event
        )
        
        return registration


class RegistrationListSerializer(serializers.ModelSerializer):
    """Serializer for listing registrations with fewer fields."""
    
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = Registration
        fields = [
            'id', 'event', 'status', 'checked_in_at', 
            'attendance_code', 'created_at'
        ]


class AttendanceConfirmSerializer(serializers.Serializer):
    """Serializer for confirming attendance."""
    
    event_qr_code = serializers.CharField(required=True)
    attendance_code = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        user = self.context['request'].user
        event_qr_code = attrs.get('event_qr_code')
        attendance_code = attrs.get('attendance_code')
        
        # For guest users, attendance code is required
        if user.role == 'guest' and not attendance_code:
            raise serializers.ValidationError({"attendance_code": "Attendance code is required for guest users."})
        
        return attrs 