import { useNavigate } from 'react-router-dom';
import { useStore } from '../../state/store';
import { NumberInput } from '../../components/ui';
import type { EventStatus, FloristEvent, PricingSettings } from '../../types';

const STATUSES: EventStatus[] = ['inquiry', 'proposal', 'booked', 'completed'];

export function EventSettings({ event }: { event: FloristEvent }) {
  const { updateEvent, update } = useStore();
  const navigate = useNavigate();
  const edit = (fn: (e: FloristEvent) => void) => updateEvent(event.id, fn);
  const setPricing = <K extends keyof PricingSettings>(k: K, v: PricingSettings[K]) =>
    edit((e) => void (e.pricing[k] = v));
  const text = (k: 'name' | 'client' | 'clientEmail' | 'venue' | 'date', label: string, type = 'text') => (
    <label>
      {label}
      <input className="input" type={type} value={event[k]} onChange={(ev) => edit((e) => void (e[k] = ev.target.value))} />
    </label>
  );

  return (
    <div className="settings-grid">
      <section className="card form">
        <h3>Event details</h3>
        {text('name', 'Event name')}
        {text('client', 'Client name')}
        {text('clientEmail', 'Client email', 'email')}
        {text('date', 'Event date', 'date')}
        {text('venue', 'Venue')}
        <label>
          Status
          <select
            className="input"
            value={event.status}
            onChange={(ev) => edit((e) => void (e.status = ev.target.value as EventStatus))}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Client budget ($)
          <NumberInput value={event.budget} step={100} onChange={(n) => edit((e) => void (e.budget = n))} />
        </label>
      </section>

      <section className="card form">
        <h3>Pricing for this event</h3>
        <label>
          Floral markup (× flower cost)
          <NumberInput value={event.pricing.floralMarkup} step={0.25} onChange={(n) => setPricing('floralMarkup', n)} />
        </label>
        <label>
          Consumable hard-goods markup (×)
          <NumberInput value={event.pricing.hardGoodMarkup} step={0.25} onChange={(n) => setPricing('hardGoodMarkup', n)} />
        </label>
        <label>
          Rental markup (×)
          <NumberInput value={event.pricing.rentalMarkup} step={0.25} onChange={(n) => setPricing('rentalMarkup', n)} />
        </label>
        <label>
          Labor rate ($/hr)
          <NumberInput value={event.pricing.laborRate} step={5} onChange={(n) => setPricing('laborRate', n)} />
        </label>
        <label>
          Delivery / setup fee ($)
          <NumberInput value={event.pricing.deliveryFee} step={25} onChange={(n) => setPricing('deliveryFee', n)} />
        </label>
        <label>
          Sales tax rate (%)
          <NumberInput value={event.pricing.taxRate} step={0.05} onChange={(n) => setPricing('taxRate', n)} />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={event.pricing.taxLabor}
            onChange={(ev) => setPricing('taxLabor', ev.target.checked)}
          />
          Labor is taxable in this jurisdiction
        </label>
      </section>

      <section className="card form danger-zone">
        <h3>Danger zone</h3>
        <button
          className="btn danger"
          onClick={() => {
            if (!confirm(`Delete "${event.name}"? This cannot be undone.`)) return;
            update((d) => void (d.events = d.events.filter((e) => e.id !== event.id)));
            navigate('/');
          }}
        >
          Delete event
        </button>
      </section>
    </div>
  );
}
