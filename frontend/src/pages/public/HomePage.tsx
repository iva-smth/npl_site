import { useEffect, useState } from 'react';
import { directionsApi } from '../../api/services/directions';
import type { ResearchDirection } from '../../types';

export function HomePage() {
  const [directions, setDirections] = useState<ResearchDirection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    directionsApi.getAll()
      .then((response) => {
        if (response.data?.results) {
          setDirections(response.data.results);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Герой-блок */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Научно-производственная лаборатория ИПЭПТ ТПУ
        </h1>
        <p className="text-lg text-gray-600">
          Импульсно-пучковые, электроразрядные и плазменные технологии
        </p>
      </section>

      {/* Направления */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Направления исследований</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {directions.map((direction) => (
            <div key={direction.id} className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{direction.title}</h3>
              <p className="text-gray-600 mb-4">
                {direction.description.substring(0, 100)}...
              </p>
              <a 
                href={`/directions/${direction.slug}`}
                className="text-primary hover:underline"
              >
                Подробнее →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}