import { useState } from 'react';
import { useStore } from '../state/store';
import { money, uid } from '../lib/calc';
import { ConfirmButton, NumberInput } from '../components/ui';
import type { HardGood } from '../types';

const blankGood = (): HardGood => ({ id: uid('h'), name: '', category: '', unitCost: 0, reusable: false, inStock: 0 });

export function HardGoodsPage() {
  const { data, update } = useStore();
  const [draft, setDraft] = useState<HardGood>(blankGood);
  const categories = [...new Set(data.hardGoods.map((h) => h.category).filter(Boolean))].sort();

  // Reserved quantity across events, to compare with what's in stock.
  const reserved = new Map<string, number>();
  for (const ev of data.events) {
    if (ev.status === 'completed') continue;
    for (const c of ev.categories)
      for (const i of c.items)
        for (const h of i.hardGoods) reserved.set(h.hardGoodId, (reserved.get(h.hardGoodId) ?? 0) + h.quantity * i.quantity);
  }

  const editGood = (id: string, fn: (h: HardGood) => void) =>
    update((d) => {
      const h = d.hardGoods.find((x) => x.id === id);
      if (h) fn(h);
    });

  function addGood() {
    update((d) => void d.hardGoods.push({ ...draft, name: draft.name.trim(), category: draft.category.trim() || 'Other' }));
    setDraft(blankGood());
  }

  function removeGood(id: string) {
    update((d) => {
      d.hardGoods = d.hardGoods.filter((h) => h.id !== id);
      for (const r of d.recipes) r.hardGoods = r.hardGoods.filter((x) => x.hardGoodId !== id);
      for (const ev of d.events)
        for (const c of ev.categories) for (const it of c.items) it.hardGoods = it.hardGoods.filter((x) => x.hardGoodId !== id);
    });
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Hard goods</h1>
          <p className="muted">Consumables are used up; rentals/reusables return to inventory after the event.</p>
        </div>
      </header>

      <form
        className="card add-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.name.trim()) addGood();
        }}
      >
        <strong className="add-row-title">Add a hard good</strong>
        <label>
          Name
          <input id="hg-name" className="input" value={draft.name} placeholder="e.g. Pillar candle 3×6" onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </label>
        <label>
          Category
          <input
            id="hg-category"
            className="input"
            list="hg-categories"
            value={draft.category}
            placeholder="Candles"
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
          <datalist id="hg-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label>
          Unit cost
          <NumberInput step={0.05} value={draft.unitCost} onChange={(n) => setDraft({ ...draft, unitCost: n })} />
        </label>
        <label>
          In stock
          <NumberInput value={draft.inStock} onChange={(n) => setDraft({ ...draft, inStock: n })} />
        </label>
        <label className="check">
          <input type="checkbox" checked={draft.reusable} onChange={(e) => setDraft({ ...draft, reusable: e.target.checked })} />
          Reusable / rental
        </label>
        <button className="btn primary" type="submit" disabled={!draft.name.trim()}>
          Add
        </button>
      </form>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Type</th>
              <th className="r">Unit cost</th>
              <th className="r">In stock</th>
              <th className="r">Needed (open events)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.hardGoods.map((h) => {
              const need = reserved.get(h.id) ?? 0;
              return (
                <tr key={h.id}>
                  <td>
                    <input className="input bare" value={h.name} aria-label="Name" onChange={(e) => editGood(h.id, (x) => void (x.name = e.target.value))} />
                  </td>
                  <td>
                    <input
                      className="input bare"
                      list="hg-categories"
                      value={h.category}
                      aria-label="Category"
                      onChange={(e) => editGood(h.id, (x) => void (x.category = e.target.value))}
                    />
                  </td>
                  <td>
                    <button
                      className={`pill pill-btn ${h.reusable ? 'status-booked' : ''}`}
                      title="Click to switch"
                      onClick={() => editGood(h.id, (x) => void (x.reusable = !x.reusable))}
                    >
                      {h.reusable ? 'reusable' : 'consumed'}
                    </button>
                  </td>
                  <td className="r">
                    <NumberInput
                      className="qty"
                      step={0.05}
                      value={h.unitCost}
                      aria-label={`${h.name} unit cost`}
                      onChange={(n) => editGood(h.id, (x) => void (x.unitCost = n))}
                    />
                  </td>
                  <td className="r">
                    <NumberInput
                      className="qty"
                      value={h.inStock}
                      aria-label={`${h.name} in stock`}
                      onChange={(n) => editGood(h.id, (x) => void (x.inStock = n))}
                    />
                  </td>
                  <td className={`r ${need > h.inStock ? 'tone-bad' : ''}`} title={money(need * h.unitCost)}>
                    {need}
                  </td>
                  <td className="r">
                    <ConfirmButton className="btn ghost small" confirmLabel="Delete?" onConfirm={() => removeGood(h.id)}>
                      ✕
                    </ConfirmButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
