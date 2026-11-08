from django.db import models
from django.utils.text import slugify

class EquipmentCategory(models.Model):
    """Категории оборудования с поддержкой вложенности"""
    title = models.CharField("Название категории", max_length=100)
    slug = models.SlugField("URL-метка", unique=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Родительская категория"
    )

    class Meta:
        verbose_name = "Категория оборудования"
        verbose_name_plural = "Категории оборудования"
        ordering = ['title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        # Отображаем путь, например: "Электроника > Осциллографы"
        if self.parent:
            return f"{self.parent} > {self.title}"
        return self.title


class Equipment(models.Model):
    """Оборудование лаборатории"""
    title = models.CharField("Название оборудования", max_length=200)
    slug = models.SlugField("URL-метка", unique=True, blank=True)
    description = models.TextField("Описание")
    specs = models.TextField("Технические характеристики", blank=True)
    image = models.ImageField("Фото", upload_to='equipment/', blank=True, null=True)
    
    # Связи
    category = models.ForeignKey(
        EquipmentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Категория"
    )
    direction = models.ForeignKey(
        'research.ResearchDirection',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipment',
        verbose_name="Направление"
    )
    related_equipment = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=True,
        verbose_name="Сопутствующее оборудование"
    )
    
    created_at = models.DateTimeField("Дата добавления", auto_now_add=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = "Оборудование"
        verbose_name_plural = "Оборудование"
        ordering = ['title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title