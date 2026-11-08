from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Сериализатор для регистрации нового пользователя"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[password_validation.validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'role',
            'password', 'password_confirm', 'avatar'
        ]
        extra_kwargs = {
            'avatar': {'required': False},
            'phone': {'required': False},
            'role': {'default': 'editor'}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Пароли не совпадают"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'editor')
        )
        if validated_data.get('avatar'):
            user.avatar = validated_data['avatar']
            user.save(update_fields=['avatar'])
        return user


class UserLoginSerializer(serializers.Serializer):
    """Сериализатор для входа пользователя"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        from django.contrib.auth import authenticate
        user = authenticate(
            username=attrs['username'],
            password=attrs['password']
        )
        if not user:
            raise serializers.ValidationError("Неверные учётные данные")
        if not user.is_active:
            raise serializers.ValidationError("Аккаунт деактивирован")
        attrs['user'] = user
        return attrs


class UserDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для отображения данных пользователя"""
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'role',
            'avatar', 'avatar_url', 'is_staff', 'date_joined'
        ]
        read_only_fields = ['is_staff', 'date_joined']
    
    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return obj.avatar.url if obj.avatar else None


class UserUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления профиля пользователя"""
    class Meta:
        model = User
        fields = ['email', 'phone', 'avatar']
        extra_kwargs = {
            'email': {'required': False},
            'phone': {'required': False},
            'avatar': {'required': False}
        }