import { useEffect, useState } from 'react';
import Icon from './components/Icon';
import { Sidebar, Topbar } from './components/Shell';
import Toast from './components/Toast';
import TweaksPanel from './components/TweaksPanel';
import Dashboard from './screens/Dashboard';
import PlayerList from './screens/PlayerList';
import PlayerProfile from './screens/PlayerProfile';
import Segments from './screens/Segments';
import Comms from './screens/Comms';
import { renderModal } from './modals';
import { PLAYERS, SEGMENTS, THREADS } from './data';

const TWEAK_DEFAULTS = { density: 'airy', theme: 'light' };

export default function App() {
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('vanta:page');
    if (saved) {
      try { return JSON.parse(saved); } catch { return 'dashboard'; }
    }
    return 'dashboard';
  });
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [density, setDensity] = useState(TWEAK_DEFAULTS.density);
  const [theme, setTheme] = useState(() => localStorage.getItem('vanta:theme') || TWEAK_DEFAULTS.theme);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('vanta:page', JSON.stringify(page));
  }, [page]);

  // Tweaks protocol — matches the design's host messaging
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    document.body.dataset.density = density;
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { density } }, '*');
  }, [density]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('vanta:theme', theme);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme } }, '*');
  }, [theme]);

  const openModal = (m) => setModal(m);
  const closeModal = () => setModal(null);
  const dispatch = ({ type, player }) => {
    const msg = {
      bonus: `Bonus issued to ${player.name}`,
      message: `Message sent to ${player.name}`,
      tier: `${player.name} tier updated`,
      call: `Call scheduled with ${player.name}`,
      limits: `Limits updated for ${player.name}`,
      host: `Host reassigned for ${player.name}`,
      freeze: `${player.name} flagged`,
      cashback: `Cashback activated for ${player.name}`,
    }[type] || 'Done';
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const unread = THREADS.filter(t => t.unread).length;
  const counts = { players: 342, segments: SEGMENTS.length, unread };

  let crumbs = [];
  let content = null;
  if (page === 'dashboard') {
    crumbs = ['Home', 'Dashboard'];
    content = <Dashboard setPage={setPage} />;
  } else if (page === 'players') {
    crumbs = ['Home', 'VIP Players'];
    content = <PlayerList setPage={setPage} />;
  } else if (page === 'segments') {
    crumbs = ['Home', 'Segments'];
    content = <Segments setPage={setPage} />;
  } else if (page === 'comms') {
    crumbs = ['Home', 'Inbox'];
    content = <Comms setPage={setPage} />;
  } else if (page && page.kind === 'profile') {
    const p = PLAYERS.find(x => x.id === page.id) || PLAYERS[0];
    crumbs = ['Home', 'VIP Players', p.name];
    content = <PlayerProfile playerId={page.id} setPage={setPage} openModal={openModal} />;
  } else {
    crumbs = ['Home', String(page)];
    content = (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>{String(page)}</h1>
        </div>
        <div className="p-card">
          <div className="empty">This section is scaffolded but not designed in this prototype.</div>
        </div>
      </div>
    );
  }

  const navKey = typeof page === 'string' ? page : page?.kind === 'profile' ? 'players' : '';

  return (
    <div className="app">
      <Sidebar page={navKey} setPage={setPage} counts={counts} />
      <main className="main">
        <Topbar
          crumbs={crumbs}
          right={
            <div className="hstack gap-3">
              <div className="theme-toggle" title="Theme">
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')} title="Light">
                  <Icon name="sun" size={14} />
                </button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')} title="Dark">
                  <Icon name="moon" size={14} />
                </button>
              </div>
              <button className="tb-btn">
                <Icon name="bell" size={13} />
                {unread > 0 && (
                  <span
                    style={{
                      background: 'var(--gold)',
                      color: '#0A0A0C',
                      fontSize: 10,
                      padding: '0 5px',
                      borderRadius: 8,
                      fontWeight: 700,
                    }}
                  >
                    {unread}
                  </span>
                )}
              </button>
            </div>
          }
        />
        <div className="content" key={typeof page === 'string' ? page : page.id}>
          {content}
        </div>
      </main>
      {modal && renderModal(modal, closeModal, dispatch)}
      {toast && <Toast message={toast} />}
      <TweaksPanel
        visible={editMode}
        density={density}
        setDensity={setDensity}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
