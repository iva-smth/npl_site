import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicationsApi } from '../../api/services/publications';
import type { PublicationDetail } from '../../types';

export function PublicationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pub, setPub] = useState<PublicationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    publicationsApi.getBySlug(slug)
      .then(res => setPub(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (!pub) return <div className="container mx-auto px-4 py-8 text-center">Публикация не найдена</div>;

  // Разделяем авторов для детального просмотра
  const hasEmployees = pub.authors_employees.length > 0;
  const hasExternal = !!pub.external_authors && pub.external_authors.trim() !== '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Главная</Link>
        <span>/</span>
        <Link to="/publications" className="hover:text-primary">Публикации</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{pub.title}</span>
      </nav>

      <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-full">
            {pub.year}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-6 leading-tight">
          {pub.title}
        </h1>

        <div className="prose prose-lg max-w-none mb-8 text-gray-700">
          <h3 className="text-xl font-bold text-gray-900 mb-3 not-prose">Аннотация</h3>
          <p className="whitespace-pre-line">{pub.abstract || 'Аннотация отсутствует.'}</p>
        </div>

        {/* Блок авторов */}
        {(hasEmployees || hasExternal) && (
          <div className="border-t border-gray-100 pt-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Авторы</h3>
            
            <div className="flex flex-wrap gap-y-3 gap-x-4">
              {/* 1. Сотрудники лаборатории (с кнопками) */}
              {hasEmployees && (
                <div className="flex flex-wrap gap-2 w-full mb-2">
                  {pub.authors_employees.map(emp => (
                    <Link
                      key={emp.id}
                      to={`/team/${emp.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                    >
                      {emp.full_name}
                      <span className="ml-1 text-xs opacity-70">(НПЛ ИПЭПТ)</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* 2. Внешние авторы (просто текст) */}
              {hasExternal && (
                <div className="text-gray-700 text-base w-full">
                  <span className="font-semibold text-gray-900 mr-2">Соавторы:</span>
                  {pub.external_authors}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          {pub.doi && (
            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
              Перейти по DOI
            </a>
          )}
          {pub.link && (
            <a href={pub.link} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors">
              Внешняя ссылка
            </a>
          )}
          {pub.pdf_url && (
            <a href={pub.pdf_url} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              Скачать PDF
            </a>
          )}
        </div>
      </article>
    </div>
  );
}