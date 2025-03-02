from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer for the AdminUser model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'phone', 'guest_code']
        read_only_fields = ['id', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'name', 'role', 'phone', 'guest_code']
        extra_kwargs = {
            'name': {'required': True},
            'role': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate guest_code is provided for guest users
        if attrs.get('role') == 'guest' and not attrs.get('guest_code'):
            raise serializers.ValidationError({"guest_code": "Guest code is required for guest users."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'phone', 'guest_code']
        read_only_fields = ['id', 'email', 'role', 'guest_code'] 