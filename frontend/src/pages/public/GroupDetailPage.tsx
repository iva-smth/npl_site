import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { directionsApi } from '../../api/services/directions';
import { EmployeeCard } from '../../components/EmployeeCard';
import type { ResearchGroup, ResearchTopic, Employee } from '../../types';

export function GroupDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [group, setGroup] = useState<ResearchGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    directionsApi.getGroupBySlug(slug)
      .then(res => setGroup(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (!group) return <div className="container mx-auto px-4 py-8 text-center">Группа не найдена</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Хлебные крошки */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Главная</Link>
        <span>/</span>
        <Link to="/directions" className="hover:text-primary">Направления</Link>
        <span>/</span>
        <Link 
          to={`/directions/${group.direction}`} // Используем ID направления для ссылки, если slug нет в объекте
          className="hover:text-primary truncate max-w-[200px]"
        >
          {group.direction_title || 'Направление'}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{group.title}</span>
      </nav>

      {/* Заголовок и описание группы */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">{group.title}</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{group.description}</p>
        </div>
      </header>

      {/* Темы исследований (Проекты) */}
      {group.topics && group.topics.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Направления исследований</h2>
          <div className="space-y-4">
            {group.topics.map((topic: ResearchTopic) => (
              <div key={topic.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-primary mb-2">{topic.title}</h3>
                {topic.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{topic.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Сотрудники группы */}
      {group.employees && group.employees.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Команда группы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {group.employees.map((emp: Employee) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}