// src/components/CategoryTree.tsx
import { useState } from 'react';
import type { EquipmentCategory, Equipment } from '../types';
import { equipmentApi } from '../api/services/equipment';
import { Link } from 'react-router-dom';

interface CategoryTreeProps {
  categories: EquipmentCategory[];
  onSelectCategory: (category: EquipmentCategory) => void;
  selectedCategoryId: number | null;
}

export function CategoryTree({ categories, onSelectCategory, selectedCategoryId }: CategoryTreeProps) {
  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <CategoryItem 
          key={cat.id} 
          category={cat} 
          onSelect={onSelectCategory}
          isSelected={selectedCategoryId === cat.id}
        />
      ))}
    </div>
  );
}

interface CategoryItemProps {
  category: EquipmentCategory;
  onSelect: (category: EquipmentCategory) => void;
  isSelected: boolean;
}

function CategoryItem({ category, onSelect, isSelected }: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onSelect(category);
  };

  return (
    <div className="ml-4 border-l-2 border-gray-200 pl-4">
      <button
        onClick={handleClick}
        className={`w-full text-left py-2 px-3 rounded hover:bg-gray-100 flex items-center justify-between ${
          isSelected ? 'bg-blue-50 text-primary font-bold' : 'text-gray-700'
        }`}
      >
        <span>{category.title}</span>
        {hasChildren && (
          <span className="text-xs text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </button>

      {/* Рекурсивный рендер дочерних категорий */}
      {isExpanded && hasChildren && category.children && (
        <div className="mt-2">
          <CategoryTree 
            categories={category.children} 
            onSelectCategory={onSelect}
            selectedCategoryId={isSelected ? null : null} // Сбрасываем выделение при раскрытии, или можно оставить логику
          />
        </div>
      )}
    </div>
  );
}