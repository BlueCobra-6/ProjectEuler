import { useState } from 'react';
import { useStore } from '../state/store';
import { chooseOffer, money, stemCost, uid } from '../lib/calc';
import { FlowerImage } from '../components/FlowerImage';
import { RecipeLines } from '../components/RecipeLines';
import { ConfirmButton, Modal, NumberInput } from '../components/ui';
import type { RecipeTemplate } from '../types';

const blankRecipe = (): RecipeTemplate => ({
  id: uid('r'),
  name: '',
  description: '',
  flowers: [],
  hardGoods: [],
  laborMinutes: 30,
});

export function RecipesPage() {
  const { data, lookup } = useStore();
  const [editing, setEditing] = useState<RecipeTemplate | null>(null);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Recipe library</h1>
          <p className="muted">Reusable templates. Adding one to an event copies it so it can be tweaked per event.</p>
        </div>
        <button className="btn primary" onClick={() => setEditing(blankRecipe())}>
          + New recipe
        </button>
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
            <button key={r.id} className="card recipe-card" onClick={() => setEditing(r)}>
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
            </button>
          );
        })}
      </div>
      {editing && <RecipeEditor initial={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function RecipeEditor({ initial, onClose }: { initial: RecipeTemplate; onClose: () => void }) {
  const { data, update } = useStore();
  const [r, setR] = useState<RecipeTemplate>(() => structuredClone(initial));
  const isNew = !data.recipes.some((x) => x.id === initial.id);
  const edit = (fn: (d: RecipeTemplate) => void) =>
    setR((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });

  function save() {
    update((d) => {
      const i = d.recipes.findIndex((x) => x.id === r.id);
      if (i >= 0) d.recipes[i] = r;
      else d.recipes.push(r);
    });
    onClose();
  }

  return (
    <Modal title={isNew ? 'New recipe template' : `Edit ${initial.name}`} onClose={onClose}>
      <div className="form two-col">
        <label>
          Name
          <input className="input" value={r.name} placeholder="e.g. Corsage" onChange={(e) => edit((d) => void (d.name = e.target.value))} />
        </label>
        <label>
          Labor (min / unit)
          <NumberInput value={r.laborMinutes} step={5} onChange={(n) => edit((d) => void (d.laborMinutes = n))} />
        </label>
        <label className="span-2">
          Description
          <input className="input" value={r.description} onChange={(e) => edit((d) => void (d.description = e.target.value))} />
        </label>
      </div>
      <div className="recipe-cols two">
        <RecipeLines value={r} onChange={edit} />
      </div>
      <p className="muted small">Changes here affect new items only. Items already on events keep their own copy.</p>
      <div className="modal-actions">
        {!isNew && (
          <ConfirmButton
            className="btn danger"
            confirmLabel="Click again to delete"
            onConfirm={() => {
              update((d) => void (d.recipes = d.recipes.filter((x) => x.id !== r.id)));
              onClose();
            }}
          >
            Delete recipe
          </ConfirmButton>
        )}
        <span className="grow" />
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button className="btn primary" disabled={!r.name.trim()} onClick={save}>
          {isNew ? 'Add recipe' : 'Save'}
        </button>
      </div>
    </Modal>
  );
}
