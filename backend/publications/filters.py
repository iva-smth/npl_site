# backend/publications/filters.py
import django_filters
from .models import Publication


class PublicationFilter(django_filters.FilterSet):
    """
    Кастомный фильтр для публикаций с поддержкой диапазона лет.
    """
    year_from = django_filters.NumberFilter(
        field_name='year',
        lookup_expr='gte',  # greater than or equal
        label='Год от'
    )
    year_to = django_filters.NumberFilter(
        field_name='year',
        lookup_expr='lte',  # less than or equal
        label='Год до'
    )

    class Meta:
        model = Publication
        fields = {
            'year': ['exact'],  # Оставляем точное совпадение для обратной совместимости
            'direction': ['exact'],
            'authors_employees': ['exact'],
        }