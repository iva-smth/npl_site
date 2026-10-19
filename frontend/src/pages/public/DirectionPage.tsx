// src/pages/public/DirectionPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { directionsApi } from '../../api/services/directions';
import { GroupCard } from '../../components/GroupCard';
import { EmployeeCard } from '../../components/EmployeeCard'; // Импорт карточки сотрудника
import type { ResearchDirection, Employee, Equipment } from '../../types'; // Обновляем импорт типов

export function DirectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [direction, setDirection] = useState<ResearchDirection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    directionsApi.getBySlug(slug)
      .then(res => setDirection(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  if (!direction) {
    return <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center text-center">Направление не найдено</div>;
  }

  // Приводим типы для новых полей, так как они могут быть не описаны в базовом интерфейсе ResearchDirection в types/index.ts
  // Если вы обновили types/index.ts, приведение не обязательно, но для безопасности оставим проверку
  const keyEmployees = (direction as any).key_employees as Employee[] || [];
  const featuredEquipment = (direction as any).featured_equipment as Equipment[] || [];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Хлебные крошки */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Главная</Link>
        <span>/</span>
        <Link to="/directions" className="hover:text-primary">Направления</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{direction.title}</span>
      </nav>

      {/* Заголовок и изображение направления */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{direction.title}</h1>
        {direction.image_url && (
          <div className="w-full h-64 md:h-80 overflow-hidden rounded-2xl shadow-sm mb-8">
            <img
              src={direction.image_url}
              alt={direction.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{direction.description}</p>
        </div>
      </header>

      {/* Секция рабочих групп */}
      {direction.groups && direction.groups.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Рабочие группы направления
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {direction.groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center mb-12">
          <p className="text-gray-500">В этом направлении пока нет зарегистрированных рабочих групп.</p>
        </div>
      )}

      {/* НОВАЯ СЕКЦИЯ: Ключевые сотрудники */}
      {keyEmployees.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Сотрудники
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyEmployees.map(emp => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link 
              to={`/team?direction=${direction.id}`} 
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Вся команда направления →
            </Link>
          </div>
        </section>
      )}

      {/* НОВАЯ СЕКЦИЯ: Оборудование */}
      {featuredEquipment.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Оборудование направления
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquipment.map(item => (
              <Link
                key={item.id}
                to={`/equipment/${item.slug}`}
                className="group block border rounded-lg overflow-hidden hover:shadow-lg transition bg-white flex flex-col h-full"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    Нет фото
                  </div>
                )}
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link 
              to={`/equipment?direction=${direction.id}`} 
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Все оборудование направления →
            </Link>
          </div>
        </section>
      )}

      {/* Старые кнопки-ссылки можно удалить или оставить как резервные, но по ТЗ они заменяются карточками */}
    </div>
  );
}