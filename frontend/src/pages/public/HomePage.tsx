import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coreApi } from '../../api/services/core';
import { DirectionSlider } from '../../components/Slider';
import type { HomeData, PublicationList } from '../../types';

export function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    coreApi.getHomeData()
      .then((response) => {
        if (response.data) {
          setData(response.data);
        } else {
          setError('Получен пустой ответ от сервера');
        }
      })
      .catch((err: any) => {
        console.error("Ошибка загрузки данных главной страницы:", err);
        if (err.code === 'ERR_NETWORK') {
          setError('Не удалось соединиться с сервером. Убедитесь, что Django запущен на порту 8000.');
        } else if (err.response) {
          setError(`Ошибка сервера: ${err.response.status} ${err.response.statusText}`);
        } else {
          setError('Произошла неизвестная ошибка при загрузке.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="container mx-auto px-4 py-8 text-center">Нет данных</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Герой-блок */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Научно-производственная лаборатория<br />
            ИПЭПТ ТПУ
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Импульсно-пучковые, электроразрядные и плазменные технологии.
            Разработка, демонстрация и внедрение новых технологий взаимодействия
            импульсных потоков энергии с веществом.
          </p>
        </div>
      </section>

      {/* Слайдер направлений исследований (Без заголовка) */}
      <section className="py-12 container mx-auto px-4">
        {data.slider_directions && data.slider_directions.length > 0 ? (
          <DirectionSlider directions={data.slider_directions} />
        ) : (
          <p className="text-gray-500 text-center">Информация о направлениях пока не добавлена.</p>
        )}
      </section>

      {/* Последние публикации (Карусель) */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">
              Последние публикации
            </h2>
            <Link to="/publications" className="text-primary hover:underline font-medium">
              Все публикации →
            </Link>
          </div>
          
          {data.latest_publications && data.latest_publications.length > 0 ? (
            <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide">
              {data.latest_publications.map((pub: PublicationList) => (
                <div 
                  key={pub.id} 
                  className="snap-start shrink-0 w-80 bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-3 inline-block self-start">
                    {pub.year}
                  </span>
                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 leading-tight">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-gray-500 italic mb-4 line-clamp-1 flex-grow">
                    {pub.authors_employees.map(a => a.full_name).join(', ')}
                    {pub.external_authors && `, ${pub.external_authors}`}
                  </p>
                  <Link 
                    to={`/publications/${pub.slug}`}
                    className="mt-auto text-sm font-semibold text-primary hover:underline inline-flex items-center"
                  >
                    Подробнее
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Публикации пока не добавлены.</p>
          )}
        </div>
      </section>
    </div>
  );
}