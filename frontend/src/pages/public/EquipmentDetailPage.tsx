// src/pages/public/EquipmentDetailPage.tsx

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

      {/* НОВАЯ СЕКЦИЯ: Сопутствующее оборудование */}
      {equipment.related_equipment && equipment.related_equipment.length > 0 && (
        <section className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Сопутствующее оборудование</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {equipment.related_equipment.map((item) => (
              <Link
                key={item.id}
                to={`/equipment/${item.slug}`}
                className="group block border rounded-lg overflow-hidden hover:shadow-md transition bg-white flex flex-col h-full"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
                <div className="p-4 flex-grow">
                  <h3 className="text-base font-bold text-primary group-hover:text-blue-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}