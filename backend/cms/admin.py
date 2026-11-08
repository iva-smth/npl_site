from django.contrib import admin
from .models import Page, PageBlock, SiteMenu, MenuItem, ChangeLog

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(PageBlock)
class PageBlockAdmin(admin.ModelAdmin):
    list_display = ('title', 'block_type', 'page', 'order', 'is_active')
    list_filter = ('block_type', 'is_active')

@admin.register(SiteMenu)
class SiteMenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'menu', 'order', 'is_active')
    list_filter = ('menu', 'is_active')

@admin.register(ChangeLog)
class ChangeLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'model_name', 'timestamp')
    list_filter = ('timestamp', 'model_name')