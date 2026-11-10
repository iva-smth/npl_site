// frontend/src/components/PublicationFilters.tsx
import { useEffect, useState } from 'react';
import { directionsApi } from '../api/services/directions';
import { publicationsApi } from '../api/services/publications';
import { YearRangeSlider } from './YearRangeSlider';
import type { ResearchDirection } from '../types';

interface Props {
  selectedYearFrom: number | null;
  selectedYearTo: number | null;
  selectedDirId: number | null;
  ordering: string | null;
  onYearFromChange: (y: number | null) => void;
  onYearToChange: (y: number | null) => void;
  onDirChange: (id: number | null) => void;
  onOrderingChange: (val: string | null) => void;
}

export function PublicationFilters({
  selectedYearFrom,
  selectedYearTo,
  selectedDirId,
  ordering,
  onYearFromChange,
  onYearToChange,
  onDirChange,
  onOrderingChange,
}: Props) {
  const [directions, setDirections] = useState<ResearchDirection[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    directionsApi.getAll().then(res => {
      if (res.data?.results) setDirections(res.data.results);
    });
    publicationsApi.getYears().then(res => {
      setAvailableYears(res.data);
    });
  }, []);

  const minYear = availableYears.length > 0 ? Math.min(...availableYears) : 2000;
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;

  const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{title}</h4>
      {children}
    </div>
  );

  return (
    <aside className="w-full lg:w-1/4 shrink-0 space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
        {/* Единый слайдер диапазона лет */}
        <FilterGroup title="Период публикации">
          <YearRangeSlider
            minYear={minYear}
            maxYear={maxYear}
            yearFrom={selectedYearFrom}
            yearTo={selectedYearTo}
            onYearFromChange={onYearFromChange}
            onYearToChange={onYearToChange}
          />
        </FilterGroup>

        {/* Сортировка */}
        <FilterGroup title="Сортировка">
          <select
            value={ordering || 'default'}
            onChange={(e) => onOrderingChange(e.target.value === 'default' ? null : e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none text-sm"
          >
            <option value="default">По умолчанию (новые)</option>
            <option value="title">По названию (А-Я)</option>
            <option value="-title">По названию (Я-А)</option>
            <option value="year">По году (старые сначала)</option>
            <option value="-year">По году (новые сначала)</option>
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