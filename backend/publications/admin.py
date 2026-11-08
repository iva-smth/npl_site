from django.contrib import admin
from .models import Publication


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'direction')
    list_filter = ('year', 'direction')
    search_fields = ('title', 'authors', 'doi')
    prepopulated_fields = {'slug': ('title',)}