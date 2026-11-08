from .models import Equipment
from .serializers import EquipmentSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import EquipmentCategory
from .serializers import EquipmentCategorySerializer

class EquipmentCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Возвращает дерево категорий.
    Фильтруем по parent=None, чтобы получить только корни.
    """
    serializer_class = EquipmentCategorySerializer
    
    def get_queryset(self):
        return EquipmentCategory.objects.filter(parent=None).order_by('title')

class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly] 
    queryset = Equipment.objects.all().order_by('title')
    serializer_class = EquipmentSerializer
    lookup_field = 'slug'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['direction']
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Получаем ID категории из параметров запроса (например, ?category=5)
        category_id = self.request.query_params.get('category', None)
        
        if category_id:
            # Вспомогательная рекурсивная функция для сбора ID категории и всех её детей
            def get_all_descendant_ids(cat_id):
                ids = [cat_id]
                # Ищем прямых потомков
                children = EquipmentCategory.objects.filter(parent_id=cat_id)
                for child in children:
                    # Рекурсивно добавляем потомков потомков
                    ids.extend(get_all_descendant_ids(child.id))
                return ids

            # Фильтруем оборудование по всем найденным ID
            all_ids = get_all_descendant_ids(int(category_id))
            queryset = queryset.filter(category_id__in=all_ids)
            
        return queryset


    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """
        Возвращает список уникальных названий оборудования для автодополнения.
        Пример: /api/v1/equipment/suggestions/?q=уск
        """
        query = request.query_params.get('q', '')
        if not query or len(query) < 2:
            return Response([])
        
        # Ищем оборудование, название которого начинается с введенных букв
        # Используем distinct(), чтобы не было дубликатов, если логика сложная
        equipments = Equipment.objects.filter(
            title__icontains=query
        ).values_list('title', flat=True).distinct()[:10] # Берем топ-10
        
        return Response(list(equipments))
    
    