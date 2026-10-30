import { useStore } from '../state/store';
import { chooseOffer, money, stemCost } from '../lib/calc';
import { FlowerImage } from '../components/FlowerImage';

export function RecipesPage() {
  const { data, lookup } = useStore();
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Recipe library</h1>
          <p className="muted">Reusable templates. Adding one to an event copies it so it can be tweaked per event.</p>
        </div>
      </header>
      <div className="card-grid">
        {data.recipes.map((r) => {
          const flowerCost = r.flowers.reduce((n, rf) => {
            const f = lookup.flower(rf.flowerId);
            const o = f && chooseOffer(f);
            return n + (o ? stemCost(o) * rf.stems : 0);
          }, 0);
          const goodsCost = r.hardGoods.reduce((n, rh) => n + (lookup.hardGood(rh.hardGoodId)?.unitCost ?? 0) * rh.quantity, 0);
          return (
            <div key={r.id} className="card">
              <h2>{r.name}</h2>
              <p className="muted small">{r.description}</p>
              <div className="thumb-row">
                {r.flowers.map((rf) => {
                  const f = lookup.flower(rf.flowerId);
                  return f ? (
                    <div key={rf.flowerId} className="thumb-stack" title={`${rf.stems} × ${f.name}`}>
                      <FlowerImage flower={f} size={40} />
                      <span className="small">×{rf.stems}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <ul className="small plain">
                {r.hardGoods.map((rh) => (
                  <li key={rh.hardGoodId}>
                    {rh.quantity} × {lookup.hardGood(rh.hardGoodId)?.name}
                  </li>
                ))}
              </ul>
              <div className="row between mt small">
                <span>Flowers {money(flowerCost)}</span>
                <span>Goods {money(goodsCost)}</span>
                <span>{r.laborMinutes} min labor</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
