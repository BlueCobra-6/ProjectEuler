import { useStore } from '../state/store';
import { money } from '../lib/calc';
import { FlowerImage } from './FlowerImage';
import { AvailabilityBadge, NumberInput } from './ui';
import type { RecipeFlower, RecipeHardGood } from '../types';

interface Lines {
  flowers: RecipeFlower[];
  hardGoods: RecipeHardGood[];
}

/** Flower + hard-good line editors, shared by event items and recipe templates. */
export function RecipeLines<T extends Lines>({
  value,
  month,
  onChange,
}: {
  value: T;
  /** Event month (0-11) used for seasonal badges; omit for templates. */
  month?: number;
  onChange: (fn: (draft: T) => void) => void;
}) {
  const { data, lookup } = useStore();
  const unusedFlowers = data.flowers.filter((f) => !value.flowers.some((x) => x.flowerId === f.id));
  const unusedGoods = data.hardGoods.filter((h) => !value.hardGoods.some((x) => x.hardGoodId === h.id));

  return (
    <>
      <div>
        <h4>Flowers &amp; greenery</h4>
        <table className="table compact">
          <tbody>
            {value.flowers.map((rf, idx) => {
              const f = lookup.flower(rf.flowerId);
              if (!f) return null;
              const avail = month === undefined ? undefined : f.seasonality[month];
              return (
                <tr key={rf.flowerId}>
                  <td className="thumb">
                    <FlowerImage flower={f} size={36} />
                  </td>
                  <td>
                    {f.name}
                    <div className="muted small">{f.variety}</div>
                  </td>
                  <td>{avail && avail !== 'available' && <AvailabilityBadge value={avail} />}</td>
                  <td className="r nowrap">
                    <NumberInput
                      className="qty"
                      value={rf.stems}
                      aria-label={`${f.name} stems`}
                      onChange={(n) => onChange((d) => void (d.flowers[idx].stems = n))}
                    />
                    <span className="muted small"> stems</span>
                  </td>
                  <td>
                    <button
                      className="btn ghost small"
                      aria-label="Remove flower"
                      onClick={() => onChange((d) => void d.flowers.splice(idx, 1))}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <select
          className="input"
          value=""
          aria-label="Add flower"
          onChange={(e) => onChange((d) => void d.flowers.push({ flowerId: e.target.value, stems: 1 }))}
        >
          <option value="">+ Add flower…</option>
          {unusedFlowers.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} — {f.variety}
              {month !== undefined ? ` (${f.seasonality[month]})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4>Hard goods</h4>
        <table className="table compact">
          <tbody>
            {value.hardGoods.map((rh, idx) => {
              const h = lookup.hardGood(rh.hardGoodId);
              if (!h) return null;
              return (
                <tr key={rh.hardGoodId}>
                  <td>
                    {h.name}
                    <div className="muted small">
                      {money(h.unitCost)} · {h.reusable ? 'rental / reusable' : 'consumed'}
                    </div>
                  </td>
                  <td className="r">
                    <NumberInput
                      className="qty"
                      value={rh.quantity}
                      aria-label={`${h.name} quantity`}
                      onChange={(n) => onChange((d) => void (d.hardGoods[idx].quantity = n))}
                    />
                  </td>
                  <td>
                    <button
                      className="btn ghost small"
                      aria-label="Remove hard good"
                      onClick={() => onChange((d) => void d.hardGoods.splice(idx, 1))}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <select
          className="input"
          value=""
          aria-label="Add hard good"
          onChange={(e) => onChange((d) => void d.hardGoods.push({ hardGoodId: e.target.value, quantity: 1 }))}
        >
          <option value="">+ Add hard good…</option>
          {unusedGoods.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} ({money(h.unitCost)})
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
