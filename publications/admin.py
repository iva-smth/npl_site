from django.contrib import admin
from .models import PublicationType, Publication

@admin.register(PublicationType)
class PublicationTypeAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'pub_type', 'direction')
    list_filter = ('year', 'pub_type', 'direction')
    search_fields = ('title', 'authors', 'doi')
    prepopulated_fields = {'slug': ('title',)}