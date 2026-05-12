from rest_framework import serializers
from .models import Position, Employee


class PositionSerializer(serializers.ModelSerializer):
    """Сериализатор для должностей"""
    class Meta:
        model = Position
        fields = ['id', 'title', 'order']


class EmployeeSerializer(serializers.ModelSerializer):
    """Сериализатор для сотрудников"""
    photo_url = serializers.SerializerMethodField()
    position_label = serializers.SerializerMethodField()
    custom_position = PositionSerializer(read_only=True)
    custom_position_id = serializers.PrimaryKeyRelatedField(
        queryset=Position.objects.all(),
        source='custom_position',
        write_only=True,
        required=False
    )
    # Контакты только если разрешено показывать
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = [
            'id', 'full_name', 'photo_url', 'position_label',
            'position', 'custom_position', 'custom_position_id',
            'bio', 'email', 'phone', 'direction', 'group',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return obj.photo.url if obj.photo else None
    
    def get_position_label(self, obj):
        return obj.get_position_display()
    
    def get_email(self, obj):
        return obj.email if obj.show_email else None
    
    def get_phone(self, obj):
        return obj.phone if obj.show_phone else None