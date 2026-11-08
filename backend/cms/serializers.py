from rest_framework import serializers
from .models import Page, PageBlock, SiteMenu, MenuItem, ChangeLog


class PageBlockSerializer(serializers.ModelSerializer):
    """Сериализатор для блоков страницы"""
    class Meta:
        model = PageBlock
        fields = ['id', 'block_type', 'title', 'content', 'image', 'order', 'is_active']


class PageSerializer(serializers.ModelSerializer):
    """Сериализатор для страниц с вложенными блоками"""
    blocks = PageBlockSerializer(many=True, read_only=True)
    
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'blocks', 'is_published', 'created_at', 'updated_at']
        read_only_fields = ['slug']


class MenuItemSerializer(serializers.ModelSerializer):
    """Сериализатор для пунктов меню"""
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'url', 'order', 'is_active', 'children']
    
    def get_children(self, obj):
        # Возвращаем только активные дочерние пункты
        if hasattr(obj, 'children'):
            return MenuItemSerializer(obj.children.filter(is_active=True), many=True).data
        return []


class SiteMenuSerializer(serializers.ModelSerializer):
    """Сериализатор для меню с вложенными пунктами"""
    items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = SiteMenu
        fields = ['id', 'name', 'slug', 'is_active', 'items']


class ChangeLogSerializer(serializers.ModelSerializer):
    """Сериализатор для журнала изменений (только чтение)"""
    class Meta:
        model = ChangeLog
        fields = ['id', 'user', 'action', 'model_name', 'object_id', 'timestamp', 'details']
        read_only_fields = ['id', 'timestamp']