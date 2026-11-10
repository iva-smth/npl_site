// frontend/src/pages/public/PublicationsPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicationsApi } from '../../api/services/publications';
import { PublicationCard } from '../../components/PublicationCard';
import { PublicationFilters } from '../../components/PublicationFilters';
import type { PublicationList } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export function PublicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Читаем параметры из URL
  const authorId = searchParams.get('author_id');
  const yearFromParam = searchParams.get('year_from');
  const yearToParam = searchParams.get('year_to');
  const dirParam = searchParams.get('direction');
  const pageParam = searchParams.get('page');
  const orderingParam = searchParams.get('ordering');
  const searchParam = searchParams.get('search');

  const [data, setData] = useState<PaginatedResponse<PublicationList> | null>(null);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchParam || '');

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    
    if (authorId) params.authors_employees = authorId;
    if (yearFromParam) params.year_from = yearFromParam;
    if (yearToParam) params.year_to = yearToParam;
    if (dirParam) params.direction = dirParam;
    if (pageParam) params.page = pageParam;
    if (orderingParam) params.ordering = orderingParam;
    if (searchParam) params.search = searchParam;

    publicationsApi.getAll(params)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [authorId, yearFromParam, yearToParam, dirParam, pageParam, orderingParam, searchParam]);

  const updateFilter = useCallback((key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete('page'); // Сброс страницы при смене фильтра
      return next;
    });
  }, [setSearchParams]);

  const handleYearRangeChange = useCallback((from: number | null, to: number | null) => {
  setSearchParams(prev => {
    const next = new URLSearchParams(prev);
    if (from) next.set('year_from', String(from));
    else next.delete('year_from');
    if (to) next.set('year_to', String(to));
    else next.delete('year_to');
    next.delete('page');
    return next;
  });
}, [setSearchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    updateFilter('search', val || null);
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageFromUrl = (url: string | null): number | null => {
    if (!url) return null;
    try {
      const u = new URL(url);
      return Number(u.searchParams.get('page'));
    } catch {
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-primary">Публикации</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Левая колонка: Фильтры */}
        <PublicationFilters
          selectedYearFrom={yearFromParam ? Number(yearFromParam) : null}
          selectedYearTo={yearToParam ? Number(yearToParam) : null}
          selectedDirId={dirParam ? Number(dirParam) : null}
          ordering={orderingParam}
          onYearFromChange={(v) => updateFilter('year_from', v ? String(v) : null)}
          onYearToChange={(v) => updateFilter('year_to', v ? String(v) : null)}
          onYearRangeChange={handleYearRangeChange}
          onDirChange={(v) => updateFilter('direction', v ? String(v) : null)}
          onOrderingChange={(v) => updateFilter('ordering', v)}
        />

        {/* Правая колонка: Поиск и Список */}
        <main className="w-full lg:w-3/4">
          {/* Поле поиска */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Поиск по названию, автору или DOI..."
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-white"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl w-full"></div>
              ))}
            </div>
          ) : data?.results.length ? (
            <>
              <div className="space-y-4 mb-8">
                {data.results.map(pub => (
                  <PublicationCard key={pub.id} pub={pub} />
                ))}
              </div>

              {/* Пагинация */}
              {(data.next || data.previous) && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {data.previous && (
                    <button
                      onClick={() => {
                        const p = getPageFromUrl(data.previous);
                        if (p) handlePageChange(p);
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-primary font-medium"
                    >
                      ← Назад
                    </button>
                  )}
                  <span className="text-sm text-gray-500 px-4">
                    Страница {pageParam || 1}
                  </span>
                  {data.next && (
                    <button
                      onClick={() => {
                        const p = getPageFromUrl(data.next);
                        if (p) handlePageChange(p);
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-primary font-medium"
                    >
                      Далее →
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Публикации не найдены</p>
              <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска или фильтрации</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}