from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Publication
from .serializers import PublicationSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class PublicationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Publication.objects.all().order_by('-year', '-created_at') 
    serializer_class = PublicationSerializer
    lookup_field = 'slug'
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['year', 'pub_type', 'direction']
    search_fields = ['title', 'authors', 'abstract']  