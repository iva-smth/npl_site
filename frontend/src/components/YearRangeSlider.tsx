// frontend/src/components/YearRangeSlider.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';

type ThumbId = 'from' | 'to';

interface Values {
  from: number;
  to: number;
}

interface YearRangeSliderProps {
  minYear: number;
  maxYear: number;
  yearFrom: number | null;
  yearTo: number | null;
  onYearFromChange: (year: number | null) => void;
  onYearToChange: (year: number | null) => void;
  /**
   * Необязательный, но РЕКОМЕНДУЕМЫЙ колбэк: обе границы одним вызовом.
   * Нужен, когда фильтр пишется в URL: два последовательных
   * setSearchParams(prev => ...) в одном тике перетирают друг друга.
   */
  onRangeChange?: (from: number | null, to: number | null) => void;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function normalize(from: number, to: number, min: number, max: number): Values {
  const f = clamp(Number.isFinite(from) ? Math.round(from) : min, min, max);
  const t = clamp(Number.isFinite(to) ? Math.round(to) : max, min, max);
  return f <= t ? { from: f, to: t } : { from: t, to: f };
}

export function YearRangeSlider({
  minYear,
  maxYear,
  yearFrom,
  yearTo,
  onYearFromChange,
  onYearToChange,
  onRangeChange,
}: YearRangeSliderProps) {
  const min = Math.min(minYear, maxYear);
  const max = Math.max(minYear, maxYear);
  const span = max - min;
  const disabled = span <= 0; // доступен всего один год — двигать нечего

  const [values, setValues] = useState<Values>(() =>
    normalize(yearFrom ?? min, yearTo ?? max, min, max)
  );
  const [active, setActive] = useState<ThumbId | null>(null);
  const [fromText, setFromText] = useState(() => String(values.from));
  const [toText, setToText] = useState(() => String(values.to));

  const railRef = useRef<HTMLDivElement | null>(null);
  const valuesRef = useRef<Values>(values);
  const dragRef = useRef<{ id: ThumbId; pointerId: number; offset: number } | null>(null);

  // Всё, что нужно нативным слушателям, живёт в ref'ах.
  // Благодаря этому глобальные слушатели вешаются РОВНО ОДИН раз
  // и никогда не пересобираются из-за смены пропсов/колбэков.
  const boundsRef = useRef({ min, max });
  const propsRef = useRef({ yearFrom, yearTo });
  const callbacksRef = useRef({
    from: onYearFromChange,
    to: onYearToChange,
    range: onRangeChange,
  });

  boundsRef.current = { min, max };
  propsRef.current = { yearFrom, yearTo };
  callbacksRef.current = { from: onYearFromChange, to: onYearToChange, range: onRangeChange };

  /* ---------- синхронизация с внешним состоянием (URL) ---------- */
  useEffect(() => {
    if (dragRef.current) return; // во время drag внешние данные игнорируем
    const next = normalize(yearFrom ?? min, yearTo ?? max, min, max);
    valuesRef.current = next;
    setValues(next);
  }, [yearFrom, yearTo, min, max]);

  useEffect(() => {
    setFromText(String(values.from));
  }, [values.from]);

  useEffect(() => {
    setToText(String(values.to));
  }, [values.to]);

  /* ---------- изменение значений (только локально, без запросов) ---------- */
  const applyValues = useCallback((from: number, to: number) => {
    const b = boundsRef.current;
    const next = normalize(from, to, b.min, b.max);
    const cur = valuesRef.current;
    if (next.from === cur.from && next.to === cur.to) return;
    valuesRef.current = next; // синхронно, чтобы следующий pointermove видел актуал
    setValues(next);
  }, []);

  /* ---------- публикация фильтра наружу (один раз, при отпускании) ---------- */
  const commitValues = useCallback((v: Values) => {
    const b = boundsRef.current;
    const from = v.from <= b.min ? null : v.from;
    const to = v.to >= b.max ? null : v.to;
    const cb = callbacksRef.current;

    if (cb.range) {
      cb.range(from, to); // один атомарный апдейт URL
      return;
    }
    // Fallback, если onRangeChange не передан
    if (from !== propsRef.current.yearFrom) cb.from(from);
    if (to !== propsRef.current.yearTo) cb.to(to);
  }, []);

  const finishDrag = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setActive(null);
    document.body.classList.remove('yrs-dragging');
    commitValues(valuesRef.current);
  }, [commitValues]);

  /* ---------- ЕДИНЫЕ глобальные слушатели на всё время жизни компонента ---------- */
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      const rail = railRef.current;
      if (!rail) return;

      if (e.cancelable) e.preventDefault();

      const rect = rail.getBoundingClientRect(); // меряем каждый раз: скролл/резизом не сломают расчёт
      if (rect.width <= 0) return;

      const b = boundsRef.current;
      const x = e.clientX - drag.offset; // сохраняем точку захвата, ползунок не «прыгает»
      const ratio = clamp((x - rect.left) / rect.width, 0, 1);
      const year = Math.round(b.min + ratio * (b.max - b.min));

      const cur = valuesRef.current;
      if (drag.id === 'from') {
        applyValues(Math.min(year, cur.to), cur.to);
      } else {
        applyValues(cur.from, Math.max(year, cur.from));
      }
    };

    const handleUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      finishDrag();
    };

    const handleWindowBlur = () => finishDrag();

    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      window.removeEventListener('blur', handleWindowBlur);
      document.body.classList.remove('yrs-dragging');
    };
  }, [applyValues, finishDrag]);

  /* ---------- захват ползунка (только по нему, не по линии!) ---------- */
  const handleThumbPointerDown = (
    e: ReactPointerEvent<HTMLButtonElement>,
    id: ThumbId
  ) => {
    if (disabled) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return; // только ЛКМ

    e.preventDefault();
    e.stopPropagation();

    const rail = railRef.current;
    if (!rail) return;

    const rect = rail.getBoundingClientRect();
    const b = boundsRef.current;
    const value = id === 'from' ? valuesRef.current.from : valuesRef.current.to;
    const ratio = b.max > b.min ? (value - b.min) / (b.max - b.min) : 0;
    const centerX = rect.left + ratio * rect.width;

    dragRef.current = {
      id,
      pointerId: e.pointerId,
      offset: e.clientX - centerX,
    };

    setActive(id);
    document.body.classList.add('yrs-dragging');

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // capture не критичен: слушатели всё равно на window
    }
  };

  /* ---------- клавиатура (доступность) ---------- */
  const handleThumbKeyDown = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    id: ThumbId
  ) => {
    if (disabled) return;

    const b = boundsRef.current;
    const cur = valuesRef.current;
    const current = id === 'from' ? cur.from : cur.to;
    let next: number;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - 1;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + 1;
        break;
      case 'PageDown':
        next = current - 10;
        break;
      case 'PageUp':
        next = current + 10;
        break;
      case 'Home':
        next = id === 'from' ? b.min : cur.from;
        break;
      case 'End':
        next = id === 'from' ? cur.to : b.max;
        break;
      default:
        return;
    }

    e.preventDefault();
    if (id === 'from') {
      applyValues(clamp(next, b.min, cur.to), cur.to);
    } else {
      applyValues(cur.from, clamp(next, cur.from, b.max));
    }
    commitValues(valuesRef.current);
  };

  /* ---------- ручной ввод ---------- */
  const handleTextChange = (raw: string, id: ThumbId) => {
    if (id === 'from') setFromText(raw);
    else setToText(raw);

    if (raw.trim() === '') return;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;

    const b = boundsRef.current;
    const cur = valuesRef.current;

    if (id === 'from') {
      if (parsed < b.min || parsed > cur.to) return;
      applyValues(parsed, cur.to);
    } else {
      if (parsed > b.max || parsed < cur.from) return;
      applyValues(cur.from, parsed);
    }
  };

  const handleTextCommit = (id: ThumbId) => {
    const b = boundsRef.current;
    const cur = valuesRef.current;
    const raw = id === 'from' ? fromText : toText;
    const parsed = Number(raw);
    const fallback = id === 'from' ? cur.from : cur.to;
    const value = raw.trim() !== '' && Number.isFinite(parsed) ? parsed : fallback;

    if (id === 'from') {
      applyValues(clamp(value, b.min, cur.to), cur.to);
    } else {
      applyValues(cur.from, clamp(value, cur.from, b.max));
    }

    setFromText(String(valuesRef.current.from));
    setToText(String(valuesRef.current.to));
    commitValues(valuesRef.current);
  };

  const handleReset = () => {
    const b = boundsRef.current;
    applyValues(b.min, b.max);
    commitValues({ from: b.min, to: b.max });
  };

  /* ---------- геометрия рендера ---------- */
  const toPercent = (v: number) => (span > 0 ? ((v - min) / span) * 100 : 0);
  const fromPct = toPercent(values.from);
  const toPct = toPercent(values.to);
  const merged = toPct - fromPct < 14; // подписи налезают друг на друга — объединяем
  // Когда ползунки совпали, сверху должен быть тот, который ещё может двигаться
  const fromOnTop = values.from === values.to && values.to === max;
  const isFiltered = values.from !== min || values.to !== max;

  return (
    <div className="yrs space-y-3">
      {/* Ни у области, ни у линии НЕТ обработчиков pointerdown —
          клик по треку принципиально ничего не делает */}
      <div className="yrs__area">
        <div className="yrs__rail" ref={railRef}>
          <div className="yrs__rail-bg" />
          <div
            className="yrs__rail-fill"
            style={{ left: `${fromPct}%`, width: `${Math.max(0, toPct - fromPct)}%` }}
          />

          {merged ? (
            <div className="yrs__bubble" style={{ left: `${(fromPct + toPct) / 2}%` }}>
              {values.from === values.to ? values.from : `${values.from} – ${values.to}`}
            </div>
          ) : (
            <>
              <div className="yrs__bubble" style={{ left: `${fromPct}%` }}>
                {values.from}
              </div>
              <div className="yrs__bubble" style={{ left: `${toPct}%` }}>
                {values.to}
              </div>
            </>
          )}

          <button
            type="button"
            role="slider"
            aria-label="Год начала периода"
            aria-valuemin={min}
            aria-valuemax={values.to}
            aria-valuenow={values.from}
            aria-valuetext={String(values.from)}
            disabled={disabled}
            className={`yrs__thumb${active === 'from' ? ' yrs__thumb--active' : ''}`}
            style={{ left: `${fromPct}%`, zIndex: fromOnTop ? 5 : 3 }}
            onPointerDown={(e) => handleThumbPointerDown(e, 'from')}
            onKeyDown={(e) => handleThumbKeyDown(e, 'from')}
            onLostPointerCapture={finishDrag}
          />

          <button
            type="button"
            role="slider"
            aria-label="Год окончания периода"
            aria-valuemin={values.from}
            aria-valuemax={max}
            aria-valuenow={values.to}
            aria-valuetext={String(values.to)}
            disabled={disabled}
            className={`yrs__thumb${active === 'to' ? ' yrs__thumb--active' : ''}`}
            style={{ left: `${toPct}%`, zIndex: 4 }}
            onPointerDown={(e) => handleThumbPointerDown(e, 'to')}
            onKeyDown={(e) => handleThumbKeyDown(e, 'to')}
            onLostPointerCapture={finishDrag}
          />
        </div>

        <div className="yrs__bounds">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Точный ввод: фильтр применяется по Enter или потере фокуса */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-gray-500 shrink-0" htmlFor="yrs-from">
            От
          </label>
          <input
            id="yrs-from"
            type="number"
            inputMode="numeric"
            min={min}
            max={values.to}
            step={1}
            disabled={disabled}
            value={fromText}
            onChange={(e) => handleTextChange(e.target.value, 'from')}
            onBlur={() => handleTextCommit('from')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            className="w-full min-w-0 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <span className="text-gray-400 font-medium">—</span>

        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-gray-500 shrink-0" htmlFor="yrs-to">
            До
          </label>
          <input
            id="yrs-to"
            type="number"
            inputMode="numeric"
            min={values.from}
            max={max}
            step={1}
            disabled={disabled}
            value={toText}
            onChange={(e) => handleTextChange(e.target.value, 'to')}
            onBlur={() => handleTextCommit('to')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            className="w-full min-w-0 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {isFiltered && (
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-primary hover:underline font-medium"
        >
          Сбросить период
        </button>
      )}
    </div>
  );
}