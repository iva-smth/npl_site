from django.contrib import admin
from .models import Position, Employee

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')
    ordering = ('order',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'position', 'direction', 'email')
    list_filter = ('position', 'direction', 'group')
    search_fields = ('full_name', 'email')