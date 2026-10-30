import { useStore } from '../../state/store';
import { eventMonth, money, stemCost, stemOrder } from '../../lib/calc';
import { FlowerImage } from '../../components/FlowerImage';
import { AvailabilityBadge, NumberInput, Stat } from '../../components/ui';
import type { FloristEvent } from '../../types';

export function StemsTab({ event }: { event: FloristEvent }) {
  const { lookup, data, updateEvent } = useStore();
  const lines = stemOrder(event, lookup);
  const month = eventMonth(event);
  const wholesalerName = (id?: string) => data.wholesalers.find((w) => w.id === id)?.name ?? '—';

  const totals = lines.reduce(
    (t, l) => ({
      used: t.used + l.stemsUsed,
      ordered: t.ordered + l.stemsOrdered,
      leftover: t.leftover + l.leftover,
      cost: t.cost + l.orderCost,
      waste: t.waste + l.leftoverCost,
    }),
    { used: 0, ordered: 0, leftover: 0, cost: 0, waste: 0 },
  );

  // Group the order by wholesaler so it can be sent as one PO each.
  const byWholesaler = new Map<string, typeof lines>();
  for (const l of lines) {
    const k = l.offer?.wholesalerId ?? 'none';
    byWholesaler.set(k, [...(byWholesaler.get(k) ?? []), l]);
  }

  return (
    <div className="stack">
      <section className="summary">
        <Stat label="Stems used in designs" value={totals.used.toLocaleString()} />
        <Stat label="Stems ordered" value={totals.ordered.toLocaleString()} sub={`${event.wastageBuffer}% breakage buffer`} />
        <Stat label="Leftover stems" value={totals.leftover.toLocaleString()} sub={`${money(totals.waste)} of product`} />
        <Stat label="Wholesale flower cost" value={money(totals.cost)} />
        <label className="stat">
          <span className="stat-label">Breakage buffer %</span>
          <NumberInput
            value={event.wastageBuffer}
            onChange={(n) => updateEvent(event.id, (e) => void (e.wastageBuffer = n))}
          />
        </label>
      </section>

      <section className="card">
        <h3>Stem usage &amp; leftovers</h3>
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Flower</th>
              <th>Season</th>
              <th>Source</th>
              <th className="r">Used</th>
              <th className="r">Bunches</th>
              <th className="r">Ordered</th>
              <th className="r">Leftover</th>
              <th className="r">Cost</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.flower.id}>
                <td className="thumb">
                  <FlowerImage flower={l.flower} size={36} />
                </td>
                <td>
                  {l.flower.name}
                  <div className="muted small" title={l.usedIn.map((u) => `${u.itemName}: ${u.stems}`).join('\n')}>
                    {l.flower.variety} · in {l.usedIn.length} item{l.usedIn.length === 1 ? '' : 's'}
                  </div>
                </td>
                <td>
                  <AvailabilityBadge value={l.flower.seasonality[month]} />
                </td>
                <td>
                  <select
                    className="input"
                    value={l.offer?.wholesalerId ?? ''}
                    onChange={(e) => updateEvent(event.id, (ev) => void (ev.sourcing[l.flower.id] = e.target.value))}
                  >
                    {l.flower.offers.map((o) => (
                      <option key={o.wholesalerId} value={o.wholesalerId}>
                        {wholesalerName(o.wholesalerId)} — {money(stemCost(o))}/stem, {o.stemsPerBunch}/bunch
                      </option>
                    ))}
                  </select>
                </td>
                <td className="r">{l.stemsUsed}</td>
                <td className="r">{l.bunches}</td>
                <td className="r">{l.stemsOrdered}</td>
                <td className={`r ${l.leftover > l.stemsUsed * 0.25 ? 'tone-bad' : ''}`}>{l.leftover}</td>
                <td className="r">{money(l.orderCost)}</td>
              </tr>
            ))}
            {lines.length === 0 && (
              <tr>
                <td colSpan={9} className="muted empty">
                  Add flowers to items to see stem counts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Purchase orders by wholesaler</h3>
        <div className="po-grid">
          {[...byWholesaler].map(([wid, ls]) => {
            const w = data.wholesalers.find((x) => x.id === wid);
            const order = new Date(event.date + 'T12:00:00');
            order.setDate(order.getDate() - (w?.leadTimeDays ?? 0));
            return (
              <div key={wid} className="po">
                <div className="row between">
                  <strong>{w?.name ?? 'No source'}</strong>
                  <span>{money(ls.reduce((n, l) => n + l.orderCost, 0))}</span>
                </div>
                <div className="muted small">
                  Order by {order.toLocaleDateString(undefined, { dateStyle: 'medium' })} ({w?.leadTimeDays ?? 0}-day lead)
                </div>
                <ul>
                  {ls.map((l) => (
                    <li key={l.flower.id}>
                      {l.bunches} × {l.flower.name} ({l.flower.variety}) — {l.offer?.stemsPerBunch} stems/bunch
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
