import { useState } from 'react';
import { useStore } from '../state/store';
import { money, stemCost, uid } from '../lib/calc';
import { FlowerImage } from './FlowerImage';
import { ConfirmButton, MONTHS, Modal, NumberInput } from './ui';
import type { Availability, Flower } from '../types';

const SHAPES: Flower['shape'][] = ['round', 'spray', 'spike', 'cluster', 'foliage'];
const CYCLE: Availability[] = ['peak', 'available', 'limited', 'unavailable'];

export function blankFlower(): Flower {
  return {
    id: uid('f'),
    name: '',
    variety: '',
    color: '',
    hex: '#e8b4c0',
    shape: 'round',
    seasonality: Array(12).fill('available'),
    offers: [],
  };
}

/** Create or edit a flower. Saving replaces the catalog entry with the same id. */
export function FlowerEditor({ initial, onClose }: { initial: Flower; onClose: () => void }) {
  const { data, update } = useStore();
  const [f, setF] = useState<Flower>(() => structuredClone(initial));
  const isNew = !data.flowers.some((x) => x.id === initial.id);
  const edit = (fn: (d: Flower) => void) =>
    setF((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  const unusedWholesalers = data.wholesalers.filter((w) => !f.offers.some((o) => o.wholesalerId === w.id));
  const canSave = f.name.trim() !== '' && f.offers.length > 0;

  function save() {
    update((d) => {
      const i = d.flowers.findIndex((x) => x.id === f.id);
      if (i >= 0) d.flowers[i] = f;
      else d.flowers.push(f);
    });
    onClose();
  }

  function remove() {
    // Drop the flower and every recipe line that used it.
    update((d) => {
      d.flowers = d.flowers.filter((x) => x.id !== f.id);
      for (const r of d.recipes) r.flowers = r.flowers.filter((x) => x.flowerId !== f.id);
      for (const ev of d.events) {
        delete ev.sourcing[f.id];
        for (const c of ev.categories) for (const it of c.items) it.flowers = it.flowers.filter((x) => x.flowerId !== f.id);
      }
    });
    onClose();
  }

  return (
    <Modal title={isNew ? 'New flower' : `Edit ${initial.name}`} onClose={onClose}>
      <div className="editor-grid">
        <div className="editor-preview">
          <FlowerImage flower={f} size={120} />
        </div>
        <div className="form two-col">
          <label>
            Name
            <input className="input" value={f.name} placeholder="e.g. Tulip" onChange={(e) => edit((d) => void (d.name = e.target.value))} />
          </label>
          <label>
            Variety
            <input className="input" value={f.variety} placeholder="e.g. French Blush" onChange={(e) => edit((d) => void (d.variety = e.target.value))} />
          </label>
          <label>
            Color name
            <input className="input" value={f.color} onChange={(e) => edit((d) => void (d.color = e.target.value))} />
          </label>
          <label>
            Swatch
            <input type="color" className="input swatch" value={f.hex} onChange={(e) => edit((d) => void (d.hex = e.target.value))} />
          </label>
          <label>
            Shape
            <select className="input" value={f.shape} onChange={(e) => edit((d) => void (d.shape = e.target.value as Flower['shape']))}>
              {SHAPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Breakage buffer %
            <input
              type="number"
              className="input num"
              min={0}
              placeholder="Event default"
              value={f.breakageBuffer ?? ''}
              onChange={(e) => edit((d) => void (d.breakageBuffer = e.target.value === '' ? undefined : Number(e.target.value)))}
            />
          </label>
          <label className="span-2">
            Photo URL (optional)
            <input
              className="input"
              value={f.imageUrl ?? ''}
              placeholder="https://…"
              onChange={(e) => edit((d) => void (d.imageUrl = e.target.value || undefined))}
            />
          </label>
        </div>
      </div>

      <h4>Seasonal availability</h4>
      <p className="muted small">Click a month to cycle peak → available → limited → unavailable.</p>
      <div className="season-bar editable">
        {f.seasonality.map((a, i) => (
          <button
            key={i}
            type="button"
            className={`season-cell s-${a}`}
            title={`${MONTHS[i]}: ${a}`}
            onClick={() => edit((d) => void (d.seasonality[i] = CYCLE[(CYCLE.indexOf(a) + 1) % CYCLE.length]))}
          >
            {MONTHS[i]}
          </button>
        ))}
      </div>

      <h4>Wholesalers</h4>
      <table className="table compact">
        <thead>
          <tr>
            <th>Wholesaler</th>
            <th className="r">Stems / bunch</th>
            <th className="r">$ / bunch</th>
            <th className="r">$ / stem</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {f.offers.map((o, idx) => (
            <tr key={o.wholesalerId}>
              <td>{data.wholesalers.find((w) => w.id === o.wholesalerId)?.name}</td>
              <td className="r">
                <NumberInput className="qty" min={1} value={o.stemsPerBunch} onChange={(n) => edit((d) => void (d.offers[idx].stemsPerBunch = Math.max(1, n)))} />
              </td>
              <td className="r">
                <NumberInput className="qty" step={0.5} value={o.pricePerBunch} onChange={(n) => edit((d) => void (d.offers[idx].pricePerBunch = n))} />
              </td>
              <td className="r">{money(stemCost(o))}</td>
              <td>
                <button className="btn ghost small" aria-label="Remove offer" onClick={() => edit((d) => void d.offers.splice(idx, 1))}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {unusedWholesalers.length > 0 && (
        <select
          className="input"
          value=""
          aria-label="Add wholesaler"
          onChange={(e) => edit((d) => void d.offers.push({ wholesalerId: e.target.value, stemsPerBunch: 10, pricePerBunch: 20 }))}
        >
          <option value="">+ Add wholesaler offer…</option>
          {unusedWholesalers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      )}

      <div className="modal-actions">
        {!isNew && (
          <ConfirmButton className="btn danger" confirmLabel="Also removes it from recipes. Click again" onConfirm={remove}>
            Delete flower
          </ConfirmButton>
        )}
        <span className="grow muted small">{!canSave && 'Add a name and at least one wholesaler offer to save.'}</span>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button className="btn primary" disabled={!canSave} onClick={save}>
          {isNew ? 'Add flower' : 'Save'}
        </button>
      </div>
    </Modal>
  );
}
