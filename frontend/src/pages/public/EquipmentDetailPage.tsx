import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { equipmentApi } from '../../api/services/equipment';
import type { Equipment } from '../../types';

export function EquipmentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    equipmentApi.getBySlug(slug)
      .then((response) => setEquipment(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Загрузка...</div>;
  }

  if (!equipment) {
    return <div className="container mx-auto px-4 py-8 text-center">Оборудование не найдено</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Главная</Link>
        <span className="mx-2">/</span>
        <Link to="/equipment" className="hover:text-primary">Оборудование</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{equipment.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Фото */}
        <div>
          {equipment.image_url ? (
            <img
              src={equipment.image_url}
              alt={equipment.title}
              className="w-full rounded-lg shadow-lg object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              Нет изображения
            </div>
          )}
        </div>

        {/* Информация */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{equipment.title}</h1>
          
          {equipment.category && (
            <div className="mb-6">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Категория</span>
              <p className="text-lg font-medium text-primary">
                {equipment.category.title}
              </p>
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-bold mb-2">Описание</h3>
            <p className="text-gray-700 whitespace-pre-line">{equipment.description}</p>
          </div>

          {equipment.specs && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Технические характеристики</h3>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                {equipment.specs}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}