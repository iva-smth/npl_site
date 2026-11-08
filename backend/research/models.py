# research/models.py
from django.db import models
from django.utils.text import slugify

class ResearchDirection(models.Model):
    """Направления 1-го уровня"""
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
    """Рабочие группы 2-го уровня"""
    direction = models.ForeignKey(
        ResearchDirection,
        on_delete=models.CASCADE,
        related_name='groups',
        verbose_name="Направление"
    )
    title = models.CharField("Название группы", max_length=200)
    slug = models.SlugField("URL-метка", blank=True)
    description = models.TextField("Описание группы")
    order = models.PositiveIntegerField("Порядок отображения", default=0) # ДОБАВЛЕНО
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    members = models.ManyToManyField(
        'team.Employee',
        blank=True,
        related_name='research_groups'
    )

    class Meta:
        verbose_name = "Рабочая группа"
        verbose_name_plural = "Рабочие группы"
        ordering = ['order', 'title']
        unique_together = ('direction', 'slug') # ИЗМЕНЕНО: уникальность в рамках направления

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            # Генерируем уникальный slug в рамках направления
            slug = base_slug
            counter = 1
            while ResearchGroup.objects.filter(
                direction=self.direction, 
                slug=slug
            ).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.direction.title} — {self.title}"

    @property
    def head(self):
        """
        Автоматически возвращает главного сотрудника группы 
        на основе его должности.
        """
        # Ищем сотрудников группы, у которых должность является руководящей
        head_employee = self.members.filter(
            position__is_leadership=True
        ).order_by(
            'position__order',  # Сначала по порядку должности
            'full_name'         # Потом по алфавиту
        ).first()
        
        return head_employee

class ResearchTopic(models.Model): # ДОБАВЛЕНА МОДЕЛЬ
    """Темы/проекты исследований внутри рабочей группы"""
    group = models.ForeignKey(
        ResearchGroup,
        on_delete=models.CASCADE,
        related_name='topics',
        verbose_name="Рабочая группа"
    )
    title = models.CharField("Название темы", max_length=300)
    description = models.TextField("Описание", blank=True)
    order = models.PositiveIntegerField("Порядок отображения", default=0)

    class Meta:
        verbose_name = "Тема исследования"
        verbose_name_plural = "Темы исследований"
        ordering = ['order', 'title']

    def __str__(self):
        return self.title