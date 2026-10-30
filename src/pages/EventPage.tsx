import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom';
import { useStore } from '../state/store';
import { eventTotals, money } from '../lib/calc';
import { BudgetMeter, Stat } from '../components/ui';
import { QuoteBuilder } from './event/QuoteBuilder';
import { StemsTab } from './event/StemsTab';
import { ClientQuote } from './event/ClientQuote';
import { EventSettings } from './event/EventSettings';

export function EventPage() {
  const { id } = useParams();
  const { data, lookup } = useStore();
  const event = data.events.find((e) => e.id === id);
  if (!event) {
    return (
      <p>
        Event not found. <Link to="/">Back to events</Link>
      </p>
    );
  }
  const t = eventTotals(event, lookup);
  const base = `/events/${event.id}`;

  return (
    <>
      <header className="page-head no-print">
        <div>
          <Link to="/" className="muted small">
            ← All events
          </Link>
          <h1>{event.name}</h1>
          <p className="muted">
            {event.client || 'No client'} · {event.venue || 'Venue TBD'} ·{' '}
            {new Date(event.date + 'T12:00:00').toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
        </div>
      </header>

      <section className="summary no-print">
        <Stat label="Client budget" value={money(event.budget)} />
        <Stat label="Quote total" value={money(t.total)} sub={`incl. ${money(t.tax)} tax`} />
        <Stat
          label={t.budgetRemaining >= 0 ? 'Under budget' : 'Over budget'}
          value={money(Math.abs(t.budgetRemaining))}
          tone={t.budgetRemaining >= 0 ? 'good' : 'bad'}
        />
        <Stat
          label="Est. margin"
          value={money(t.margin)}
          sub={t.itemsSubtotal > 0 ? `${Math.round((t.margin / (t.itemsSubtotal + t.delivery)) * 100)}% of pre-tax` : undefined}
        />
        <div className="summary-meter">
          <BudgetMeter total={t.total} budget={event.budget} />
        </div>
      </section>

      <nav className="tabs no-print">
        <NavLink to={base} end>
          Quote builder
        </NavLink>
        <NavLink to={`${base}/stems`}>Stems &amp; order</NavLink>
        <NavLink to={`${base}/quote`}>Client proposal</NavLink>
        <NavLink to={`${base}/settings`}>Event settings</NavLink>
      </nav>

      <Routes>
        <Route index element={<QuoteBuilder event={event} />} />
        <Route path="stems" element={<StemsTab event={event} />} />
        <Route path="quote" element={<ClientQuote event={event} />} />
        <Route path="settings" element={<EventSettings event={event} />} />
      </Routes>
    </>
  );
}
