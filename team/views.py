from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly] 
    queryset = Employee.objects.all().order_by('full_name')
    serializer_class = EmployeeSerializer