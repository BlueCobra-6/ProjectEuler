import { useStore } from '../state/store';
import { money } from '../lib/calc';
import { NumberInput } from '../components/ui';

export function HardGoodsPage() {
  const { data, update } = useStore();

  // Reserved quantity across events, to compare with what's in stock.
  const reserved = new Map<string, number>();
  for (const ev of data.events) {
    if (ev.status === 'completed') continue;
    for (const c of ev.categories)
      for (const i of c.items)
        for (const h of i.hardGoods) reserved.set(h.hardGoodId, (reserved.get(h.hardGoodId) ?? 0) + h.quantity * i.quantity);
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Hard goods</h1>
          <p className="muted">Consumables are used up; rentals/reusables return to inventory after the event.</p>
        </div>
      </header>
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
            </tr>
          </thead>
          <tbody>
            {data.hardGoods.map((h, idx) => {
              const need = reserved.get(h.id) ?? 0;
              return (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.category}</td>
                  <td>
                    <span className={`pill ${h.reusable ? 'status-booked' : ''}`}>{h.reusable ? 'reusable' : 'consumed'}</span>
                  </td>
                  <td className="r">
                    <NumberInput
                      className="qty"
                      step={0.05}
                      value={h.unitCost}
                      aria-label={`${h.name} unit cost`}
                      onChange={(n) => update((d) => void (d.hardGoods[idx].unitCost = n))}
                    />
                  </td>
                  <td className="r">{h.inStock}</td>
                  <td className={`r ${need > h.inStock ? 'tone-bad' : ''}`} title={money(need * h.unitCost)}>
                    {need}
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
