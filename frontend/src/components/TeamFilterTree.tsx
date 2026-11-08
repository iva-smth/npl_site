import type { ResearchDirection } from '../types';

interface TeamFilterTreeProps {
  directions: ResearchDirection[];
  selectedDirId: number | null;
  selectedGroupId: number | null;
  onDirChange: (id: number | null) => void;
  onGroupChange: (dirId: number, groupId: number) => void;
}

export function TeamFilterTree({
  directions,
  selectedDirId,
  selectedGroupId,
  onDirChange,
  onGroupChange
}: TeamFilterTreeProps) {
  
  return (
    <div className="space-y-1">
      {/* Кнопка сброса / "Все сотрудники" */}
      <button
        onClick={() => onDirChange(null)}
        className={`w-full text-left py-2 px-3 rounded-lg mb-2 transition-colors text-sm font-medium ${
          !selectedDirId && !selectedGroupId 
            ? 'bg-primary text-white' 
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        Все сотрудники
      </button>

      {directions.map(dir => {
        const isDirSelected = selectedDirId === dir.id;
        const hasGroups = dir.groups && dir.groups.length > 0;

        return (
          <div key={dir.id} className="mb-1">
            {/* Уровень 1: Направление */}
            <button
              onClick={() => onDirChange(dir.id)}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-sm ${
                isDirSelected && !selectedGroupId
                  ? 'bg-primary text-white font-bold'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span>{dir.title}</span>
              {/* Стрелки убраны. Если нужно оставить отступ для визуального баланса, можно добавить пустой span */}
              {hasGroups && <span className="w-4"></span>} 
            </button>

            {/* Уровень 2: Группы (всегда раскрыты, если есть) */}
            {hasGroups && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                {dir.groups!.map(group => (
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