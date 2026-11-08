from django.urls import path
from . import views

app_name = 'cms'

urlpatterns = [
    path('admin-entry/', views.admin_entry_point, name='admin_entry'),
]