// Core domain model. Kept data-source agnostic: every entity has a string id
// so the mock store can later be swapped for an API / database.

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Availability = 'peak' | 'available' | 'limited' | 'unavailable';

export interface Wholesaler {
  id: string;
  name: string;
  location: string;
  contact: string;
  leadTimeDays: number;
}

/** A wholesaler's offer for a specific flower. Flowers are bought by the bunch. */
export interface WholesalerOffer {
  wholesalerId: string;
  stemsPerBunch: number;
  pricePerBunch: number;
}

export interface Flower {
  id: string;
  name: string;
  variety: string;
  color: string; // display color name
  hex: string; // used to render the placeholder image
  shape: 'round' | 'spike' | 'spray' | 'foliage' | 'cluster';
  imageUrl?: string;
  /** Availability by month (index 0 = January). */
  seasonality: Availability[];
  offers: WholesalerOffer[];
}

export interface HardGood {
  id: string;
  name: string;
  category: string;
  unitCost: number;
  /** Rentals/reusables come back after the event and are charged differently. */
  reusable: boolean;
  inStock: number;
}

export interface RecipeFlower {
  flowerId: string;
  stems: number;
}

export interface RecipeHardGood {
  hardGoodId: string;
  quantity: number;
}

/** A reusable recipe template (e.g. "Bridal bouquet — garden style"). */
export interface RecipeTemplate {
  id: string;
  name: string;
  description: string;
  flowers: RecipeFlower[];
  hardGoods: RecipeHardGood[];
  laborMinutes: number;
}

/** A line item inside an event category. Quantity multiplies the recipe. */
export interface EventItem {
  id: string;
  name: string;
  quantity: number;
  notes: string;
  flowers: RecipeFlower[];
  hardGoods: RecipeHardGood[];
  laborMinutes: number;
  /** Optional manual override of the per-unit client price. */
  priceOverride?: number;
}

export interface EventCategory {
  id: string;
  name: string;
  items: EventItem[];
}

export type EventStatus = 'inquiry' | 'proposal' | 'booked' | 'completed';

export interface PricingSettings {
  taxRate: number; // percent, e.g. 8.25
  floralMarkup: number; // multiplier on flower cost, e.g. 3.5
  hardGoodMarkup: number; // multiplier on consumable hard goods
  rentalMarkup: number; // multiplier on reusable hard goods
  laborRate: number; // $ per hour
  deliveryFee: number;
  taxLabor: boolean;
}

export interface FloristEvent {
  id: string;
  name: string;
  client: string;
  clientEmail: string;
  date: string; // ISO date
  venue: string;
  status: EventStatus;
  budget: number;
  pricing: PricingSettings;
  categories: EventCategory[];
  /** Preferred wholesaler per flower for ordering; falls back to cheapest. */
  sourcing: Record<string, string>;
  /** Extra stems ordered beyond need, as a percent buffer for breakage. */
  wastageBuffer: number;
}

export interface AppData {
  flowers: Flower[];
  hardGoods: HardGood[];
  wholesalers: Wholesaler[];
  recipes: RecipeTemplate[];
  events: FloristEvent[];
}
