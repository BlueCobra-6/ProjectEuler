import type { AppData, Availability, Flower } from '../types';

// Seasonality shorthand, Jan→Dec: P = peak, A = available, L = limited, - = unavailable
const season = (s: string): Availability[] =>
  s.split('').map((c) => (c === 'P' ? 'peak' : c === 'A' ? 'available' : c === 'L' ? 'limited' : 'unavailable'));

const wholesalers = [
  { id: 'w-bloomfield', name: 'Bloomfield Wholesale', location: 'Los Angeles, CA', contact: 'orders@bloomfield.example', leadTimeDays: 4 },
  { id: 'w-delta', name: 'Delta Valley Flora', location: 'Sacramento, CA', contact: '(555) 210-4410', leadTimeDays: 3 },
  { id: 'w-farm', name: 'Hollow Creek Farm (local)', location: 'Petaluma, CA', contact: 'hello@hollowcreek.example', leadTimeDays: 2 },
  { id: 'w-import', name: 'Andes Direct Imports', location: 'Miami, FL', contact: 'sales@andesdirect.example', leadTimeDays: 6 },
];

const flowers: Flower[] = [
  {
    id: 'f-garden-rose', name: 'Garden Rose', variety: "Juliet (David Austin)", color: 'Apricot', hex: '#f4b183', shape: 'round',
    seasonality: season('AAAPPPAAAAAA'),
    offers: [{ wholesalerId: 'w-bloomfield', stemsPerBunch: 12, pricePerBunch: 54 }, { wholesalerId: 'w-import', stemsPerBunch: 12, pricePerBunch: 46.8 }],
  },
  {
    id: 'f-rose-white', name: 'Rose', variety: 'Playa Blanca', color: 'White', hex: '#f7f3ea', shape: 'round',
    seasonality: season('AAAAAAAAAAAA'),
    offers: [{ wholesalerId: 'w-import', stemsPerBunch: 25, pricePerBunch: 42.5 }, { wholesalerId: 'w-delta', stemsPerBunch: 25, pricePerBunch: 47.5 }],
  },
  {
    id: 'f-peony', name: 'Peony', variety: 'Sarah Bernhardt', color: 'Blush', hex: '#f6c1cc', shape: 'round',
    seasonality: season('L--APPL----L'),
    offers: [{ wholesalerId: 'w-bloomfield', stemsPerBunch: 10, pricePerBunch: 65 }, { wholesalerId: 'w-farm', stemsPerBunch: 10, pricePerBunch: 58 }],
  },
  {
    id: 'f-ranunculus', name: 'Ranunculus', variety: 'Cloni Hanoi', color: 'Ivory/Blush', hex: '#f3d9cf', shape: 'round',
    seasonality: season('PPPPAL----LA'),
    offers: [{ wholesalerId: 'w-farm', stemsPerBunch: 10, pricePerBunch: 22 }, { wholesalerId: 'w-bloomfield', stemsPerBunch: 10, pricePerBunch: 26 }],
  },
  {
    id: 'f-dahlia', name: 'Dahlia', variety: 'Café au Lait', color: 'Champagne', hex: '#ecd2b8', shape: 'round',
    seasonality: season('------APPPL-'),
    offers: [{ wholesalerId: 'w-farm', stemsPerBunch: 5, pricePerBunch: 22.5 }, { wholesalerId: 'w-delta', stemsPerBunch: 5, pricePerBunch: 27.5 }],
  },
  {
    id: 'f-lisianthus', name: 'Lisianthus', variety: 'Rosita White', color: 'White', hex: '#f2f0f5', shape: 'spray',
    seasonality: season('AAAAPPPPAAAA'),
    offers: [{ wholesalerId: 'w-delta', stemsPerBunch: 10, pricePerBunch: 28 }, { wholesalerId: 'w-bloomfield', stemsPerBunch: 10, pricePerBunch: 31 }],
  },
  {
    id: 'f-spray-rose', name: 'Spray Rose', variety: 'Bombastic', color: 'Pale Pink', hex: '#f5cfd6', shape: 'spray',
    seasonality: season('AAAAAAAAAAAA'),
    offers: [{ wholesalerId: 'w-import', stemsPerBunch: 10, pricePerBunch: 21 }],
  },
  {
    id: 'f-delphinium', name: 'Delphinium', variety: 'Belladonna', color: 'Sky Blue', hex: '#9db8e6', shape: 'spike',
    seasonality: season('LLAAPPPAALLL'),
    offers: [{ wholesalerId: 'w-delta', stemsPerBunch: 10, pricePerBunch: 32 }],
  },
  {
    id: 'f-snapdragon', name: 'Snapdragon', variety: 'Potomac White', color: 'White', hex: '#f6f2e4', shape: 'spike',
    seasonality: season('LAAPPPAAPALL'),
    offers: [{ wholesalerId: 'w-farm', stemsPerBunch: 10, pricePerBunch: 18 }, { wholesalerId: 'w-delta', stemsPerBunch: 10, pricePerBunch: 21 }],
  },
  {
    id: 'f-hydrangea', name: 'Hydrangea', variety: 'Premium White', color: 'White', hex: '#e9eef2', shape: 'cluster',
    seasonality: season('AAAAPPPPPAAA'),
    offers: [{ wholesalerId: 'w-import', stemsPerBunch: 15, pricePerBunch: 52.5 }, { wholesalerId: 'w-bloomfield', stemsPerBunch: 10, pricePerBunch: 41 }],
  },
  {
    id: 'f-anemone', name: 'Anemone', variety: 'Mistral Panda', color: 'White w/ Black Eye', hex: '#fbfbfb', shape: 'round',
    seasonality: season('PPPAL-----AP'),
    offers: [{ wholesalerId: 'w-farm', stemsPerBunch: 10, pricePerBunch: 19 }],
  },
  {
    id: 'f-eucalyptus', name: 'Silver Dollar Eucalyptus', variety: 'Cinerea', color: 'Sage', hex: '#9fb5a5', shape: 'foliage',
    seasonality: season('AAAAAAAAAAAA'),
    offers: [{ wholesalerId: 'w-delta', stemsPerBunch: 10, pricePerBunch: 12 }, { wholesalerId: 'w-farm', stemsPerBunch: 10, pricePerBunch: 10 }],
  },
  {
    id: 'f-italian-ruscus', name: 'Italian Ruscus', variety: 'Danae', color: 'Green', hex: '#5f8a5c', shape: 'foliage',
    seasonality: season('AAAAAAAAAAAA'),
    offers: [{ wholesalerId: 'w-delta', stemsPerBunch: 10, pricePerBunch: 9.5 }],
  },
  {
    id: 'f-smilax', name: 'Southern Smilax', variety: 'Garland (per 25ft)', color: 'Green', hex: '#4c7a4b', shape: 'foliage',
    seasonality: season('AAAAAAAAAAAA'),
    offers: [{ wholesalerId: 'w-bloomfield', stemsPerBunch: 1, pricePerBunch: 38 }],
  },
  {
    id: 'f-sweet-pea', name: 'Sweet Pea', variety: 'Spencer Mix', color: 'Lavender', hex: '#c8b4e2', shape: 'spray',
    seasonality: season('-LAPPL------'),
    offers: [{ wholesalerId: 'w-farm', stemsPerBunch: 10, pricePerBunch: 24 }],
  },
  {
    id: 'f-astilbe', name: 'Astilbe', variety: 'Younique Pink', color: 'Pink', hex: '#e9a2bd', shape: 'spike',
    seasonality: season('---LAPPAL---'),
    offers: [{ wholesalerId: 'w-bloomfield', stemsPerBunch: 10, pricePerBunch: 27 }],
  },
];

