import { useStore } from '../state/store';

export function WholesalersPage() {
  const { data } = useStore();
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Wholesalers</h1>
          <p className="muted">Where each flower can be sourced, with lead times for ordering.</p>
        </div>
      </header>
      <div className="card-grid">
        {data.wholesalers.map((w) => {
          const carried = data.flowers.filter((f) => f.offers.some((o) => o.wholesalerId === w.id));
          return (
            <div key={w.id} className="card">
              <h2>{w.name}</h2>
              <div className="muted small">
                {w.location} · {w.contact}
              </div>
              <div className="small mt">{w.leadTimeDays}-day lead time</div>
              <div className="small mt">
                <strong>Carries {carried.length} flowers:</strong> {carried.map((f) => f.name).join(', ')}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
