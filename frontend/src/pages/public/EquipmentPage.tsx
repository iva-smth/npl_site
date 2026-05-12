// src/pages/public/EquipmentPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client'; // Используем единый клиент
import type { Equipment, EquipmentCategory } from '../../types';
import type { PaginatedResponse } from '../../types/api';

// Вспомогательный компонент для отображения дерева категорий
interface CategoryTreeProps {
  categories: EquipmentCategory[];
  onSelect: (id: number) => void;
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
            className={`text-left w-full py-1 px-2 rounded hover:bg-gray-100 text-sm ${
              selectedId === cat.id ? 'bg-primary text-white font-bold' : 'text-gray-700'
            }`}
          >
            {cat.title}
          </button>
          {/* Рекурсивный вызов для дочерних категорий, если они есть */}
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Загружаем корневые категории при монтировании
  useEffect(() => {
    setLoading(true);
    // Запрашиваем только корневые категории (parent=null) или все, если бэкенд отдает дерево
    // В вашем случае equipmentApi.getCategories() должен отдавать массив корней
    apiClient.get<EquipmentCategory[]>('/equipment-categories/')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && typeof response.data === 'object' && 'results' in response.data) {
           // На случай, если вдруг включилась пагинация для категорий
           setCategories((response.data as any).results);
        }
      })
      .catch(err => console.error("Ошибка загрузки категорий", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Загружаем оборудование при изменении фильтров
  useEffect(() => {
    if (!selectedCategoryId && !searchQuery) {
        // Если ничего не выбрано, можно либо ничего не грузить, либо грузить всё
        // Для примера загрузим всё, если нет фильтров, или очистим список
        setEquipmentList([]);
        return;
    }

    setLoading(true);
    const params: any = {};
    if (selectedCategoryId) params.category = selectedCategoryId;
    if (searchQuery) params.search = searchQuery;

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
  }, [selectedCategoryId, searchQuery]);

  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id === selectedCategoryId ? null : id); // Toggle selection
    setSearchQuery(''); // Сброс поиска при выборе категории
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedCategoryId(null); // Сброс категории при поиске
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог оборудования</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Левая колонка: Дерево категорий */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="font-bold mb-4 text-lg">Категории</h2>
          {loading && categories.length === 0 ? (
            <p className="text-gray-500 text-sm">Загрузка...</p>
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
                  {selectedCategoryId 
                    ? "В этой категории пока нет оборудования." 
                    : "Введите запрос для поиска или выберите категорию."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}