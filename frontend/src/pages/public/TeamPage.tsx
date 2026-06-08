// src/pages/public/TeamPage.tsx
import { useEffect, useState } from 'react';
import { teamApi } from '../../api/services/team';
import { directionsApi } from '../../api/services/directions';
import { EmployeeCard } from '../../components/EmployeeCard';
import { TeamFilterTree } from '../../components/TeamFilterTree';
import type { Employee, ResearchDirection } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

export function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [directions, setDirections] = useState<ResearchDirection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фильтры
  const [selectedDirId, setSelectedDirId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Загрузка структуры направлений
  useEffect(() => {
    directionsApi.getAll().then(res => {
      if (res.data?.results) setDirections(res.data.results);
    });
  }, []);

  // Загрузка сотрудников с учетом фильтров
  useEffect(() => {
    setLoading(true);
    const params: any = {};
    
    // Приоритет: группа > направление
    if (selectedGroupId) {
      params.group = selectedGroupId;
    } else if (selectedDirId) {
      params.direction = selectedDirId;
    }
    
    if (debouncedSearch) params.search = debouncedSearch;

    teamApi.getAll(params)
      .then(res => setEmployees(res.data?.results || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedDirId, selectedGroupId, debouncedSearch]);

  // Хендлеры для десктопного дерева
  const handleDirSelect = (id: number | null) => {
    setSelectedDirId(id);
    setSelectedGroupId(null);
  };

  const handleGroupSelect = (dirId: number, groupId: number) => {
    setSelectedDirId(dirId);
    setSelectedGroupId(groupId);
  };

  // Хендлер для мобильного селекта
  const handleMobileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      setSelectedDirId(null);
      setSelectedGroupId(null);
    } else if (val.startsWith('group-')) {
      const gId = Number(val.split('-')[1]);
      const parentDir = directions.find(d => d.groups?.some(g => g.id === gId));
      if (parentDir) handleGroupSelect(parentDir.id, gId);
    } else if (val.startsWith('dir-')) {
      handleDirSelect(Number(val.split('-')[1]));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-primary">Команда лаборатории</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ЛЕВАЯ КОЛОНКА: Адаптивный фильтр */}
        <aside className="w-full lg:w-1/4 shrink-0">
          
          {/* Мобильная версия: Select с optgroup */}
          <div className="block lg:hidden mb-6">
            <select
              value={
                selectedGroupId ? `group-${selectedGroupId}` 
                : selectedDirId ? `dir-${selectedDirId}` 
                : 'all'
              }
              onChange={handleMobileSelect}
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none shadow-sm"
            >
              <option value="all">Все сотрудники</option>
              {directions.map(dir => (
                <optgroup key={dir.id} label={dir.title}>
                  <option value={`dir-${dir.id}`}>Всё направление</option>
                  {dir.groups?.map(group => (
                    <option key={group.id} value={`group-${group.id}`}>
                      {group.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Десктопное дерево (вынесено в компонент) */}
          <div className="hidden lg:block bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs">Структура</h3>
            <TeamFilterTree
              directions={directions}
              selectedDirId={selectedDirId}
              selectedGroupId={selectedGroupId}
              onDirChange={handleDirSelect}
              onGroupChange={handleGroupSelect}
            />
          </div>
        </aside>

        {/* ПРАВАЯ КОЛОНКА: Поиск и Список */}
        <main className="w-full lg:w-3/4">
          {/* Глобальный поиск */}
          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Поиск по имени или должности..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Сетка сотрудников */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse min-h-[400px]">
              {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-100 rounded-xl"></div>)}
            </div>
          ) : employees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {employees.map(emp => (
                <EmployeeCard key={emp.id} employee={emp} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 min-h-[400px] flex items-center justify-center">
              <p className="text-gray-500 text-lg">Сотрудники не найдены</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}