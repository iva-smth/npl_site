import { Link } from 'react-router-dom';
import type { PublicationList } from '../types';

interface Props {
  pub: PublicationList;
}

export function PublicationCard({ pub }: Props) {
  // Формируем полный список авторов для отображения в карточке
  const employeeNames = pub.authors_employees.map(emp => emp.full_name);
  const externalAuthors = pub.external_authors ? pub.external_authors.split(',').map(s => s.trim()) : [];
  
  // Объединяем списки. Сначала сотрудники, потом внешние (или наоборот, по желанию)
  const allAuthors = [...employeeNames, ...externalAuthors].join(', ');

  return (
    <Link
      to={`/publications/${pub.slug}`}
      className="group flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all w-full items-start"
    >
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 flex items-baseline gap-2 flex-wrap">
          <span>{pub.title}</span>
          <span className="text-sm font-normal text-gray-400 shrink-0 whitespace-nowrap">
            ({pub.year})
          </span>
        </h3>
        
        {/* Отображаем всех авторов */}
        {allAuthors && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-1 italic">
            {allAuthors}
          </p>
        )}

        {pub.doi && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>DOI:</span>
            <span className="truncate max-w-[200px]">{pub.doi}</span>
          </div>
        )}
      </div>
      
      <div className="hidden sm:flex items-center justify-center w-10 h-10 shrink-0 text-gray-300 group-hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}