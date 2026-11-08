// src/components/CategoryTree.tsx
import { useState } from 'react';
import type { EquipmentCategory } from '../types';

interface CategoryTreeProps {
  categories: EquipmentCategory[];
  onSelect: (category: EquipmentCategory) => void;
  selectedCategoryId: number | null;
}

export function CategoryTree({ categories, onSelect, selectedCategoryId }: CategoryTreeProps) {
  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          onSelect={onSelect}
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
      
      {isExpanded && hasChildren && category.children && (
        <div className="mt-2">
          {/* Исправлено: используем onSelect вместо onSelectCategory */}
          <CategoryTree
            categories={category.children}
            onSelect={onSelect}
            selectedCategoryId={null}
          />
        </div>
      )}
    </div>
  );
}