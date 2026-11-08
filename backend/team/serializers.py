# team/serializers.py
from rest_framework import serializers
from .models import Position, Employee
from publications.models import Publication
from publications.serializers import PublicationListSerializer

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'title', 'order']

class EmployeeSerializer(serializers.ModelSerializer):
    """Базовый сериализатор для списка сотрудников"""
    photo_url = serializers.SerializerMethodField()
    position_title = serializers.CharField(source='position.title', read_only=True, allow_null=True)
    position_order = serializers.IntegerField(source='position.order', read_only=True, allow_null=True)

    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    
    direction_title = serializers.CharField(source='direction.title', read_only=True, allow_null=True)
    group_title = serializers.CharField(source='group.title', read_only=True, allow_null=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'full_name', 'photo_url', 'position_title', 'position_order',
            'position', 'bio',
            'email', 'phone', 'show_email', 'show_phone',
            'direction', 'group', 'direction_title', 'group_title',
            'created_at', 'updated_at'
        ]

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

class EmployeeDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной страницы сотрудника"""
    photo_url = serializers.SerializerMethodField()
    position_title = serializers.CharField(source='position.title', read_only=True, allow_null=True)
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    recent_publications = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'full_name', 'photo_url', 'position_title',
            'bio', 'email', 'phone',
            'show_email', 'show_phone',
            'direction', 'group',
            'recent_publications'
        ]

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

    def get_recent_publications(self, obj):
        pubs = Publication.objects.filter(
            authors_employees=obj
        ).order_by('-year', '-created_at')[:5]
        return PublicationListSerializer(pubs, many=True, context=self.context).data