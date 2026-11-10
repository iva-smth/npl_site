from rest_framework import serializers
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


# === НОВЫЕ МИНИМАЛЬНЫЕ СЕРИАЛИЗАТОРЫ ДЛЯ ФИЛЬТРОВ ===
class EquipmentDirectionMinimalSerializer(serializers.Serializer):
    """Минимальный сериализатор направления для фильтров оборудования"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.CharField()
    groups = serializers.ListField()


class EquipmentGroupMinimalSerializer(serializers.Serializer):
    """Минимальный сериализатор группы для фильтров оборудования"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.CharField()


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
    # === НОВОЕ: отдаём название группы на фронт ===
    group_title = serializers.CharField(source='group.title', read_only=True, allow_null=True)
    direction_title = serializers.CharField(source='direction.title', read_only=True, allow_null=True)

    class Meta:
        model = Equipment
        fields = [
            'id', 'title', 'slug', 'description', 'specs',
            'image', 'image_url',
            'category', 'category_id',
            'direction', 'direction_title',
            'group', 'group_title',
            'related_equipment',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None