const hardGoods = [
  { id: 'h-tape', name: 'Stem wrap / floral tape (per bouquet)', category: 'Mechanics', unitCost: 0.35, reusable: false, inStock: 200 },
  { id: 'h-ribbon', name: 'Silk ribbon, 2yd', category: 'Finishing', unitCost: 6.5, reusable: false, inStock: 40 },
  { id: 'h-pin', name: 'Boutonniere magnet', category: 'Finishing', unitCost: 1.25, reusable: false, inStock: 120 },
  { id: 'h-foam', name: 'Eco floral foam brick', category: 'Mechanics', unitCost: 2.4, reusable: false, inStock: 60 },
  { id: 'h-chicken-wire', name: 'Chicken wire (per ft)', category: 'Mechanics', unitCost: 0.8, reusable: false, inStock: 150 },
  { id: 'h-compote', name: 'Gold compote vessel', category: 'Vessels', unitCost: 8, reusable: true, inStock: 24 },
  { id: 'h-bud-vase', name: 'Clear bud vase', category: 'Vessels', unitCost: 1.1, reusable: true, inStock: 80 },
  { id: 'h-taper', name: 'Taper candle (ivory)', category: 'Candles', unitCost: 1.6, reusable: false, inStock: 100 },
  { id: 'h-taper-holder', name: 'Brass taper holder', category: 'Candles', unitCost: 3, reusable: true, inStock: 40 },
  { id: 'h-votive', name: 'Votive w/ candle', category: 'Candles', unitCost: 1.4, reusable: false, inStock: 150 },
  { id: 'h-arch', name: 'Hexagon ceremony arch (rental)', category: 'Structures', unitCost: 75, reusable: true, inStock: 2 },
  { id: 'h-zip', name: 'Zip ties (pack of 50)', category: 'Mechanics', unitCost: 3.5, reusable: false, inStock: 20 },
];

