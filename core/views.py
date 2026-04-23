from django.shortcuts import render
from research.models import ResearchDirection
from .models import SiteSettings, Keyword

def home_view(request):
    """
    Представление главной страницы.
    Собирает данные из разных приложений для отображения на одной странице.
    """
    # 1. Получаем настройки сайта (логотип, описание)
    settings = SiteSettings.objects.first() # Берем первую запись, если она есть
    
    # 2. Получаем направления для слайдера (сортируем по порядку)
    directions = ResearchDirection.objects.all().order_by('order')[:5] # Берем топ-5
    
    # 3. Получаем облако тегов (топ-20 самых частых слов)
    keywords = Keyword.objects.all().order_by('-count')[:20]

    context = {
        'settings': settings,
        'directions': directions,
        'keywords': keywords,
    }
    
    return render(request, 'core/index.html', context)