from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from django.contrib.auth import authenticate, login, logout
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserDetailSerializer
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated

class RegisterView(generics.CreateAPIView):
    permission_classes = [IsAdminUser] 
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            if not user.is_staff:
                return Response({'error': 'Доступ только для администраторов'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserDetailSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        
        return Response({'error': 'Неверные учётные данные'}, 
                       status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Выход выполнен'})

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user