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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Хлебные крошки */}
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

        <div className="border-t border-gray-100 pt-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Авторы</h3>
          <div className="flex flex-wrap gap-2">
            {pub.authors_employees.length > 0 ? (
              pub.authors_employees.map(emp => (
                <Link 
                  key={emp.id} 
                  to={`/team/${emp.id}`}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm transition-colors border border-gray-200"
                >
                  {emp.full_name}
                </Link>
              ))
            ) : (
              <p className="text-gray-500 italic">{pub.authors}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {pub.doi && (
            <a 
              href={`https://doi.org/${pub.doi}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Перейти по DOI
            </a>
          )}
          
          {pub.link && (
            <a 
              href={pub.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
            >
              Внешняя ссылка
            </a>
          )}

          {pub.pdf_url && (
            <a 
              href={pub.pdf_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Скачать PDF
            </a>
          )}
        </div>
      </article>
    </div>
  );
}