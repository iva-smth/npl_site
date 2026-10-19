# research/views.py
from rest_framework import viewsets
from .models import ResearchDirection, ResearchGroup
from .serializers import (
    ResearchDirectionSerializer, 
    ResearchGroupSerializer, 
    ResearchGroupDetailSerializer # <-- Импорт нового сериализатора
)

class ResearchDirectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResearchDirection.objects.all().order_by('order')
    serializer_class = ResearchDirectionSerializer
    lookup_field = 'slug'

class ResearchGroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResearchGroup.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ResearchGroupDetailSerializer
        return ResearchGroupSerializer
    
    def get_queryset(self):
        # Оптимизация: загружаем связанные данные одним запросом
        return ResearchGroup.objects.select_related(
            'direction'
        ).prefetch_related(
            'topics', 
            'employees__position' # Загружаем должности сотрудников
        )