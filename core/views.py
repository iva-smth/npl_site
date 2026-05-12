from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from research.models import ResearchDirection
from publications.models import Publication
from team.models import Employee

@api_view(['GET'])
def home_view(request):
    """Главная страница API с общей статистикой"""
    return Response({
        'message': 'NPL IPETT TPU API',
        'version': '1.0.0',
        'documentation': request.build_absolute_uri('/api/v1/swagger-ui/'),
        'stats': {
            'directions': ResearchDirection.objects.count(),
            'publications': Publication.objects.count(),
            'employees': Employee.objects.count(),
        },
        'endpoints': {
            'directions': request.build_absolute_uri('/api/v1/directions/'),
            'employees': request.build_absolute_uri('/api/v1/employees/'),
            'publications': request.build_absolute_uri('/api/v1/publications/'),
            'equipment': request.build_absolute_uri('/api/v1/equipment/'),
        }
    })