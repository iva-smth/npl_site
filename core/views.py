from rest_framework.decorators import api_view
from rest_framework.response import Response
from research.models import ResearchDirection
from publications.models import Publication
from team.models import Employee
from core.models import Keyword
from research.serializers import ResearchDirectionSerializer
from publications.serializers import PublicationListSerializer
from core.serializers import KeywordSerializer

@api_view(['GET'])
def home_view(request):
    """Главная страница API с данными для отображения"""
    
    # 1. Получаем направления для слайдера
    directions = ResearchDirection.objects.all()
    directions_serializer = ResearchDirectionSerializer(directions, many=True, context={'request': request})
    
    # 2. Получаем последние 5 публикаций
    latest_publications = Publication.objects.select_related('direction').prefetch_related('authors_employees').order_by('-year', '-created_at')[:5]
    pubs_serializer = PublicationListSerializer(latest_publications, many=True, context={'request': request})
    
    # 3. Получаем топ-20 ключевых слов для облака компетенций
    top_keywords = Keyword.objects.order_by('-count')[:20]
    keywords_serializer = KeywordSerializer(top_keywords, many=True)

    return Response({
        'message': 'NPL IPETT TPU API',
        'stats': {
            'directions': ResearchDirection.objects.count(),
            'publications': Publication.objects.count(),
            'employees': Employee.objects.count(),
        },
        'slider_directions': directions_serializer.data,
        'latest_publications': pubs_serializer.data,
        'top_keywords': keywords_serializer.data,
    })