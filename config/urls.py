from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

# Импортируем роутеры из приложений
from research.views import ResearchDirectionViewSet, ResearchGroupViewSet
from team.views import EmployeeViewSet
from equipment.views import EquipmentViewSet
from publications.views import PublicationViewSet
from core.views import home_view

router = DefaultRouter()
router.register(r'directions', ResearchDirectionViewSet, basename='direction')
router.register(r'groups', ResearchGroupViewSet, basename='group')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'publications', PublicationViewSet, basename='publication')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)), # Все API будут по адресу /api/v1/...
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('', home_view, name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)