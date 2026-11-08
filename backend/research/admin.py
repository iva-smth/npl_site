from django.contrib import admin
from .models import ResearchDirection, ResearchGroup

@admin.register(ResearchDirection)
class ResearchDirectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('order',)

@admin.register(ResearchGroup)
class ResearchGroupAdmin(admin.ModelAdmin):
    list_display = ('title', 'direction', 'created_at')
    list_filter = ('direction',)
    prepopulated_fields = {'slug': ('title',)}