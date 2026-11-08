# team/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Employee
from .serializers import EmployeeDetailSerializer, EmployeeSerializer
from django.db.models import F
from rest_framework.decorators import action
from rest_framework.response import Response

class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [] 

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['direction', 'group', 'position']
    search_fields = [
        'full_name',
        'position__title' 
    ]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EmployeeDetailSerializer
        return EmployeeSerializer
        
    def get_queryset(self):
        return Employee.objects.select_related(
            'direction', 'group', 'position'
        ).order_by(
            'position__order',
            'direction__order',
            'group__title',
            'full_name'
        )

    @action(detail=False, methods=['get'])
    def contacts(self, request):
        """
        Возвращает список сотрудников, помеченных как контактные лица.
        Для них мы форсируем показ email и телефона, если они есть в базе,
        независимо от личных настроек приватности (опционально, по ТЗ "всегда видно").
        """
        queryset = self.get_queryset().filter(is_public_contact=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)