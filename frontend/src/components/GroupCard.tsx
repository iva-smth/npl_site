import { Link } from 'react-router-dom';
import type { ResearchGroup } from '../types';

interface GroupCardProps {
  group: ResearchGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link
      to={`/groups/${group.slug}`} // Ссылка на детальную страницу группы
      className="group block p-6 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all hover:border-primary/30 h-full flex flex-col"
    >
      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-blue-700 transition-colors">
        {group.title}
      </h3>
      
      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
        {group.description || 'Описание отсутствует.'}
      </p>
      
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
        Подробнее о группе
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}