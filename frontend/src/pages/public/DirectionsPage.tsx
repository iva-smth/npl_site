import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { directionsApi } from '../../api/services/directions';
import type { ResearchDirection } from '../../types';

export function DirectionsPage() {
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Направления исследований</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {directions.map((direction) => (
          <Link
            key={direction.id}
            to={`/directions/${direction.slug}`}
            className="border rounded-lg p-6 hover:shadow-lg transition block"
          >
            {direction.image_url && (
              <img
                src={direction.image_url}
                alt={direction.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-bold mb-2">{direction.title}</h2>
            <p className="text-gray-600">
              {direction.description.substring(0, 100)}...
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}