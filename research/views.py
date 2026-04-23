from rest_framework import viewsets
from .models import ResearchDirection, ResearchGroup
from .serializers import ResearchDirectionSerializer, ResearchGroupSerializer

class ResearchDirectionViewSet(viewsets.ReadOnlyModelViewSet):
    """Только чтение: список направлений и детали"""
    queryset = ResearchDirection.objects.all().order_by('order')
    serializer_class = ResearchDirectionSerializer
    lookup_field = 'slug' # Ищем по slug, а не по ID

class ResearchGroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResearchGroup.objects.all()
    serializer_class = ResearchGroupSerializer
    lookup_field = 'slug'