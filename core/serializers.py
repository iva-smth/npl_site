from rest_framework import serializers
from .models import SiteSettings, Keyword


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Сериализатор для настроек сайта"""
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_name', 'logo_url', 'description',
            'contact_email', 'contact_phone', 'address',
            'social_vk', 'social_telegram', 'updated_at'
        ]
        read_only_fields = ['updated_at']
    
    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return obj.logo.url if obj.logo else None


class KeywordSerializer(serializers.ModelSerializer):
    """Сериализатор для ключевых слов"""
    class Meta:
        model = Keyword
        fields = ['id', 'word', 'count']
        read_only_fields = ['count']