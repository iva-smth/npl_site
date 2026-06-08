// src/components/EmployeeCard.tsx
import { Link } from 'react-router-dom';
import type { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Link 
      to={`/team/${employee.id}`}
      className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
    >
      <div className="w-32 h-32 mb-4 overflow-hidden rounded-full bg-gray-100">
        {employee.photo_url ? (
          <img 
            src={employee.photo_url} 
            alt={employee.full_name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            {/* Иконка заглушки */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-center text-primary mb-1 group-hover:text-blue-700 transition-colors">
        {employee.full_name}
      </h3>
      
      <p className="text-sm text-gray-500 text-center min-h-[20px]">
        {employee.position_title || 'Должность не указана'}
      </p>
      
      {(employee.direction_title || employee.group_title) && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {employee.direction_title && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
              {employee.direction_title}
            </span>
          )}
          {employee.group_title && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full">
              {employee.group_title}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}