const recipes = [
  {
    id: 'r-bridal', name: 'Bridal Bouquet — Garden Style', description: 'Loose, airy, hand-tied with trailing ribbon.', laborMinutes: 75,
    flowers: [
      { flowerId: 'f-garden-rose', stems: 7 }, { flowerId: 'f-ranunculus', stems: 8 }, { flowerId: 'f-lisianthus', stems: 5 },
      { flowerId: 'f-spray-rose', stems: 4 }, { flowerId: 'f-eucalyptus', stems: 4 }, { flowerId: 'f-italian-ruscus', stems: 3 },
    ],
    hardGoods: [{ hardGoodId: 'h-tape', quantity: 1 }, { hardGoodId: 'h-ribbon', quantity: 1 }],
  },
  {
    id: 'r-bridesmaid', name: 'Bridesmaid Bouquet', description: 'Smaller echo of the bridal bouquet.', laborMinutes: 30,
    flowers: [
      { flowerId: 'f-garden-rose', stems: 3 }, { flowerId: 'f-ranunculus', stems: 4 }, { flowerId: 'f-spray-rose', stems: 2 },
      { flowerId: 'f-eucalyptus', stems: 3 },
    ],
    hardGoods: [{ hardGoodId: 'h-tape', quantity: 1 }, { hardGoodId: 'h-ribbon', quantity: 1 }],
  },
  {
    id: 'r-bout', name: 'Boutonniere', description: 'Single bloom with foliage, magnet back.', laborMinutes: 10,
    flowers: [{ flowerId: 'f-spray-rose', stems: 1 }, { flowerId: 'f-italian-ruscus', stems: 1 }],
    hardGoods: [{ hardGoodId: 'h-pin', quantity: 1 }, { hardGoodId: 'h-tape', quantity: 1 }],
  },
  {
    id: 'r-low-cp', name: 'Low Compote Centerpiece', description: 'Lush, low arrangement in gold compote.', laborMinutes: 40,
    flowers: [
      { flowerId: 'f-garden-rose', stems: 4 }, { flowerId: 'f-rose-white', stems: 5 }, { flowerId: 'f-hydrangea', stems: 1 },
      { flowerId: 'f-lisianthus', stems: 3 }, { flowerId: 'f-eucalyptus', stems: 3 },
    ],
    hardGoods: [{ hardGoodId: 'h-compote', quantity: 1 }, { hardGoodId: 'h-chicken-wire', quantity: 1 }],
  },
  {
    id: 'r-bud', name: 'Bud Vase Trio', description: 'Three clear bud vases with single stems.', laborMinutes: 8,
    flowers: [{ flowerId: 'f-ranunculus', stems: 1 }, { flowerId: 'f-spray-rose', stems: 1 }, { flowerId: 'f-snapdragon', stems: 1 }],
    hardGoods: [{ hardGoodId: 'h-bud-vase', quantity: 3 }],
  },
];

const defaultPricing = {
  taxRate: 8.25,
  floralMarkup: 3.5,
  hardGoodMarkup: 2,
  rentalMarkup: 1.5,
  laborRate: 45,
  deliveryFee: 250,
  taxLabor: false,
};

