import { Link } from 'react-router-dom';
import type { Employee } from '../types';

interface ContactCardProps {
  employee: Employee;
}

export function ContactCard({ employee }: ContactCardProps) {
  return (
    <Link
      to={`/team/${employee.id}`}
      className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 w-full"
    >
      {/* Фото */}
      <div className="w-20 h-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
        {employee.photo_url ? (
          <img
            src={employee.photo_url}
            alt={employee.full_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-blue-700 transition-colors truncate">
          {employee.full_name}
        </h3>
        
        {/* Должность (исправлено) */}
        <p className="text-sm text-gray-500 mb-2 truncate">
          {employee.position_title || 'Должность не указана'}
        </p>

        {/* Контакты */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
          {employee.email && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {employee.email}
            </span>
          )}
          {employee.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {employee.phone}
            </span>
          )}
        </div>
      </div>

      {/* Стрелка или индикатор перехода */}
      <div className="hidden sm:block text-gray-300 group-hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}