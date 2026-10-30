import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mockData } from '../data/mock';
import { makeLookup, type Lookup } from '../lib/calc';
import type { AppData, FloristEvent } from '../types';

// Mock persistence layer. Replace load/save with API calls once a data source is chosen.
const STORAGE_KEY = 'petal-ledger:v2';

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // fall through to mock data
  }
  return structuredClone(mockData);
}

interface Store {
  data: AppData;
  lookup: Lookup;
  /** Mutate a draft copy of the data; the result replaces state. */
  update: (fn: (draft: AppData) => void) => void;
  updateEvent: (id: string, fn: (draft: FloristEvent) => void) => void;
  reset: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage unavailable — keep in memory only
    }
  }, [data]);

  const update = useCallback((fn: (draft: AppData) => void) => {
    setData((prev) => {
      const draft = structuredClone(prev);
      fn(draft);
      return draft;
    });
  }, []);

  const updateEvent = useCallback(
    (id: string, fn: (draft: FloristEvent) => void) =>
      update((d) => {
        const ev = d.events.find((e) => e.id === id);
        if (ev) fn(ev);
      }),
    [update],
  );

  const reset = useCallback(() => setData(structuredClone(mockData)), []);
  const lookup = useMemo(() => makeLookup(data), [data]);

  return (
    <StoreContext.Provider value={{ data, lookup, update, updateEvent, reset }}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