export const mockData: AppData = {
  wholesalers,
  flowers,
  hardGoods,
  recipes,
  events: [
    {
      id: 'e-harper', name: 'Harper & Quinn Wedding', client: 'Emma Harper', clientEmail: 'emma.h@example.com',
      date: '2027-05-22', venue: 'Oak Hollow Vineyard', status: 'proposal', budget: 9500, wastageBuffer: 10,
      pricing: { ...defaultPricing },
      sourcing: { 'f-garden-rose': 'w-import' },
      categories: [
        {
          id: 'c-personal', name: 'Personal Flowers',
          items: [
            { id: 'i-1', name: 'Bridal Bouquet', quantity: 1, notes: 'Trailing blush silk ribbon', ...pick('r-bridal') },
            { id: 'i-2', name: 'Bridesmaid Bouquets', quantity: 5, notes: '', ...pick('r-bridesmaid') },
            { id: 'i-3', name: 'Boutonnieres', quantity: 7, notes: 'Groom gets garden rose', ...pick('r-bout') },
          ],
        },
        {
          id: 'c-ceremony', name: 'Ceremony',
          items: [
            {
              id: 'i-4', name: 'Arch Install (asymmetric)', quantity: 1, notes: 'Two clusters, upper left + lower right', laborMinutes: 240,
              flowers: [
                { flowerId: 'f-garden-rose', stems: 18 }, { flowerId: 'f-peony', stems: 12 }, { flowerId: 'f-delphinium', stems: 10 },
                { flowerId: 'f-snapdragon', stems: 15 }, { flowerId: 'f-smilax', stems: 2 }, { flowerId: 'f-eucalyptus', stems: 20 },
              ],
              hardGoods: [{ hardGoodId: 'h-arch', quantity: 1 }, { hardGoodId: 'h-chicken-wire', quantity: 12 }, { hardGoodId: 'h-zip', quantity: 1 }],
            },
          ],
        },
        {
          id: 'c-reception', name: 'Reception',
          items: [
            { id: 'i-5', name: 'Guest Table Centerpieces', quantity: 12, notes: '', ...pick('r-low-cp') },
            { id: 'i-6', name: 'Bud Vase Trios', quantity: 8, notes: 'Cocktail tables', ...pick('r-bud') },
            {
              id: 'i-7', name: 'Head Table Garland', quantity: 1, notes: '16ft table', laborMinutes: 90,
              flowers: [{ flowerId: 'f-smilax', stems: 1 }, { flowerId: 'f-spray-rose', stems: 20 }, { flowerId: 'f-italian-ruscus', stems: 15 }],
              hardGoods: [{ hardGoodId: 'h-taper', quantity: 10 }, { hardGoodId: 'h-taper-holder', quantity: 10 }],
            },
          ],
        },
      ],
    },
    {
      id: 'e-gala', name: 'Riverside Arts Gala', client: 'Riverside Arts Council', clientEmail: 'events@riversidearts.example',
      date: '2027-09-18', venue: 'The Foundry', status: 'booked', budget: 6000, wastageBuffer: 8,
      pricing: { ...defaultPricing, floralMarkup: 3, taxRate: 7.75, deliveryFee: 350 },
      sourcing: {},
      categories: [
        {
          id: 'c-entry', name: 'Entry & Bar',
          items: [
            {
              id: 'i-8', name: 'Entry Urn Arrangement', quantity: 2, notes: 'Tall, dramatic', laborMinutes: 60,
              flowers: [{ flowerId: 'f-dahlia', stems: 15 }, { flowerId: 'f-delphinium', stems: 8 }, { flowerId: 'f-hydrangea', stems: 4 }, { flowerId: 'f-eucalyptus', stems: 8 }],
              hardGoods: [{ hardGoodId: 'h-foam', quantity: 3 }],
            },
          ],
        },
        {
          id: 'c-tables', name: 'Dinner Tables',
          items: [{ id: 'i-9', name: 'Long Table Runners', quantity: 6, notes: '8ft each', laborMinutes: 45,
            flowers: [{ flowerId: 'f-dahlia', stems: 10 }, { flowerId: 'f-astilbe', stems: 6 }, { flowerId: 'f-italian-ruscus', stems: 10 }],
            hardGoods: [{ hardGoodId: 'h-votive', quantity: 8 }] }],
        },
      ],
    },
    {
      id: 'e-shower', name: 'Lin Baby Shower', client: 'Grace Lin', clientEmail: 'grace.lin@example.com',
      date: '2027-03-06', venue: 'Private residence', status: 'inquiry', budget: 1200, wastageBuffer: 5,
      pricing: { ...defaultPricing, deliveryFee: 85 },
      sourcing: {},
      categories: [{ id: 'c-decor', name: 'Decor', items: [{ id: 'i-10', name: 'Bud Vase Trios', quantity: 10, notes: '', ...pick('r-bud') }] }],
    },
  ],
};

function pick(recipeId: string) {
  const r = recipes.find((x) => x.id === recipeId)!;
  return {
    flowers: r.flowers.map((f) => ({ ...f })),
    hardGoods: r.hardGoods.map((h) => ({ ...h })),
    laborMinutes: r.laborMinutes,
  };
}
