import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import type {
    Equipment,
    EquipmentCategory,
    EquipmentDirectionWithGroups,
} from '../../types';

// ============================================================
// Дерево категорий (локальный компонент)
// ============================================================
interface CategoryTreeProps {
    categories: EquipmentCategory[];
    onSelect: (id: number | null) => void;
    selectedId: number | null;
}

function CategoryTree({ categories, onSelect, selectedId }: CategoryTreeProps) {
    if (!Array.isArray(categories)) return null;
    return (
        <ul className="space-y-1 pl-3 border-l border-gray-200 ml-1">
            {categories.map((cat) => (
                <li key={cat.id}>
                    <button
                        onClick={() => onSelect(cat.id)}
                        className={`text-left w-full py-1.5 px-2 rounded text-sm transition-colors ${
                            selectedId === cat.id
                                ? 'bg-primary text-white font-bold'
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                        {cat.title}
                    </button>
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

// ============================================================
// Дерево направлений с группами
// ============================================================
interface DirectionTreeProps {
    directions: EquipmentDirectionWithGroups[];
    selectedDirId: number | null;
    selectedGroupId: number | null;
    onDirChange: (id: number | null) => void;
    onGroupChange: (dirId: number, groupId: number) => void;
}

function DirectionTree({
    directions,
    selectedDirId,
    selectedGroupId,
    onDirChange,
    onGroupChange,
}: DirectionTreeProps) {
    return (
        <div className="space-y-1">
            <button
                onClick={() => onDirChange(null)}
                className={`w-full text-left py-2 px-3 rounded-lg mb-2 transition-colors text-sm font-medium ${
                    !selectedDirId && !selectedGroupId
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
                Все направления
            </button>

            {directions.map((dir) => {
                const isDirSelected = selectedDirId === dir.id && !selectedGroupId;
                const hasGroups = dir.groups && dir.groups.length > 0;

                return (
                    <div key={dir.id} className="mb-1">
                        <button
                            onClick={() => onDirChange(dir.id)}
                            className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-sm ${
                                isDirSelected
                                    ? 'bg-primary text-white font-bold'
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <span className="truncate">{dir.title}</span>
                            {hasGroups && <span className="w-4" />}
                        </button>

                        {hasGroups && (
                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                {dir.groups.map((group) => (
                                    <button
                                        key={group.id}
                                        onClick={() => onGroupChange(dir.id, group.id)}
                                        className={`w-full text-left py-1.5 px-3 rounded-md transition-colors text-sm ${
                                            selectedGroupId === group.id
                                                ? 'bg-blue-100 text-blue-800 font-bold'
                                                : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        {group.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// Основная страница
// ============================================================
export function EquipmentPage() {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [categories, setCategories] = useState<EquipmentCategory[]>([]);
    const [directions, setDirections] = useState<EquipmentDirectionWithGroups[]>([]);
    const [loading, setLoading] = useState(true);

    // Фильтры
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedDirId, setSelectedDirId] = useState<number | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 1. Загрузка категорий и направлений (один раз)
    useEffect(() => {
        Promise.all([
            apiClient.get<EquipmentCategory[]>('/equipment-categories/'),
            apiClient.get<EquipmentDirectionWithGroups[]>('/equipment/filter-options/'),
        ])
            .then(([catRes, dirRes]) => {
                if (Array.isArray(catRes.data)) setCategories(catRes.data);
                else if (catRes.data && typeof catRes.data === 'object' && 'results' in catRes.data) {
                    setCategories((catRes.data as any).results);
                }
                if (Array.isArray(dirRes.data)) setDirections(dirRes.data);
            })
            .catch((err) => console.error('Ошибка загрузки фильтров:', err));
    }, []);

    // 2. Загрузка оборудования с учётом всех фильтров
    useEffect(() => {
        setLoading(true);
        const params: Record<string, any> = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategoryId !== null) params.category = selectedCategoryId;
        if (selectedGroupId !== null) params.group = selectedGroupId;
        else if (selectedDirId !== null) params.direction = selectedDirId;

        apiClient
            .get<{ results: Equipment[] }>('/equipment/', { params })
            .then((response) => {
                const data = response.data?.results || [];
                setEquipmentList(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error('Ошибка загрузки оборудования:', error);
                setEquipmentList([]);
            })
            .finally(() => setLoading(false));
    }, [selectedCategoryId, selectedDirId, selectedGroupId, searchQuery]);

    // Хендлеры
    const handleCategorySelect = (id: number | null) => setSelectedCategoryId(id);
    const handleDirSelect = (id: number | null) => {
        setSelectedDirId(id);
        setSelectedGroupId(null);
    };
    const handleGroupSelect = (dirId: number, groupId: number) => {
        setSelectedDirId(dirId);
        setSelectedGroupId(groupId);
    };

    // Вспомогательная функция поиска категории по ID в дереве
    const findCategoryById = (cats: EquipmentCategory[], id: number): EquipmentCategory | null => {
        for (const c of cats) {
            if (c.id === id) return c;
            if (c.children) {
                const found = findCategoryById(c.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Формируем массив активных фильтров для отображения
    const activeFilters = useMemo(() => {
        const filters: Array<{ key: string; label: string; onClear: () => void }> = [];

        // Фильтр по категории
        if (selectedCategoryId !== null) {
            const cat = findCategoryById(categories, selectedCategoryId);
            if (cat) filters.push({ key: 'cat', label: `Категория: ${cat.title}`, onClear: () => setSelectedCategoryId(null) });
        }

        // Фильтр по группе (✅ ИСПРАВЛЕНО: сбрасываем и группу, и направление)
        if (selectedGroupId !== null) {
            const dir = directions.find((d) => d.id === selectedDirId);
            const group = dir?.groups.find((g) => g.id === selectedGroupId);
            if (group) {
                filters.push({
                    key: 'group',
                    label: `Группа: ${group.title}`,
                    onClear: () => {
                        setSelectedGroupId(null);
                        setSelectedDirId(null); // ✅ Сбрасываем родительское направление
                    }
                });
            }
        } 
        // Фильтр по направлению (отображается только если группа не выбрана)
        else if (selectedDirId !== null) {
            const dir = directions.find((d) => d.id === selectedDirId);
            if (dir) filters.push({ key: 'dir', label: `Направление: ${dir.title}`, onClear: () => { setSelectedDirId(null); setSelectedGroupId(null); } });
        }

        // Поиск
        if (searchQuery) {
            filters.push({ key: 'search', label: `Поиск: «${searchQuery}»`, onClear: () => setSearchQuery('') });
        }

        return filters;
    }, [selectedCategoryId, selectedDirId, selectedGroupId, searchQuery, categories, directions]);

    const hasActiveFilters = activeFilters.length > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Каталог оборудования</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* ============ ЛЕВАЯ КОЛОНКА: ФИЛЬТРЫ ============ */}
                <aside className="w-full lg:w-1/4 shrink-0 space-y-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        {/* Поиск */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Поиск</h4>
                            <input
                                type="text"
                                placeholder="Название оборудования..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Направления и группы */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Направления и группы</h4>
                            <DirectionTree
                                directions={directions}
                                selectedDirId={selectedDirId}
                                selectedGroupId={selectedGroupId}
                                onDirChange={handleDirSelect}
                                onGroupChange={handleGroupSelect}
                            />
                        </div>

                        {/* Категории */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Категории</h4>
                            {/* ✅ КНОПКА "ВСЕ КАТЕГОРИИ" */}
                            <button
                                onClick={() => setSelectedCategoryId(null)}
                                className={`w-full text-left py-2 px-3 rounded-lg mb-2 transition-colors text-sm font-medium ${
                                    selectedCategoryId === null
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                Все категории
                            </button>
                            
                            {categories.length > 0 ? (
                                <CategoryTree
                                    categories={categories}
                                    onSelect={handleCategorySelect}
                                    selectedId={selectedCategoryId}
                                />
                            ) : (
                                <p className="text-gray-500 text-sm">Загрузка...</p>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ============ ПРАВАЯ КОЛОНКА: СПИСОК ============ */}
                <main className="w-full lg:w-3/4">
                    {/* ✅ ОБЛАСТЬ АКТИВНЫХ ФИЛЬТРОВ С КРЕСТИКАМИ И СБРОСОМ */}
                    {hasActiveFilters && (
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="text-gray-500 text-sm">Активные:</span>
                            {activeFilters.map((f) => (
                                <span
                                    key={f.key}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium text-sm border border-blue-100"
                                >
                                    {f.label}
                                    <button
                                        onClick={f.onClear}
                                        className="ml-0.5 hover:bg-blue-200 rounded-full p-0.5 transition-colors focus:outline-none"
                                        title="Убрать фильтр"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </span>
                            ))}
                            {/* ✅ КНОПКА СБРОСА ВСЕГО (справа от тегов) */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCategoryId(null);
                                    setSelectedDirId(null);
                                    setSelectedGroupId(null);
                                    setSearchQuery('');
                                }}
                                className="ml-1 px-3 py-1 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                Сбросить всё
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Загрузка оборудования...</div>
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
                                            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Нет фото</div>
                                        )}
                                        <div className="p-4 flex-grow">
                                            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {item.category && (
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        {item.category.title}
                                                    </span>
                                                )}
                                                {item.group_title && (
                                                    <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                                                        {item.group_title}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
                                        </div>
                                        <div className="px-4 py-2 bg-gray-50 border-t text-primary font-medium text-sm">
                                            Подробнее &rarr;
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 py-10">
                                    {hasActiveFilters
                                        ? 'По выбранным фильтрам ничего не найдено.'
                                        : 'Оборудование не найдено.'}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}