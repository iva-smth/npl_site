from django.db import models
from django.utils.text import slugify


class ResearchDirection(models.Model):
    """Направления 1-го уровня (Импульсно-пучковые, Электроразрядные, Плазменные)"""
    title = models.CharField("Название направления", max_length=200)
    slug = models.SlugField("URL-метка", unique=True, blank=True)
    description = models.TextField("Описание направления")
    image = models.ImageField("Изображение", upload_to='directions/', blank=True, null=True)
    order = models.PositiveIntegerField("Порядок отображения", default=0)
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = "Направление исследований"
        verbose_name_plural = "Направления исследований"
        ordering = ['order', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ResearchGroup(models.Model):
    """Рабочие группы 2-го уровня (подразделения внутри направлений)"""
    direction = models.ForeignKey(
        ResearchDirection,
        on_delete=models.CASCADE,
        related_name='groups',
        verbose_name="Направление"
    )
    title = models.CharField("Название группы", max_length=200)
    slug = models.SlugField("URL-метка", unique=True, blank=True)
    description = models.TextField("Описание группы")
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    class Meta:
        verbose_name = "Рабочая группа"
        verbose_name_plural = "Рабочие группы"
        ordering = ['direction', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            self.slug = f"{base_slug}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.direction.title} — {self.title}"