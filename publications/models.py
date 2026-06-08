from django.db import models
from django.utils.text import slugify


class Publication(models.Model):
    """Публикации сотрудников"""
    title = models.CharField("Название", max_length=300)
    slug = models.SlugField("URL-метка", unique=True, blank=True)
    authors = models.CharField("Авторы", max_length=500)
    abstract = models.TextField("Аннотация", blank=True)
    
    year = models.IntegerField("Год")
    doi = models.CharField("DOI", max_length=100, blank=True)
    link = models.URLField("Ссылка на ресурс", blank=True)
    pdf_file = models.FileField("PDF файл", upload_to='publications/', blank=True, null=True)
    
    # Связи
    direction = models.ForeignKey(
        'research.ResearchDirection',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='publications',
        verbose_name="Направление"
    )
    authors_employees = models.ManyToManyField(
        'team.Employee',
        blank=True,
        verbose_name="Авторы (сотрудники)"
    )
    
    created_at = models.DateTimeField("Дата добавления", auto_now_add=True)

    class Meta:
        verbose_name = "Публикация"
        verbose_name_plural = "Публикации"
        ordering = ['-year', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.year} — {self.title[:50]}"