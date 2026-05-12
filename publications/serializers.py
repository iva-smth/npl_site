from rest_framework import serializers
from .models import Publication, PublicationType


class PublicationTypeSerializer(serializers.ModelSerializer):
    """Сериализатор для типов публикаций"""
    class Meta:
        model = PublicationType
        fields = ['id', 'title', 'slug']


class PublicationSerializer(serializers.ModelSerializer):
    """Сериализатор для публикаций"""
    pub_type = PublicationTypeSerializer(read_only=True)
    pub_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PublicationType.objects.all(),
        source='pub_type',
        write_only=True,
        required=False
    )
    pdf_url = serializers.SerializerMethodField()
    authors_employees = serializers.SerializerMethodField()
    
    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'slug', 'authors', 'abstract',
            'pub_type', 'pub_type_id', 'year', 'doi',
            'link', 'pdf_file', 'pdf_url', 'direction',
            'authors_employees', 'created_at'
        ]
        read_only_fields = ['slug', 'created_at']
    
    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file and request:
            return request.build_absolute_uri(obj.pdf_file.url)
        return obj.pdf_file.url if obj.pdf_file else None
    
    def get_authors_employees(self, obj):
        from team.serializers import EmployeeSerializer
        return EmployeeSerializer(obj.authors_employees.all(), many=True, context=self.context).data