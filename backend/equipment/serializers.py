# equipment/serializers.py

from rest_framework import serializers  # <--- ДОБАВИТЬ ЭТУ СТРОКУ
from .models import Equipment, EquipmentCategory

class EquipmentCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField() 

    class Meta:
        model = EquipmentCategory
        fields = ['id', 'title', 'slug', 'parent', 'children']

    def get_children(self, obj):
        children = EquipmentCategory.objects.filter(parent=obj)
        if children:
            return EquipmentCategorySerializer(children, many=True).data
        return []

class EquipmentSerializer(serializers.ModelSerializer):
    """Сериализатор для оборудования"""
    category = EquipmentCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentCategory.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = [
            'id', 'title', 'slug', 'description', 'specs',
            'image', 'image_url', 'category', 'category_id',
            'direction', 'related_equipment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None