# publications/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Publication
from .serializers import PublicationListSerializer, PublicationDetailSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class PublicationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = []
    lookup_field = 'slug'
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['year', 'direction', 'authors_employees']
    
    # ИЗМЕНЕНИЕ: Поиск по внешним авторам и по ФИО сотрудников
    search_fields = ['title', 'external_authors', 'authors_employees__full_name', 'doi', 'abstract']
    
    # Сортировка по названию, году и, опционально, по первому автору (сложнее реализовать чисто на SQL для M2M, пока оставим как есть)
    ordering_fields = ['year', 'title', 'created_at']
    ordering = ['-year', '-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PublicationDetailSerializer
        return PublicationListSerializer

    def get_queryset(self):
        return Publication.objects.select_related(
            'direction'
        ).prefetch_related('authors_employees').order_by('-year', '-created_at')

    @action(detail=False, methods=['get'])
    def years(self, request):
        years = Publication.objects.values_list('year', flat=True).distinct().order_by('-year')
        return Response(list(years))