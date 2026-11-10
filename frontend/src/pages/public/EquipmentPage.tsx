import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { equipmentApi } from '../../api/services/equipment';
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
            {/* Кнопка "Все направления" */}
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

    // Флаги состояния фильтров (для кнопки "Сбросить")
    const hasActiveFilters =
        selectedCategoryId !== null ||
        selectedDirId !== null ||
        selectedGroupId !== null ||
        searchQuery !== '';

    // 1. Загрузка категорий и направлений (один раз)
    useEffect(() => {
        Promise.all([
            equipmentApi.getCategories(),
            equipmentApi.getFilterOptions(),
        ])
            .then(([catRes, dirRes]) => {
                // Категории
                if (Array.isArray(catRes.data)) {
                    setCategories(catRes.data);
                } else if (
                    catRes.data &&
                    typeof catRes.data === 'object' &&
                    'results' in catRes.data
                ) {
                    setCategories((catRes.data as any).results);
                }
                // Направления с группами
                if (Array.isArray(dirRes.data)) {
                    setDirections(dirRes.data);
                }
            })
            .catch((err) => console.error('Ошибка загрузки фильтров:', err));
    }, []);

    // 2. Загрузка оборудования с учётом всех фильтров
    useEffect(() => {
        setLoading(true);
        const params: Record<string, any> = {};

        if (searchQuery) params.search = searchQuery;
        if (selectedCategoryId !== null) params.category = selectedCategoryId;
        if (selectedGroupId !== null) {
            params.group = selectedGroupId;
        } else if (selectedDirId !== null) {
            params.direction = selectedDirId;
        }

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
    const handleCategorySelect = (id: number | null) => {
        setSelectedCategoryId(id);
    };

    const handleDirSelect = (id: number | null) => {
        setSelectedDirId(id);
        setSelectedGroupId(null);
    };

    const handleGroupSelect = (dirId: number, groupId: number) => {
        setSelectedDirId(dirId);
        setSelectedGroupId(groupId);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleResetAll = () => {
        setSelectedCategoryId(null);
        setSelectedDirId(null);
        setSelectedGroupId(null);
        setSearchQuery('');
    };

    // Формируем читаемое название текущего фильтра
    const getActiveFilterLabel = (): string | null => {
        if (selectedGroupId) {
            const dir = directions.find((d) => d.id === selectedDirId);
            const group = dir?.groups.find((g) => g.id === selectedGroupId);
            return group ? `Группа: ${group.title}` : null;
        }
        if (selectedDirId) {
            const dir = directions.find((d) => d.id === selectedDirId);
            return dir ? `Направление: ${dir.title}` : null;
        }
        if (selectedCategoryId) {
            // Ищем категорию в дереве (упрощённо — по названию)
            const findCat = (cats: EquipmentCategory[]): EquipmentCategory | null => {
                for (const c of cats) {
                    if (c.id === selectedCategoryId) return c;
                    if (c.children) {
                        const found = findCat(c.children);
                        if (found) return found;
                    }
                }
                return null;
            };
            const cat = findCat(categories);
            return cat ? `Категория: ${cat.title}` : null;
        }
        return null;
    };

    const activeFilterLabel = getActiveFilterLabel();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Каталог оборудования</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* ============ ЛЕВАЯ КОЛОНКА: ФИЛЬТРЫ ============ */}
                <aside className="w-full lg:w-1/4 shrink-0 space-y-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        {/* Поиск */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                                Поиск
                            </h4>
                            <input
                                type="text"
                                placeholder="Название оборудования..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Направления и группы */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                                Направления и группы
                            </h4>
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
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                                Категории
                            </h4>
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

                        {/* Кнопка сброса */}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="w-full mt-2 text-xs text-primary hover:underline font-medium py-2 border-t border-gray-100"
                            >
                                Сбросить все фильтры
                            </button>
                        )}
                    </div>
                </aside>

                {/* ============ ПРАВАЯ КОЛОНКА: СПИСОК ============ */}
                <main className="w-full lg:w-3/4">
                    {/* Индикатор активного фильтра */}
                    {activeFilterLabel && (
                        <div className="mb-4 flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Активный фильтр:</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                                {activeFilterLabel}
                            </span>
                            {searchQuery && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                                    Поиск: «{searchQuery}»
                                </span>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">
                            Загрузка оборудования...
                        </div>
                    ) : (
                        <>
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
                                                <h2 className="text-xl font-bold mb-2">
                                                    {item.title}
                                                </h2>
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
                                        {hasActiveFilters
                                            ? 'По выбранным фильтрам ничего не найдено.'
                                            : 'Оборудование не найдено.'}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}