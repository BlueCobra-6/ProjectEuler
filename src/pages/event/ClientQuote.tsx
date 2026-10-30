import { useStore } from '../../state/store';
import { eventTotals, itemBreakdown, money } from '../../lib/calc';
import type { FloristEvent } from '../../types';

/** Client-facing proposal: prices only, no costs or recipes. Print-friendly. */
export function ClientQuote({ event }: { event: FloristEvent }) {
  const { lookup } = useStore();
  const t = eventTotals(event, lookup);

  return (
    <div className="stack">
      <article className="proposal">
        <header>
          <div className="brand">
            <span className="brand-mark">✿</span> Petal Ledger Studio
          </div>
          <h2>Floral Proposal</h2>
          <p>
            <strong>{event.name}</strong>
            <br />
            Prepared for {event.client || '—'}
            <br />
            {new Date(event.date + 'T12:00:00').toLocaleDateString(undefined, { dateStyle: 'full' })} · {event.venue}
          </p>
        </header>
        {event.categories
          .filter((c) => c.items.length > 0)
          .map((c) => (
            <section key={c.id}>
              <h3>{c.name}</h3>
              <table className="table">
                <tbody>
                  {c.items.map((item) => {
                    const b = itemBreakdown(item, event, lookup);
                    const flowerNames = item.flowers
                      .map((f) => lookup.flower(f.flowerId)?.name)
                      .filter(Boolean)
                      .join(', ');
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                          {flowerNames && <div className="muted small">Featuring {flowerNames}</div>}
                          {item.notes && <div className="muted small">{item.notes}</div>}
                        </td>
                        <td className="r">{item.quantity}</td>
                        <td className="r">{money(b.unitPrice)}</td>
                        <td className="r">{money(b.lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
        <dl className="totals">
          <dt>Design subtotal</dt>
          <dd>{money(t.itemsSubtotal)}</dd>
          <dt>Delivery, setup &amp; breakdown</dt>
          <dd>{money(t.delivery)}</dd>
          <dt>Sales tax ({event.pricing.taxRate}%)</dt>
          <dd>{money(t.tax)}</dd>
          <dt className="strong">Total</dt>
          <dd className="strong">{money(t.total)}</dd>
        </dl>
        <p className="muted small">
          Flowers are seasonal and natural products; comparable substitutions of equal or greater value may be made
          based on availability.
        </p>
      </article>
    </div>
  );
}
