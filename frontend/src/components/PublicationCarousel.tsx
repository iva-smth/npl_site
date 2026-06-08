import { Link } from 'react-router-dom';
import type { PublicationList } from '../types';

interface Props {
  publications: PublicationList[];
  employeeId: number;
}

export function PublicationCarousel({ publications, employeeId }: Props) {
  if (!publications || publications.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-primary">Публикации</h3>
      
      {/* Горизонтальная прокрутка */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {publications.map((pub) => (
          <div 
            key={pub.id} 
            className="snap-start shrink-0 w-72 bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
              {pub.year}
            </span>
            <h4 className="font-medium text-sm line-clamp-2 mb-2 h-10">{pub.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-1">{pub.authors}</p>
          </div>
        ))}
        
        {/* Кнопка "Все публикации" в конце списка */}
        <Link 
          to={`/publications?author=${employeeId}`} 
          className="snap-start shrink-0 w-72 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Все публикации сотрудника →
        </Link>
      </div>
    </div>
  );
}