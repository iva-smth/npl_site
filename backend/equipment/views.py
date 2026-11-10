from .models import Equipment, EquipmentCategory
from .serializers import EquipmentSerializer, EquipmentCategorySerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from research.models import ResearchDirection


class EquipmentCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EquipmentCategorySerializer

    def get_queryset(self):
        return EquipmentCategory.objects.filter(parent=None).order_by('title')


class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Equipment.objects.all().order_by('title')
    serializer_class = EquipmentSerializer
    lookup_field = 'slug'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # ✅ УБРАЛИ 'category' из filterset_fields, чтобы не конфликтовало с ручной логикой
    filterset_fields = ['direction', 'group']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset().select_related('category', 'direction', 'group')
        
        category_id = self.request.query_params.get('category', None)
        if category_id:
            def get_all_descendant_ids(cat_id):
                ids = [cat_id]
                # Оптимизация: сразу запрашиваем только ID
                children = EquipmentCategory.objects.filter(parent_id=cat_id).values_list('id', flat=True)
                for child_id in children:
                    ids.extend(get_all_descendant_ids(child_id))
                return ids

            all_ids = get_all_descendant_ids(int(category_id))
            queryset = queryset.filter(category_id__in=all_ids)
            
        return queryset

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        query = request.query_params.get('q', '')
        if not query or len(query) < 2:
            return Response([])
        equipments = Equipment.objects.filter(title__icontains=query).values_list('title', flat=True).distinct()[:10]
        return Response(list(equipments))

    @action(detail=False, methods=['get'], url_path='filter-options')
    def filter_options(self, request):
        directions = ResearchDirection.objects.prefetch_related('groups').all().order_by('order', 'title')
        data = []
        for d in directions:
            data.append({
                'id': d.id,
                'title': d.title,
                'slug': d.slug,
                'groups': [
                    {'id': g.id, 'title': g.title, 'slug': g.slug}
                    for g in d.groups.all().order_by('order', 'title')
                ]
            })
        return Response(data)