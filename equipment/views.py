from rest_framework import viewsets
from .models import Equipment
from .serializers import EquipmentSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly] 
    queryset = Equipment.objects.all().order_by('title')
    serializer_class = EquipmentSerializer