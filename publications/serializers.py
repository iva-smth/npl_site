from rest_framework import serializers
from .models import Publication

class PublicationListSerializer(serializers.ModelSerializer):
    authors_employees = serializers.SerializerMethodField()

    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'slug', 'authors',
            'year', 'doi',
            'direction', 'authors_employees'
        ]

    def get_authors_employees(self, obj):
        return [
            {'id': emp.id, 'full_name': emp.full_name}
            for emp in obj.authors_employees.all()
        ]

class PublicationDetailSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()
    authors_employees = serializers.SerializerMethodField()

    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'slug', 'authors', 'abstract',
            'year', 'doi', 'link', 'pdf_file', 'pdf_url',
            'direction', 'authors_employees', 'created_at'
        ]

    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file and request:
            return request.build_absolute_uri(obj.pdf_file.url)
        return obj.pdf_file.url if obj.pdf_file else None

    def get_authors_employees(self, obj):
        return [
            {
                'id': emp.id, 
                'full_name': emp.full_name,
                'photo_url': emp.photo.url if emp.photo else None # Упрощенно
            }
            for emp in obj.authors_employees.all()
        ]