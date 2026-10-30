import type { AppData, EventItem, FloristEvent, Flower, HardGood, WholesalerOffer } from '../types';

export interface Lookup {
  flower: (id: string) => Flower | undefined;
  hardGood: (id: string) => HardGood | undefined;
}

export function makeLookup(data: Pick<AppData, 'flowers' | 'hardGoods'>): Lookup {
  const f = new Map(data.flowers.map((x) => [x.id, x]));
  const h = new Map(data.hardGoods.map((x) => [x.id, x]));
  return { flower: (id) => f.get(id), hardGood: (id) => h.get(id) };
}

export const stemCost = (o: WholesalerOffer) => o.pricePerBunch / o.stemsPerBunch;

/** Offer used for costing: the event's chosen wholesaler, else the cheapest per stem. */
export function chooseOffer(flower: Flower, preferredWholesalerId?: string): WholesalerOffer | undefined {
  if (preferredWholesalerId) {
    const pref = flower.offers.find((o) => o.wholesalerId === preferredWholesalerId);
    if (pref) return pref;
  }
  return [...flower.offers].sort((a, b) => stemCost(a) - stemCost(b))[0];
}

export interface ItemBreakdown {
  /** Per-unit costs */
  flowerCost: number;
  consumableCost: number;
  rentalCost: number;
  laborCost: number;
  /** Per-unit client price */
  unitPrice: number;
  /** unitPrice × quantity */
  lineTotal: number;
  lineCost: number;
  stemsPerUnit: number;
}

export function itemBreakdown(item: EventItem, event: FloristEvent, lookup: Lookup): ItemBreakdown {
  const p = event.pricing;
  let flowerCost = 0;
  let stemsPerUnit = 0;
  for (const rf of item.flowers) {
    const flower = lookup.flower(rf.flowerId);
    if (!flower) continue;
    const offer = chooseOffer(flower, event.sourcing[flower.id]);
    if (offer) flowerCost += stemCost(offer) * rf.stems;
    stemsPerUnit += rf.stems;
  }
  let consumableCost = 0;
  let rentalCost = 0;
  for (const rh of item.hardGoods) {
    const hg = lookup.hardGood(rh.hardGoodId);
    if (!hg) continue;
    if (hg.reusable) rentalCost += hg.unitCost * rh.quantity;
    else consumableCost += hg.unitCost * rh.quantity;
  }
  const laborCost = (item.laborMinutes / 60) * p.laborRate;
  const computed =
    flowerCost * p.floralMarkup + consumableCost * p.hardGoodMarkup + rentalCost * p.rentalMarkup + laborCost;
  const unitPrice = item.priceOverride ?? computed;
  return {
    flowerCost,
    consumableCost,
    rentalCost,
    laborCost,
    unitPrice,
    lineTotal: unitPrice * item.quantity,
    lineCost: (flowerCost + consumableCost + laborCost) * item.quantity,
    stemsPerUnit,
  };
}

export interface EventTotals {
  floral: number;
  hardGoods: number;
  labor: number;
  itemsSubtotal: number;
  delivery: number;
  taxable: number;
  tax: number;
  total: number;
  cost: number;
  margin: number;
  budgetRemaining: number;
  byCategory: { id: string; name: string; total: number }[];
}

export function eventTotals(event: FloristEvent, lookup: Lookup): EventTotals {
  const p = event.pricing;
  let floral = 0;
  let hardGoods = 0;
  let labor = 0;
  let itemsSubtotal = 0;
  let cost = 0;
  const byCategory = event.categories.map((c) => {
    let total = 0;
    for (const item of c.items) {
      const b = itemBreakdown(item, event, lookup);
      floral += b.flowerCost * p.floralMarkup * item.quantity;
      hardGoods += (b.consumableCost * p.hardGoodMarkup + b.rentalCost * p.rentalMarkup) * item.quantity;
      labor += b.laborCost * item.quantity;
      total += b.lineTotal;
      cost += b.lineCost;
    }
    itemsSubtotal += total;
    return { id: c.id, name: c.name, total };
  });
  const delivery = p.deliveryFee;
  // Overrides make the floral/hard-goods/labor split approximate; tax uses line totals.
  const taxable = itemsSubtotal + delivery - (p.taxLabor ? 0 : labor);
  const tax = (Math.max(0, taxable) * p.taxRate) / 100;
  const total = itemsSubtotal + delivery + tax;
  return {
    floral,
    hardGoods,
    labor,
    itemsSubtotal,
    delivery,
    taxable,
    tax,
    total,
    cost,
    margin: itemsSubtotal + delivery - cost,
    budgetRemaining: event.budget - total,
    byCategory,
  };
}

export interface StemOrderLine {
  flower: Flower;
  stemsUsed: number;
  bufferPct: number;
  bufferIsCustom: boolean;
  stemsWithBuffer: number;
  offer?: WholesalerOffer;
  bunches: number;
  stemsOrdered: number;
  leftover: number;
  orderCost: number;
  leftoverCost: number;
  usedIn: { itemName: string; stems: number }[];
}

/** Aggregates stems across every item × quantity and rounds up to whole bunches. */
export function stemOrder(event: FloristEvent, lookup: Lookup): StemOrderLine[] {
  const used = new Map<string, { stems: number; usedIn: { itemName: string; stems: number }[] }>();
  for (const c of event.categories) {
    for (const item of c.items) {
      for (const rf of item.flowers) {
        const stems = rf.stems * item.quantity;
        if (stems <= 0) continue;
        const entry = used.get(rf.flowerId) ?? { stems: 0, usedIn: [] };
        entry.stems += stems;
        entry.usedIn.push({ itemName: `${item.name} ×${item.quantity}`, stems });
        used.set(rf.flowerId, entry);
      }
    }
  }
  const lines: StemOrderLine[] = [];
  for (const [flowerId, u] of used) {
    const flower = lookup.flower(flowerId);
    if (!flower) continue;
    const offer = chooseOffer(flower, event.sourcing[flowerId]);
    const bufferIsCustom = flower.breakageBuffer !== undefined;
    const bufferPct = flower.breakageBuffer ?? event.wastageBuffer;
    const stemsWithBuffer = Math.ceil(u.stems * (1 + bufferPct / 100));
    const bunches = offer ? Math.ceil(stemsWithBuffer / offer.stemsPerBunch) : 0;
    const stemsOrdered = offer ? bunches * offer.stemsPerBunch : 0;
    const leftover = Math.max(0, stemsOrdered - u.stems);
    lines.push({
      flower,
      stemsUsed: u.stems,
      bufferPct,
      bufferIsCustom,
      stemsWithBuffer,
      offer,
      bunches,
      stemsOrdered,
      leftover,
      orderCost: offer ? bunches * offer.pricePerBunch : 0,
      leftoverCost: offer ? leftover * stemCost(offer) : 0,
      usedIn: u.usedIn,
    });
  }
  return lines.sort((a, b) => a.flower.name.localeCompare(b.flower.name));
}

export const eventMonth = (event: FloristEvent) => new Date(event.date + 'T12:00:00').getMonth();

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
