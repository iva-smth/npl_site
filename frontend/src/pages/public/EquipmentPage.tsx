// src/pages/public/EquipmentPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import type { Equipment, EquipmentCategory } from '../../types';

// Вспомогательная функция для сбора всех ID категории и её детей
const getAllCategoryIds = (category: EquipmentCategory | null, allCategories: EquipmentCategory[]): number[] => {
  if (!category) return [];
  
  const ids = [category.id];
  
  // Ищем детей в плоском списке (так как API может отдавать дерево, но нам удобно искать по ссылке)
  // Но так как у нас рекурсивная структура в state, можно искать прямо в children
  if (category.children && category.children.length > 0) {
    category.children.forEach(child => {
      ids.push(...getAllCategoryIds(child, allCategories));
    });
  }
  
  return ids;
};

interface CategoryTreeProps {
  categories: EquipmentCategory[];
  onSelect: (id: number | null) => void; // null означает "Все оборудование"
  selectedId: number | null;
}

function CategoryTree({ categories, onSelect, selectedId }: CategoryTreeProps) {
  if (!Array.isArray(categories)) return null;

  return (
    <ul className="space-y-2 pl-4 border-l border-gray-200 ml-2">
      {categories.map((cat) => (
        <li key={cat.id}>
          <button
            onClick={() => onSelect(cat.id)}
            className={`text-left w-full py-1 px-2 rounded hover:bg-gray-100 text-sm transition-colors ${
              selectedId === cat.id ? 'bg-primary text-white font-bold' : 'text-gray-700'
            }`}
          >
            {cat.title}
          </button>
          {/* Рекурсивный вызов для дочерних категорий */}
          {cat.children && cat.children.length > 0 && (
            <CategoryTree 
              categories={cat.children} 
              onSelect={onSelect} 
              selectedId={selectedId} 
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  
  const [loading, setLoading] = useState(true);
  // null здесь означает режим "Показать всё оборудование"
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Загружаем корневые категории при монтировании
  useEffect(() => {
    setLoading(true);
    apiClient.get<EquipmentCategory[]>('/equipment-categories/')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && typeof response.data === 'object' && 'results' in response.data) {
           setCategories((response.data as any).results);
        }
      })
      .catch(err => console.error("Ошибка загрузки категорий", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Загружаем оборудование при изменении фильтров
  useEffect(() => {
    setLoading(true);
    
    let params: any = {};
    
    if (searchQuery) {
      params.search = searchQuery;
    } else if (selectedCategoryId !== undefined) {
      // Если выбрана категория (не null), собираем все ID (родитель + дети)
      if (selectedCategoryId !== null) {
        // Находим объект категории в дереве, чтобы получить детей
        // Для простоты поиска в рекурсивном дереве можно использовать небольшую вспомогательную функцию поиска,
        // но так как мы храним дерево в state, мы можем передать всё дерево в getAllCategoryIds, 
        // если найдем корень. 
        
        // Упрощенный вариант: так как API отдает дерево, нам нужно найти категорию по ID в этом дереве.
        // Но проще сделать так: если выбран ID, мы просто отправляем его. 
        // А БЭкенд должен сам понять, что это родитель? Нет, DRF filter так не умеет из коробки без кастомного фильтра.
        
        // ПОЭТОМУ: Мы используем кастомный параметр category__in, который мы добавили в views.py
        // Нам нужно собрать список ID.
        
        // Функция поиска категории в дереве по ID
        const findCategoryById = (cats: EquipmentCategory[], id: number): EquipmentCategory | null => {
          for (const cat of cats) {
            if (cat.id === id) return cat;
            if (cat.children) {
              const found = findCategoryById(cat.children, id);
              if (found) return found;
            }
          }
          return null;
        };

        const targetCat = findCategoryById(categories, selectedCategoryId);
        if (targetCat) {
          const allIds = getAllCategoryIds(targetCat, categories);
          params.category__in = allIds.join(','); // Передаем как строку "1,2,3"
        } else {
          params.category = selectedCategoryId; // Фолбэк, если вдруг не нашли в дереве (например, баг)
        }
      }
      // Если selectedCategoryId === null, то params остается пустым -> загружаем ВСЕ оборудование
    }

    apiClient.get<{ results: Equipment[] }>('/equipment/', { params })
      .then((response) => {
        const data = response.data?.results || [];
        setEquipmentList(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Ошибка загрузки оборудования:", error);
        setEquipmentList([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategoryId, searchQuery, categories]); // Добавил categories в зависимости, т.к. используем его для поиска детей

  const handleCategorySelect = (id: number | null) => {
    setSelectedCategoryId(id);
    setSearchQuery(''); // Сброс поиска при выборе категории
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedCategoryId(null); // При поиске сбрасываем фильтр категории, чтобы искать везде
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог оборудования</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Левая колонка: Дерево категорий */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow h-fit">
          <div className="mb-4">
             <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left py-2 px-3 rounded font-bold transition-colors ${
                  selectedCategoryId === null 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
             >
               Оборудование
             </button>
          </div>
          
          <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-2 pl-3">Категории</h3>
          
          {loading && categories.length === 0 ? (
            <p className="text-gray-500 text-sm pl-3">Загрузка...</p>
          ) : (
            <CategoryTree 
              categories={categories} 
              onSelect={handleCategorySelect} 
              selectedId={selectedCategoryId} 
            />
          )}
        </div>

        {/* Правая колонка: Список оборудования */}
        <div className="w-full md:w-3/4">
          {/* Поиск */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {loading ? (
            <div className="text-center py-10">Загрузка оборудования...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipmentList.length > 0 ? (
                equipmentList.map((item) => (
                  <Link
                    key={item.id}
                    to={`/equipment/${item.slug}`}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white flex flex-col h-full"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                        Нет фото
                      </div>
                    )}
                    
                    <div className="p-4 flex-grow">
                      <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                      
                      {item.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                          {item.category.title}
                        </span>
                      )}

                      <p className="text-gray-600 text-sm line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="px-4 py-2 bg-gray-50 border-t text-primary font-medium text-sm">
                      Подробнее &rarr;
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  {selectedCategoryId !== null
                    ? "В этой категории и её подкатегориях пока нет оборудования." 
                    : "Оборудование не найдено. Попробуйте изменить запрос."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}