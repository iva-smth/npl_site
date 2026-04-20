from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Отображаемые поля в списке пользователей
    list_display = ('username', 'email', 'role', 'phone', 'is_staff', 'is_active')
    
    # Фильтры справа
    list_filter = ('role', 'is_staff', 'is_active', 'groups')
    
    # Поля для редактирования
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {
            'fields': ('email', 'phone', 'avatar', 'role')
        }),
        ('Права доступа', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Даты', {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    # Поля при создании пользователя
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'role', 'password1', 'password2'),
        }),
    )
    
    # Поля, доступные для поиска
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name')
    
    # Порядок отображения
    ordering = ('username',)
    
    # Только для чтения (нельзя менять после создания)
    readonly_fields = ('last_login', 'date_joined')