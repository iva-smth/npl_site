from rest_framework import viewsets
from .models import Equipment
from .serializers import EquipmentSerializer

class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Equipment.objects.all().order_by('title')
    serializer_class = EquipmentSerializer