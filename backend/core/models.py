from django.db import models


class SiteSettings(models.Model):
    """Настройки сайта"""
    site_name = models.CharField("Название сайта", max_length=200, default="НПЛ ИПЭПТ ТПУ")
    logo = models.ImageField("Логотип", upload_to='settings/', blank=True, null=True)
    description = models.TextField("Описание сайта", blank=True)
    contact_email = models.EmailField("Email для связи", blank=True)
    contact_phone = models.CharField("Телефон", max_length=20, blank=True)
    address = models.TextField("Адрес", blank=True)
    social_vk = models.URLField("VK", blank=True)
    social_telegram = models.URLField("Telegram", blank=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = "Настройки сайта"
        verbose_name_plural = "Настройки сайта"

    def __str__(self):
        return self.site_name


class Keyword(models.Model):
    """Ключевые слова для облака тегов"""
    word = models.CharField("Слово", max_length=100, unique=True)
    count = models.PositiveIntegerField("Частота", default=1)
    
    class Meta:
        verbose_name = "Ключевое слово"
        verbose_name_plural = "Ключевые слова"
        ordering = ['-count']

    def __str__(self):
        return f"{self.word} ({self.count})"