import { useEffect, useState } from 'react';
import { directionsApi } from '../api/services/directions';
import { publicationsApi } from '../api/services/publications';
import type { ResearchDirection } from '../types';

interface Props {
  selectedYear: number | null;
  selectedDirId: number | null;
  ordering: string | null;
  // searchQuery и onSearchChange удалены
  onYearChange: (y: number | null) => void;
  onDirChange: (id: number | null) => void;
  onOrderingChange: (val: string | null) => void;
}

export function PublicationFilters({
  selectedYear, selectedDirId, ordering,
  onYearChange, onDirChange, onOrderingChange
}: Props) {
  const [directions, setDirections] = useState<ResearchDirection[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    directionsApi.getAll().then(res => {
      if (res.data?.results) setDirections(res.data.results);
    });
    // Загружаем доступные годы с бэкенда
    publicationsApi.getYears().then(res => {
      setAvailableYears(res.data);
    });
  }, []);

  const FilterGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{title}</h4>
      {children}
    </div>
  );

  return (
    <aside className="w-full lg:w-1/4 shrink-0 space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
        
        {/* Фильтр по году (Динамический) */}
        <FilterGroup title="Год публикации">
          <select
            value={selectedYear || ''}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none text-sm"
          >
            <option value="">Все годы</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Сортировка */}
        <FilterGroup title="Сортировка">
          <select
            value={ordering || 'default'}
            onChange={(e) => onOrderingChange(e.target.value === 'default' ? null : e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none text-sm"
          >
            <option value="default">По умолчанию (новые)</option>
            <option value="authors">По имени авторов (А-Я)</option>
            <option value="-authors">По имени авторов (Я-А)</option>
            <option value="title">По названию (А-Я)</option>
            <option value="-title">По названию (Я-А)</option>
          </select>
        </FilterGroup>

        {/* Фильтр по направлению */}
        <FilterGroup title="Направление">
          <div className="space-y-2">
            <button
              onClick={() => onDirChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedDirId ? 'bg-primary text-white font-medium' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              Все направления
            </button>
            {directions.map(d => (
              <button
                key={d.id}
                onClick={() => onDirChange(d.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedDirId === d.id ? 'bg-primary text-white font-medium' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>
        </FilterGroup>

      </div>
    </aside>
  );
}