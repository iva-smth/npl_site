from rest_framework import serializers
from .models import ResearchDirection, ResearchGroup


class ResearchGroupSerializer(serializers.ModelSerializer):
    """Сериализатор для рабочих групп"""
    class Meta:
        model = ResearchGroup
        fields = ['id', 'title', 'slug', 'description', 'created_at']
        read_only_fields = ['slug', 'created_at']


class ResearchDirectionSerializer(serializers.ModelSerializer):
    """Сериализатор для направлений исследований"""
    groups = ResearchGroupSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ResearchDirection
        fields = [
            'id', 'title', 'slug', 'description',
            'image', 'image_url', 'order', 'groups',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None