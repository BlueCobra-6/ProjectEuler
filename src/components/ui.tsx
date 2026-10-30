import { useEffect, useState, type ReactNode } from 'react';
import type { Availability } from '../types';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function SeasonBar({ seasonality, highlight }: { seasonality: Availability[]; highlight?: number }) {
  return (
    <div className="season-bar" aria-label="Seasonal availability">
      {seasonality.map((a, i) => (
        <span
          key={i}
          className={`season-cell s-${a} ${highlight === i ? 'is-current' : ''}`}
          title={`${MONTHS[i]}: ${a}`}
        >
          {MONTHS[i][0]}
        </span>
      ))}
    </div>
  );
}

export function AvailabilityBadge({ value }: { value: Availability }) {
  return <span className={`badge s-${value}`}>{value}</span>;
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'good' | 'bad' }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${tone ? `tone-${tone}` : ''}`}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function BudgetMeter({ total, budget }: { total: number; budget: number }) {
  const pct = budget > 0 ? Math.min(100, (total / budget) * 100) : 0;
  const over = total > budget;
  return (
    <div className="meter" aria-label="Budget used">
      <div className={`meter-fill ${over ? 'over' : pct > 90 ? 'warn' : ''}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function NumberInput({
  value,
  onChange,
  step = 1,
  min = 0,
  className,
  ...rest
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <input
      type="number"
      className={`input num ${className ?? ''}`}
      value={Number.isFinite(value) ? value : 0}
      step={step}
      min={min}
      onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      {...rest}
    />
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="btn ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Asks for a second click instead of a native confirm() dialog. */
export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = 'Click again to confirm',
  className = 'btn',
}: {
  onConfirm: () => void;
  children: ReactNode;
  confirmLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      className={`${className} ${armed ? 'armed' : ''}`}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}
