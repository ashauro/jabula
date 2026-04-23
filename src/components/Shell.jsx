import { Fragment } from 'react';
import Icon from './Icon';
import { PLAYERS, avatarBg, initials } from '../data';

export function Sidebar({ page, setPage, counts }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'players', label: 'VIP Players', icon: 'players', badge: counts.players },
    { id: 'segments', label: 'Segments', icon: 'segments', badge: counts.segments },
    { id: 'comms', label: 'Inbox', icon: 'chat', badge: counts.unread },
    { id: 'bonuses', label: 'Bonuses', icon: 'gift' },
    { id: 'reports', label: 'Reports', icon: 'chart' },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">V</div>
        <div>
          <div className="sb-brand-name">Vanta</div>
          <div className="sb-brand-sub">VIP CRM</div>
        </div>
      </div>
      <div className="sb-section">
        <div className="sb-section-label">Workspace</div>
        <nav className="sb-nav">
          {items.map(i => (
            <button key={i.id} className={'sb-item' + (page === i.id ? ' active' : '')} onClick={() => setPage(i.id)}>
              <Icon name={i.icon} size={15} className="sb-icon" />
              <span>{i.label}</span>
              {i.badge != null && <span className="sb-badge">{i.badge}</span>}
            </button>
          ))}
        </nav>
      </div>
      <div className="sb-section">
        <div className="sb-section-label">Pinned players</div>
        <nav className="sb-nav">
          {PLAYERS.slice(0, 3).map(p => (
            <button key={p.id} className="sb-item" onClick={() => setPage({ kind: 'profile', id: p.id })}>
              <div className="avatar sm" style={{ background: avatarBg(p.name) }}>{initials(p.name)}</div>
              <span style={{ fontSize: 12.5 }}>{p.name}</span>
              <span
                className="dot"
                style={{
                  marginLeft: 'auto',
                  background:
                    p.status === 'online'
                      ? 'var(--success)'
                      : p.status === 'away'
                      ? 'var(--warn)'
                      : 'var(--text-dim)',
                }}
              />
            </button>
          ))}
        </nav>
      </div>
      <div className="sb-me">
        <div className="sb-avatar">EV</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-me-name">Elena Vasquez</div>
          <div className="sb-me-role">Senior VIP Host</div>
        </div>
        <button className="close-btn" title="Settings"><Icon name="settings" size={14} /></button>
      </div>
    </aside>
  );
}

export function Topbar({ crumbs, right }) {
  return (
    <div className="topbar">
      <div className="tb-crumbs">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="tb-crumb-sep"><Icon name="chevronRight" size={12} /></span>}
            <span className={i === crumbs.length - 1 ? 'tb-crumb-active' : ''}>{c}</span>
          </Fragment>
        ))}
      </div>
      <div className="tb-search">
        <Icon name="search" size={14} />
        <input placeholder="Search players, bonuses, tickets…" />
        <kbd>⌘K</kbd>
      </div>
      {right}
    </div>
  );
}

export function Modal({ title, sub, onClose, children, footer, wide }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={'modal' + (wide ? ' wide' : '')} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{title}</h3>
            {sub && <div className="modal-sub">{sub}</div>}
          </div>
          <button className="close-btn" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function Tier({ tier }) {
  return <span className={'tier ' + tier}><span className="tier-dot" />{tier}</span>;
}

export function StatusDot({ status }) {
  return (
    <span
      className="dot"
      style={{
        background:
          status === 'online' ? 'var(--success)' : status === 'away' ? 'var(--warn)' : 'var(--text-dim)',
      }}
    />
  );
}

export function Spark({ points, color = '#F2B544' }) {
  const w = 72, h = 28;
  const max = Math.max(...points), min = Math.min(...points);
  const pts = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * h}`)
    .join(' ');
  return (
    <svg className="kpi-spark" viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
