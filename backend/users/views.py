from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, AdminUserSerializer, UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """View for user registration."""
    
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": AdminUserSerializer(user, context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for retrieving and updating user profile."""
    
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """View for listing users (admin only)."""
    
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    
    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.role != 'admin':
            self.permission_denied(
                request,
                message="You do not have permission to access this resource.",
            )


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating and deleting a user (admin only)."""
    
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    
    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.role != 'admin':
            self.permission_denied(
                request,
                message="You do not have permission to access this resource.",
            ) 