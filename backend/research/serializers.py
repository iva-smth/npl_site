# research/serializers.py

from rest_framework import serializers
from .models import ResearchDirection, ResearchGroup, ResearchTopic
from team.models import Employee
from team.serializers import EmployeeSerializer # Импортируем существующий сериализатор сотрудника
from equipment.serializers import EquipmentSerializer # Импортируем существующий сериализатор оборудования

class ResearchTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchTopic
        fields = ['id', 'title', 'description']

class ResearchGroupHeadSerializer(serializers.ModelSerializer):
    position_title = serializers.CharField(source='position.title', read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'full_name', 'photo_url', 'position_title']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return obj.photo.url if obj.photo else None
    
class ResearchGroupSerializer(serializers.ModelSerializer):
    # Поле head теперь автоматически подтягивает данные через свойство модели
    head = ResearchGroupHeadSerializer(read_only=True)
    members_count = serializers.IntegerField(source='members.count', read_only=True)

    class Meta:
        model = ResearchGroup
        fields = [
            'id', 'title', 'slug', 'description', 
            'direction', 'head', 'members_count'
        ]
class ResearchGroupDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для страницы конкретной группы"""
    direction_title = serializers.CharField(source='direction.title', read_only=True)
    topics = ResearchTopicSerializer(many=True, read_only=True)
    employees = serializers.SerializerMethodField()
    direction_equipment = serializers.SerializerMethodField()

    class Meta:
        model = ResearchGroup
        fields = [
            'id', 'title', 'slug', 'description',
            'direction', 'direction_title',
            'topics', 'employees', 'direction_equipment',
            'created_at'
        ]

    def get_employees(self, obj):
        qs = obj.employees.select_related('position').order_by(
            'position__order', 'full_name'
        )
        return EmployeeSerializer(qs, many=True, context=self.context).data

    def get_direction_equipment(self, obj):
        qs = obj.direction.equipment.all().order_by('title')
        return EquipmentSerializer(qs, many=True, context=self.context).data

class ResearchDirectionSerializer(serializers.ModelSerializer):
    groups = ResearchGroupSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    
    # Новые поля для главных сотрудников и оборудования
    key_employees = serializers.SerializerMethodField()
    featured_equipment = serializers.SerializerMethodField()

    class Meta:
        model = ResearchDirection
        fields = [
            'id', 'title', 'slug', 'description',
            'image', 'image_url', 'order', 'groups',
            'key_employees', 'featured_equipment', # Добавляем новые поля
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None

    def get_key_employees(self, obj):
        """Возвращает топ-4 сотрудников направления (руководители и ведущие специалисты)"""
        # Берем сотрудников, сортируем по должности (order) и имени, берем первых 4
        employees = obj.employees.select_related('position').order_by(
            'position__order', 'full_name'
        )[:4]
        return EmployeeSerializer(employees, many=True, context=self.context).data

    def get_featured_equipment(self, obj):
        """Возвращает топ-6 единиц оборудования направления"""
        equipment = obj.equipment.all().order_by('title')[:6]
        return EquipmentSerializer(equipment, many=True, context=self.context).data