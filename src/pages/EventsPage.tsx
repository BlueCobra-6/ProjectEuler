import { Link, useNavigate } from 'react-router-dom';
import { eventTotals, money, uid } from '../lib/calc';
import { useStore } from '../state/store';
import { BudgetMeter } from '../components/ui';
import type { FloristEvent } from '../types';

export function EventsPage() {
  const { data, lookup, update } = useStore();
  const navigate = useNavigate();
  const events = [...data.events].sort((a, b) => a.date.localeCompare(b.date));

  function createEvent() {
    const base = data.events[0]?.pricing;
    const ev: FloristEvent = {
      id: uid('e'),
      name: 'New Event',
      client: '',
      clientEmail: '',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString().slice(0, 10),
      venue: '',
      status: 'inquiry',
      budget: 3000,
      wastageBuffer: 10,
      sourcing: {},
      pricing: base
        ? { ...base }
        : { taxRate: 8.25, floralMarkup: 3.5, hardGoodMarkup: 2, rentalMarkup: 1.5, laborRate: 45, deliveryFee: 150, taxLabor: false },
      categories: [
        { id: uid('c'), name: 'Personal Flowers', items: [] },
        { id: uid('c'), name: 'Ceremony', items: [] },
        { id: uid('c'), name: 'Reception', items: [] },
      ],
    };
    update((d) => void d.events.push(ev));
    navigate(`/events/${ev.id}/settings`);
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Events</h1>
          <p className="muted">Build quotes and flower recipes per event.</p>
        </div>
        <button className="btn primary" onClick={createEvent}>
          + New event
        </button>
      </header>
      <div className="card-grid">
        {events.map((ev) => {
          const t = eventTotals(ev, lookup);
          const items = ev.categories.reduce((n, c) => n + c.items.length, 0);
          return (
            <Link key={ev.id} to={`/events/${ev.id}`} className="card event-card">
              <div className="row between">
                <span className={`pill status-${ev.status}`}>{ev.status}</span>
                <span className="muted small">
                  {new Date(ev.date + 'T12:00:00').toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
              <h2>{ev.name}</h2>
              <div className="muted small">
                {ev.client || 'No client yet'} · {ev.venue || 'Venue TBD'}
              </div>
              <div className="row between mt">
                <strong>{money(t.total)}</strong>
                <span className="muted small">of {money(ev.budget)} budget</span>
              </div>
              <BudgetMeter total={t.total} budget={ev.budget} />
              <div className="muted small mt">
                {ev.categories.length} categories · {items} items
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
