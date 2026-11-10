// frontend/src/components/YearRangeSlider.tsx
import { useState, useEffect, useCallback } from 'react';

interface YearRangeSliderProps {
  minYear: number;
  maxYear: number;
  yearFrom: number | null;
  yearTo: number | null;
  onYearFromChange: (year: number | null) => void;
  onYearToChange: (year: number | null) => void;
}

export function YearRangeSlider({
  minYear,
  maxYear,
  yearFrom,
  yearTo,
  onYearFromChange,
  onYearToChange,
}: YearRangeSliderProps) {
  const [localFrom, setLocalFrom] = useState(yearFrom ?? minYear);
  const [localTo, setLocalTo] = useState(yearTo ?? maxYear);

  useEffect(() => {
    setLocalFrom(yearFrom ?? minYear);
    setLocalTo(yearTo ?? maxYear);
  }, [yearFrom, yearTo, minYear, maxYear]);

  const valueToPercent = useCallback(
    (value: number) => ((value - minYear) / (maxYear - minYear)) * 100,
    [minYear, maxYear]
  );

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val > localTo - 1) return;
    setLocalFrom(val);
    onYearFromChange(val === minYear ? null : val);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val < localFrom + 1) return;
    setLocalTo(val);
    onYearToChange(val === maxYear ? null : val);
  };

  const handleReset = () => {
    setLocalFrom(minYear);
    setLocalTo(maxYear);
    onYearFromChange(null);
    onYearToChange(null);
  };

  const isDefault = localFrom === minYear && localTo === maxYear;
  const fromPercent = valueToPercent(localFrom);
  const toPercent = valueToPercent(localTo);

  return (
    <div className="space-y-4">
      {/* Трек с двумя ползунками */}
      <div className="relative h-10 pt-2">
        {/* Подписи значений */}
        <div
          className="absolute -top-1 text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transform -translate-x-1/2 pointer-events-none"
          style={{ left: `${fromPercent}%` }}
        >
          {localFrom}
        </div>
        <div
          className="absolute -top-1 text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transform -translate-x-1/2 pointer-events-none"
          style={{ left: `${toPercent}%` }}
        >
          {localTo}
        </div>

        {/* Серый фон трека */}
        <div className="absolute top-5 left-0 right-0 h-2 bg-gray-200 rounded-full" />

        {/* Подсвеченная область */}
        <div
          className="absolute top-5 h-2 bg-primary rounded-full"
          style={{
            left: `${fromPercent}%`,
            width: `${toPercent - fromPercent}%`,
          }}
        />

        {/* Левый ползунок */}
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={localFrom}
          onChange={handleFromChange}
          className="dual-range-slider dual-range-slider-from absolute top-4 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: localFrom > localTo - (maxYear - minYear) / 2 ? 20 : 10 }}
        />

        {/* Правый ползунок */}
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={localTo}
          onChange={handleToChange}
          className="dual-range-slider dual-range-slider-to absolute top-4 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: localTo < localFrom + (maxYear - minYear) / 2 ? 20 : 10 }}
        />
      </div>

      {/* Числовые поля */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-gray-500 w-6">От:</label>
          <input
            type="number"
            min={minYear}
            max={localTo - 1}
            value={localFrom}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= minYear && val < localTo) {
                setLocalFrom(val);
                onYearFromChange(val === minYear ? null : val);
              }
            }}
            className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <span className="text-gray-400 font-medium">—</span>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <label className="text-xs text-gray-500 w-6">До:</label>
          <input
            type="number"
            min={localFrom + 1}
            max={maxYear}
            value={localTo}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > localFrom && val <= maxYear) {
                setLocalTo(val);
                onYearToChange(val === maxYear ? null : val);
              }
            }}
            className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {!isDefault && (
        <button
          onClick={handleReset}
          className="text-xs text-primary hover:underline font-medium"
        >
          Сбросить фильтр
        </button>
      )}
    </div>
  );
}