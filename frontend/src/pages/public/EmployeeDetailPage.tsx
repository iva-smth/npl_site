import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamApi } from '../../api/services/team';
import { PublicationCarousel } from '../../components/PublicationCarousel';
import type { EmployeeDetail } from '../../types';

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    teamApi.getById(Number(id))
      .then(res => setEmployee(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (!employee) return <div className="container mx-auto px-4 py-8 text-center">Сотрудник не найден</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Хлебные крошки */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Главная</Link>
        <span>/</span>
        <Link to="/team" className="hover:text-primary">Команда</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{employee.full_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Левая колонка: Фото и Контакты */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Фото 3:4 */}
          <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
            {employee.photo_url ? (
              <img src={employee.photo_url} alt={employee.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* Контакты (рендерятся только если флаг true И значение есть) */}
          {(employee.show_email && employee.email) && (
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Email</h3>
              <a href={`mailto:${employee.email}`} className="text-primary hover:underline break-all">
                {employee.email}
              </a>
            </div>
          )}

          {(employee.show_phone && employee.phone) && (
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Телефон</h3>
              <a href={`tel:${employee.phone}`} className="text-primary hover:underline">
                {employee.phone}
              </a>
            </div>
          )}
        </aside>

        {/* Правая колонка: Информация */}
        <main className="lg:col-span-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{employee.full_name}</h1>
          <p className="text-lg text-gray-600 mb-6">{employee.position_title || 'Должность не указана'}</p>

          {/* Биография (рендерится только если есть текст) */}
          {employee.bio && (
            <div className="prose prose-lg max-w-none mb-8 text-gray-700">
              <h3 className="text-xl font-bold text-gray-900 mb-3 not-prose">Биография</h3>
              <p className="whitespace-pre-line">{employee.bio}</p>
            </div>
          )}

          {/* Карусель публикаций */}
          <PublicationCarousel 
            publications={employee.recent_publications} 
            employeeName={employee.full_name} 
          />
        </main>
      </div>
    </div>
  );
}