import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { StoreProvider, useStore } from './state/store';
import { EventsPage } from './pages/EventsPage';
import { EventPage } from './pages/EventPage';
import { FlowersPage } from './pages/FlowersPage';
import { HardGoodsPage } from './pages/HardGoodsPage';
import { RecipesPage } from './pages/RecipesPage';
import { WholesalersPage } from './pages/WholesalersPage';
import './styles.css';

function Shell() {
  const { reset } = useStore();
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">✿</span> Petal Ledger
        </div>
        <nav>
          <NavLink to="/" end>Events</NavLink>
          <NavLink to="/flowers">Flowers</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/hard-goods">Hard goods</NavLink>
          <NavLink to="/wholesalers">Wholesalers</NavLink>
        </nav>
        <button
          className="btn ghost small reset"
          onClick={() => confirm('Reset all data back to the demo data?') && reset()}
        >
          Reset demo data
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:id/*" element={<EventPage />} />
          <Route path="/flowers" element={<FlowersPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/hard-goods" element={<HardGoodsPage />} />
          <Route path="/wholesalers" element={<WholesalersPage />} />
        </Routes>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </StoreProvider>
  </StrictMode>,
);
