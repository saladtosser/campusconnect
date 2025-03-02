from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    """Serializer for the Event model."""
    
    is_past = serializers.BooleanField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    available_spots = serializers.IntegerField(read_only=True)
    is_qr_code_valid = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'location', 'start_time', 'end_time',
            'capacity', 'active', 'background_image', 'created_at', 'updated_at',
            'is_past', 'is_full', 'available_spots', 'qr_code', 'qr_code_generated_at',
            'is_qr_code_valid'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'qr_code', 'qr_code_generated_at'
        ]
    
    def validate(self, attrs):
        # Validate that end_time is after start_time
        if 'start_time' in attrs and 'end_time' in attrs:
            if attrs['end_time'] <= attrs['start_time']:
                raise serializers.ValidationError({"end_time": "End time must be after start time."})
        elif 'start_time' in attrs and self.instance:
            if self.instance.end_time <= attrs['start_time']:
                raise serializers.ValidationError({"end_time": "End time must be after start time."})
        elif 'end_time' in attrs and self.instance:
            if attrs['end_time'] <= self.instance.start_time:
                raise serializers.ValidationError({"end_time": "End time must be after start time."})
        
        return attrs


class EventListSerializer(serializers.ModelSerializer):
    """Serializer for listing events with fewer fields."""
    
    is_past = serializers.BooleanField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'name', 'location', 'start_time', 'end_time',
            'active', 'background_image', 'is_past', 'is_full'
        ] 