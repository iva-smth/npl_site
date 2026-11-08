from rest_framework import viewsets
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
    filterset_fields = ['category', 'direction']
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = super().get_queryset()
        category_ids = self.request.query_params.get('category__in', None)
        if category_ids:
            ids_list = [int(id) for id in category_ids.split(',')]
            queryset = queryset.filter(category_id__in=ids_list)
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
    
    