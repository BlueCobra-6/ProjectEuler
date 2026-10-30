import { useState } from 'react';
import { useStore } from '../state/store';
import { chooseOffer, money, stemCost, stemOrder } from '../lib/calc';
import { FlowerImage } from '../components/FlowerImage';
import { AvailabilityBadge, MONTHS, Modal, SeasonBar } from '../components/ui';
import { FlowerEditor, blankFlower } from '../components/FlowerEditor';
import type { Flower } from '../types';

export function FlowersPage() {
  const { data, lookup } = useStore();
  const [q, setQ] = useState('');
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [inSeasonOnly, setInSeasonOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Flower | null>(null);
  const selected = data.flowers.find((f) => f.id === selectedId) ?? null;

  const list = data.flowers.filter((f) => {
    const hay = `${f.name} ${f.variety} ${f.color}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (inSeasonOnly && (f.seasonality[month] === 'unavailable' || f.seasonality[month] === 'limited')) return false;
    return true;
  });

  // Stem usage across all upcoming events, for the detail view.
  const usage = (flowerId: string) =>
    data.events.flatMap((ev) => {
      const line = stemOrder(ev, lookup).find((l) => l.flower.id === flowerId);
      return line ? [{ event: ev.name, used: line.stemsUsed, ordered: line.stemsOrdered, leftover: line.leftover }] : [];
    });

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Flowers</h1>
          <p className="muted">Costs, wholesalers, bunch sizes and seasonal availability.</p>
        </div>
        <button className="btn primary" onClick={() => setEditing(blankFlower())}>
          + New flower
        </button>
      </header>
      <div className="toolbar">
        <input className="input" placeholder="Search flowers…" value={q} onChange={(e) => setQ(e.target.value)} />
        <label>
          Month
          <select className="input" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={inSeasonOnly} onChange={(e) => setInSeasonOnly(e.target.checked)} />
          Reliably available in {MONTHS[month]}
        </label>
      </div>
      <div className="card-grid flowers">
        {list.map((f) => {
          const offer = chooseOffer(f);
          return (
            <button key={f.id} className="card flower-card" onClick={() => setSelectedId(f.id)}>
              <FlowerImage flower={f} size={120} />
              <div className="flower-card-body">
                <div className="row between">
                  <strong>{f.name}</strong>
                  <AvailabilityBadge value={f.seasonality[month]} />
                </div>
                <div className="muted small">
                  {f.variety} · {f.color}
                </div>
                <div className="small mt">
                  from {offer ? money(stemCost(offer)) : '—'}/stem · {f.offers.length} wholesaler
                  {f.offers.length === 1 ? '' : 's'}
                </div>
                <SeasonBar seasonality={f.seasonality} highlight={month} />
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <Modal title={`${selected.name} — ${selected.variety}`} onClose={() => setSelectedId(null)}>
          <div className="row gap">
            <FlowerImage flower={selected} size={140} />
            <div className="grow">
              <p className="muted">
                {selected.color} · {selected.shape} · breakage buffer{' '}
                {selected.breakageBuffer !== undefined ? `${selected.breakageBuffer}%` : 'uses event default'}
              </p>
              <SeasonBar seasonality={selected.seasonality} highlight={month} />
              <button
                className="btn small mt"
                onClick={() => {
                  setEditing(selected);
                  setSelectedId(null);
                }}
              >
                Edit flower
              </button>
            </div>
          </div>
          <h4>Wholesaler offers</h4>
          <table className="table compact">
            <thead>
              <tr>
                <th>Wholesaler</th>
                <th className="r">Stems/bunch</th>
                <th className="r">$/bunch</th>
                <th className="r">$/stem</th>
              </tr>
            </thead>
            <tbody>
              {selected.offers.map((o) => (
                <tr key={o.wholesalerId}>
                  <td>{data.wholesalers.find((w) => w.id === o.wholesalerId)?.name}</td>
                  <td className="r">{o.stemsPerBunch}</td>
                  <td className="r">{money(o.pricePerBunch)}</td>
                  <td className="r">{money(stemCost(o))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Usage across events</h4>
          <table className="table compact">
            <thead>
              <tr>
                <th>Event</th>
                <th className="r">Used</th>
                <th className="r">Ordered</th>
                <th className="r">Leftover</th>
              </tr>
            </thead>
            <tbody>
              {usage(selected.id).map((u) => (
                <tr key={u.event}>
                  <td>{u.event}</td>
                  <td className="r">{u.used}</td>
                  <td className="r">{u.ordered}</td>
                  <td className="r">{u.leftover}</td>
                </tr>
              ))}
              {usage(selected.id).length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    Not used in any event yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Modal>
      )}
      {editing && (
        <FlowerEditor initial={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
