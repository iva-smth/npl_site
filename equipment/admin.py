from django.contrib import admin
from .models import EquipmentCategory, Equipment

@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'direction', 'created_at')
    list_filter = ('category', 'direction')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}