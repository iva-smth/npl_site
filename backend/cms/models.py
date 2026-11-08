from django.db import models


class Page(models.Model):
    """Динамические страницы сайта"""
    title = models.CharField("Заголовок страницы", max_length=200)
    slug = models.SlugField("URL-метка", unique=True)
    content = models.TextField("Содержимое", blank=True)
    is_published = models.BooleanField("Опубликована", default=True)
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = "Страница"
        verbose_name_plural = "Страницы"

    def __str__(self):
        return self.title


class PageBlock(models.Model):
    """Блоки контента для страниц (конструктор)"""
    BLOCK_TYPE_CHOICES = [
        ('text', 'Текстовый блок'),
        ('image', 'Изображение'),
        ('video', 'Видео'),
        ('carousel', 'Карусель'),
        ('cards', 'Карточки'),
    ]
    
    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        related_name='blocks',
        verbose_name="Страница"
    )
    block_type = models.CharField(
        "Тип блока",
        max_length=20,
        choices=BLOCK_TYPE_CHOICES
    )
    title = models.CharField("Заголовок блока", max_length=200, blank=True)
    content = models.TextField("Содержимое", blank=True)
    image = models.ImageField("Изображение", upload_to='cms_blocks/', blank=True, null=True)
    order = models.PositiveIntegerField("Порядок", default=0)
    is_active = models.BooleanField("Активен", default=True)
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    class Meta:
        verbose_name = "Блок страницы"
        verbose_name_plural = "Блоки страниц"
        ordering = ['page', 'order']

    def __str__(self):
        return f"{self.block_type} — {self.title or 'Без названия'}"


class SiteMenu(models.Model):
    """Меню навигации"""
    name = models.CharField("Название меню", max_length=100)
    slug = models.SlugField("URL-метка", unique=True)
    is_active = models.BooleanField("Активно", default=True)

    class Meta:
        verbose_name = "Меню"
        verbose_name_plural = "Меню"

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    """Пункты меню"""
    menu = models.ForeignKey(
        SiteMenu,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name="Меню"
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Родительский пункт"
    )
    title = models.CharField("Название", max_length=100)
    url = models.CharField("URL", max_length=200)
    order = models.PositiveIntegerField("Порядок", default=0)
    is_active = models.BooleanField("Активен", default=True)

    class Meta:
        verbose_name = "Пункт меню"
        verbose_name_plural = "Пункты меню"
        ordering = ['menu', 'order']

    def __str__(self):
        return self.title


class ChangeLog(models.Model):
    """Журнал изменений (ТЗ: Дополнительные возможности)"""
    user = models.CharField("Пользователь", max_length=100)
    action = models.CharField("Действие", max_length=200)
    model_name = models.CharField("Модель", max_length=100)
    object_id = models.PositiveIntegerField("ID объекта", null=True, blank=True)
    timestamp = models.DateTimeField("Время", auto_now_add=True)
    details = models.TextField("Детали", blank=True)

    class Meta:
        verbose_name = "Запись журнала изменений"
        verbose_name_plural = "Журнал изменений"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user} — {self.action} ({self.timestamp})"