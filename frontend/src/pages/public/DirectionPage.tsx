// src/pages/public/DirectionPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { directionsApi } from '../../api/services/directions';
import { GroupCard } from '../../components/GroupCard';
import { EmployeeCard } from '../../components/EmployeeCard';
import type { ResearchDirection, Employee, Equipment, ResearchGroup } from '../../types';

// Расширенные типы с дополнительными полями
interface ExtendedEmployee extends Employee {
  position_title?: string;
  is_head?: boolean;
  role?: string;
}

interface ExtendedResearchGroup extends Omit<ResearchGroup, 'head'> {
  head?: ExtendedEmployee | null;
}

interface ExtendedResearchDirection extends Omit<ResearchDirection, 'head' | 'key_employees' | 'groups'> {
  head?: ExtendedEmployee | null;
  key_employees?: ExtendedEmployee[];
  featured_equipment?: Equipment[];
  groups?: ExtendedResearchGroup[];
}

export function DirectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [direction, setDirection] = useState<ExtendedResearchDirection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    directionsApi.getBySlug(slug)
      .then(res => setDirection(res.data))
      .catch(err => console.error('Ошибка загрузки направления:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-medium">Загрузка данных...</div>
      </div>
    );
  }

  if (!direction) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Направление не найдено</h2>
        <Link to="/directions" className="text-primary hover:underline transition-colors">
          Вернуться к списку направлений
        </Link>
      </div>
    );
  }

  const keyEmployees = direction.key_employees || [];
  const featuredEquipment = direction.featured_equipment || [];
  
  // Выделяем главного сотрудника направления
  const directionHead = direction.head || keyEmployees.find(emp => emp.is_head || emp.role === 'head');
  
  // Остальные сотрудники (исключая руководителя)
  const regularEmployees = keyEmployees.filter(emp => emp.id !== directionHead?.id);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Хлебные крошки */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
        <span>/</span>
        <Link to="/directions" className="hover:text-primary transition-colors">Направления</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]" title={direction.title}>
          {direction.title}
        </span>
      </nav>

      {/* Заголовок и изображение направления */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{direction.title}</h1>
        {direction.image_url && (
          <div className="w-full h-64 md:h-80 overflow-hidden rounded-2xl shadow-sm mb-8 bg-gray-100">
            <img
              src={direction.image_url}
              alt={direction.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{direction.description}</p>
        </div>
      </header>

      {/* === СЕКЦИЯ 1: Руководитель направления === */}
      {directionHead && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Руководитель направления
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <EmployeeCard employee={directionHead} />
          </div>
        </section>
      )}

      {/* === СЕКЦИЯ 2: Рабочие группы === */}
      {direction.groups && direction.groups.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Рабочие группы направления
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {direction.groups.map(group => (
              <div key={group.id} className="flex flex-col h-full">
                {/* Выделение руководителя конкретной рабочей группы */}
                {group.head && (
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 shadow-sm">
                    {group.head.photo_url ? (
                      <img 
                        src={group.head.photo_url} 
                        alt={group.head.full_name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 flex-shrink-0" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                        Фото
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Руководитель группы</div>
                      <div className="text-sm font-bold text-gray-900 truncate" title={group.head.full_name}>
                        {group.head.full_name}
                      </div>
                      <div className="text-xs text-gray-600 truncate" title={group.head.position_title || ''}>
                        {group.head.position_title || ''}
                      </div>
                    </div>
                  </div>
                )}
                <GroupCard group={group as ResearchGroup} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center mb-12">
          <p className="text-gray-500">В этом направлении пока нет зарегистрированных рабочих групп.</p>
        </div>
      )}

      {/* === СЕКЦИЯ 3: Остальные сотрудники === */}
      {regularEmployees.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Сотрудники направления
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularEmployees.map(emp => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link 
              to={`/team?direction=${direction.id}`} 
              className="inline-flex items-center text-primary font-semibold hover:underline transition-colors"
            >
              Вся команда направления →
            </Link>
          </div>
        </section>
      )}

      {/* === СЕКЦИЯ 4: Оборудование === */}
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
                className="group block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white flex flex-col h-full"
              >
                {item.image_url ? (
                  <div className="w-full h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.image_url}
                      alt={item.title || 'Оборудование'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link 
              to={`/equipment?direction=${direction.id}`} 
              className="inline-flex items-center text-primary font-semibold hover:underline transition-colors"
            >
              Все оборудование направления →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}