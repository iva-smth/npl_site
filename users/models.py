from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class CustomUser(AbstractUser):
    """Расширенная модель пользователя"""
    ROLE_CHOICES = [
        ('admin', 'Администратор'),
        ('editor', 'Редактор'),
        ('moderator', 'Модератор'),
    ]
    
    role = models.CharField(
        "Роль",
        max_length=20,
        choices=ROLE_CHOICES,
        default='editor'
    )
    phone = models.CharField("Телефон", max_length=20, blank=True)
    avatar = models.ImageField("Аватар", upload_to='avatars/', blank=True, null=True)
    
    # Переопределяем связи с Group и Permission с уникальными related_name
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='customuser_set',  # Уникальное имя!
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='customuser_set',  # Уникальное имя!
        related_query_name='customuser',
    )
    
    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return self.username