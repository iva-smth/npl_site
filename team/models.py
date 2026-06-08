from django.db import models


class Position(models.Model):
    """Должности сотрудников"""
    title = models.CharField("Название должности", max_length=100)
    order = models.PositiveIntegerField("Порядок отображения", default=0)

    class Meta:
        verbose_name = "Должность"
        verbose_name_plural = "Должности"
        ordering = ['order']

    def __str__(self):
        return self.title


class Employee(models.Model):
    """Сотрудники лаборатории"""
    full_name = models.CharField("ФИО", max_length=200)
    position = models.ForeignKey(
        Position,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Должность"
    )
    
    photo = models.ImageField("Фото", upload_to='employees/', blank=True, null=True)
    bio = models.TextField("Биография", blank=True)
    
    email = models.EmailField("Email", blank=True)
    phone = models.CharField("Телефон", max_length=20, blank=True)
    
    show_email = models.BooleanField("Показывать email", default=True)
    show_phone = models.BooleanField("Показывать телефон", default=False)
    is_public_contact = models.BooleanField(
        "Отображать на странице контактов", 
        default=False,
        help_text="Если отмечено, сотрудник появится на странице 'Контакты' с открытыми данными."
    )

    direction = models.ForeignKey(
        'research.ResearchDirection',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='employees',
        verbose_name="Направление"
    )
    group = models.ForeignKey(
        'research.ResearchGroup',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='employees',
        verbose_name="Рабочая группа"
    )
    
    created_at = models.DateTimeField("Дата добавления", auto_now_add=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        ordering = ['full_name']

    def __str__(self):
        return self.full_name