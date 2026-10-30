import { useState } from 'react';
import { useStore } from '../../state/store';
import { eventMonth, itemBreakdown, money, uid } from '../../lib/calc';
import { RecipeLines } from '../../components/RecipeLines';
import { ConfirmButton, MONTHS, Modal, NumberInput } from '../../components/ui';
import type { EventItem, FloristEvent } from '../../types';

export function QuoteBuilder({ event }: { event: FloristEvent }) {
  const { lookup, updateEvent, data } = useStore();
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const month = eventMonth(event);
  const edit = (fn: (e: FloristEvent) => void) => updateEvent(event.id, fn);

  function addCategory() {
    edit((e) => void e.categories.push({ id: uid('c'), name: 'New Category', items: [] }));
  }

  function addItem(categoryId: string, recipeId: string | null) {
    const r = data.recipes.find((x) => x.id === recipeId);
    const item: EventItem = {
      id: uid('i'),
      name: r?.name ?? 'Custom item',
      quantity: 1,
      notes: '',
      flowers: r ? r.flowers.map((f) => ({ ...f })) : [],
      hardGoods: r ? r.hardGoods.map((h) => ({ ...h })) : [],
      laborMinutes: r?.laborMinutes ?? 30,
    };
    edit((e) => e.categories.find((c) => c.id === categoryId)?.items.push(item));
    setAddingTo(null);
    setOpenItem(item.id);
  }

  return (
    <div className="builder">
      {event.categories.map((cat) => {
        const catTotal = cat.items.reduce((n, i) => n + itemBreakdown(i, event, lookup).lineTotal, 0);
        return (
          <section key={cat.id} className="category">
            <div className="category-head">
              <input
                className="input title-input"
                value={cat.name}
                aria-label="Category name"
                onChange={(ev) => edit((e) => void (e.categories.find((c) => c.id === cat.id)!.name = ev.target.value))}
              />
              <span className="muted">{money(catTotal)}</span>
              <ConfirmButton
                className="btn ghost small"
                confirmLabel={cat.items.length ? `Delete ${cat.items.length} items?` : 'Delete category?'}
                onConfirm={() => edit((e) => void (e.categories = e.categories.filter((c) => c.id !== cat.id)))}
              >
                Delete
              </ConfirmButton>
            </div>

            <table className="table items">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="r">Qty</th>
                  <th className="r">Stems / unit</th>
                  <th className="r">Cost / unit</th>
                  <th className="r">Price / unit</th>
                  <th className="r">Line total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cat.items.map((item) => {
                  const b = itemBreakdown(item, event, lookup);
                  const isOpen = openItem === item.id;
                  const offSeason = item.flowers.some((f) => {
                    const a = lookup.flower(f.flowerId)?.seasonality[month];
                    return a === 'unavailable' || a === 'limited';
                  });
                  return (
                    <ItemRows
                      key={item.id}
                      item={item}
                      event={event}
                      isOpen={isOpen}
                      offSeason={offSeason}
                      breakdown={b}
                      toggle={() => setOpenItem(isOpen ? null : item.id)}
                      onChange={(fn) =>
                        edit((e) => {
                          const it = e.categories.find((c) => c.id === cat.id)?.items.find((i) => i.id === item.id);
                          if (it) fn(it);
                        })
                      }
                      onDelete={() =>
                        edit((e) => {
                          const c = e.categories.find((c) => c.id === cat.id)!;
                          c.items = c.items.filter((i) => i.id !== item.id);
                        })
                      }
                    />
                  );
                })}
                {cat.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="muted empty">
                      No items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="btn small" onClick={() => setAddingTo(cat.id)}>
              + Add item
            </button>
          </section>
        );
      })}
      <button className="btn" onClick={addCategory}>
        + Add category
      </button>

      {addingTo && (
        <Modal title="Add item" onClose={() => setAddingTo(null)}>
          <p className="muted small">Start from a recipe template or a blank item.</p>
          <div className="pick-list">
            <button className="pick" onClick={() => addItem(addingTo, null)}>
              <strong>Blank custom item</strong>
              <span className="muted small">Build the recipe from scratch</span>
            </button>
            {data.recipes.map((r) => (
              <button key={r.id} className="pick" onClick={() => addItem(addingTo, r.id)}>
                <strong>{r.name}</strong>
                <span className="muted small">
                  {r.flowers.reduce((n, f) => n + f.stems, 0)} stems · {r.description}
                </span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      <p className="muted small">
        Seasonality is checked against the event month ({MONTHS[month]}). ⚠ marks items using limited or unavailable
        flowers.
      </p>
    </div>
  );
}

function ItemRows({
  item,
  event,
  isOpen,
  offSeason,
  breakdown: b,
  toggle,
  onChange,
  onDelete,
}: {
  item: EventItem;
  event: FloristEvent;
  isOpen: boolean;
  offSeason: boolean;
  breakdown: ReturnType<typeof itemBreakdown>;
  toggle: () => void;
  onChange: (fn: (i: EventItem) => void) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr className={`item-row ${isOpen ? 'open' : ''}`} onClick={toggle}>
        <td>
          <span className="caret">{isOpen ? '▾' : '▸'}</span> {item.name}
          {offSeason && (
            <span className="warn-dot" title="Uses out-of-season or limited flowers">
              {' '}
              ⚠
            </span>
          )}
          {item.priceOverride !== undefined && <span className="pill small-pill">override</span>}
        </td>
        <td className="r" onClick={(e) => e.stopPropagation()}>
          <NumberInput
            className="qty"
            value={item.quantity}
            min={0}
            aria-label="Quantity"
            onChange={(n) => onChange((i) => void (i.quantity = n))}
          />
        </td>
        <td className="r">{b.stemsPerUnit}</td>
        <td className="r muted">{money(b.flowerCost + b.consumableCost + b.rentalCost + b.laborCost)}</td>
        <td className="r">{money(b.unitPrice)}</td>
        <td className="r strong">{money(b.lineTotal)}</td>
        <td className="r" onClick={(e) => e.stopPropagation()}>
          <button className="btn ghost small" onClick={onDelete} aria-label="Delete item">
            ✕
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr className="item-detail">
          <td colSpan={7}>
            <RecipeEditor item={item} event={event} breakdown={b} onChange={onChange} />
          </td>
        </tr>
      )}
    </>
  );
}

function RecipeEditor({
  item,
  event,
  breakdown: b,
  onChange,
}: {
  item: EventItem;
  event: FloristEvent;
  breakdown: ReturnType<typeof itemBreakdown>;
  onChange: (fn: (i: EventItem) => void) => void;
}) {
  const { update } = useStore();
  const month = eventMonth(event);
  const p = event.pricing;
  const [saved, setSaved] = useState(false);

  function saveAsTemplate() {
    update((d) =>
      void d.recipes.push({
        id: uid('r'),
        name: item.name,
        description: item.notes,
        flowers: item.flowers.map((f) => ({ ...f })),
        hardGoods: item.hardGoods.map((h) => ({ ...h })),
        laborMinutes: item.laborMinutes,
      }),
    );
    setSaved(true);
  }

  return (
    <div className="recipe-editor">
      <div className="recipe-meta">
        <label>
          Item name
          <input className="input" value={item.name} onChange={(e) => onChange((i) => void (i.name = e.target.value))} />
        </label>
        <label>
          Labor (min / unit)
          <NumberInput value={item.laborMinutes} step={5} onChange={(n) => onChange((i) => void (i.laborMinutes = n))} />
        </label>
        <label>
          Price override / unit
          <input
            type="number"
            className="input num"
            placeholder={money(b.unitPrice)}
            value={item.priceOverride ?? ''}
            onChange={(e) =>
              onChange((i) => void (i.priceOverride = e.target.value === '' ? undefined : Number(e.target.value)))
            }
          />
        </label>
        <label className="grow">
          Notes
          <input className="input" value={item.notes} onChange={(e) => onChange((i) => void (i.notes = e.target.value))} />
        </label>
        <button className="btn small align-end" onClick={saveAsTemplate} disabled={saved}>
          {saved ? 'Saved to recipe library' : 'Save as recipe template'}
        </button>
      </div>

      <div className="recipe-cols">
        <RecipeLines value={item} month={month} onChange={onChange} />

        <div className="price-breakdown">
          <h4>Per-unit pricing</h4>
          <dl>
            <dt>Flowers {money(b.flowerCost)} × {p.floralMarkup}</dt>
            <dd>{money(b.flowerCost * p.floralMarkup)}</dd>
            <dt>Consumables {money(b.consumableCost)} × {p.hardGoodMarkup}</dt>
            <dd>{money(b.consumableCost * p.hardGoodMarkup)}</dd>
            <dt>Rentals {money(b.rentalCost)} × {p.rentalMarkup}</dt>
            <dd>{money(b.rentalCost * p.rentalMarkup)}</dd>
            <dt>
              Labor {item.laborMinutes} min @ {money(p.laborRate)}/hr
            </dt>
            <dd>{money(b.laborCost)}</dd>
            <dt className="strong">Unit price{item.priceOverride !== undefined ? ' (override)' : ''}</dt>
            <dd className="strong">{money(b.unitPrice)}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
