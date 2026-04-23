import { useState } from 'react';
import Icon from '../components/Icon';
import { Tier } from '../components/Shell';
import { PLAYERS, SEGMENTS, avatarBg, initials, fmtMoney, fmtTime } from '../data';

const toneColor = (c) =>
  ({ gold: 'var(--gold)', danger: 'var(--danger)', info: 'var(--info)', neutral: 'var(--text-mid)' }[c] || 'var(--gold)');
const toneBg = (c) =>
  ({ gold: 'var(--gold-bg)', danger: 'var(--danger-bg)', info: 'var(--info-bg)', neutral: '#222228' }[c] || 'var(--gold-bg)');

export default function Segments({ setPage }) {
  const [activeSeg, setActiveSeg] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Segments</h1>
          <div className="page-sub">Live audiences for targeted outreach · auto-refreshed hourly</div>
        </div>
        <div className="hstack gap-4">
          <button className="btn"><Icon name="download" size={13} />Export all</button>
          <button className="btn btn-primary"><Icon name="plus" size={13} />New segment</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {SEGMENTS.map(s => (
          <div key={s.id} className="seg-card" onClick={() => setActiveSeg(s)}>
            <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
              <div
                className="tl-ic"
                style={{ background: toneBg(s.color), borderColor: toneColor(s.color) + '40', color: toneColor(s.color) }}
              >
                <Icon name={s.icon} size={14} />
              </div>
              <div className="hstack gap-3">
                {s.trend !== 0 && (
                  <span className={'pill ' + (s.trend > 0 ? 'pill-success' : 'pill-danger')}>
                    <Icon name={s.trend > 0 ? 'arrowUp' : 'arrowDown'} size={10} />{Math.abs(s.trend)}
                  </span>
                )}
                <button className="close-btn"><Icon name="moreH" size={13} /></button>
              </div>
            </div>
            <div className="seg-name">{s.name}</div>
            <div className="seg-desc">{s.desc}</div>
            <div className="hstack" style={{ justifyContent: 'space-between', marginTop: 14 }}>
              <div className="num" style={{ fontSize: 22, fontWeight: 600 }}>{s.members}</div>
              <div className="hstack gap-3">
                <button className="btn btn-sm"><Icon name="send" size={11} />Campaign</button>
                <button className="btn btn-sm btn-ghost">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeSeg && (
        <div style={{ marginTop: 20 }}>
          <div className="section-header">
            <div>
              <div className="section-title hstack gap-4">
                {activeSeg.name}
                <span className="tag">{activeSeg.members} players</span>
              </div>
              <div className="section-sub">{activeSeg.desc}</div>
            </div>
            <div className="hstack gap-4">
              <button className="btn btn-sm"><Icon name="gift" size={11} />Bulk bonus</button>
              <button className="btn btn-sm btn-primary"><Icon name="send" size={11} />Send campaign</button>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Player</th><th>Tier</th><th style={{ textAlign: 'right' }}>Lifetime dep.</th>
                  <th style={{ textAlign: 'right' }}>NGR 30d</th><th>Last active</th><th>Host</th>
                </tr>
              </thead>
              <tbody>
                {PLAYERS.slice(0, Math.min(activeSeg.members, 8)).map(p => (
                  <tr key={p.id} onClick={() => setPage({ kind: 'profile', id: p.id })}>
                    <td>
                      <div className="player-cell">
                        <div className="avatar" style={{ background: avatarBg(p.name) }}>
                          {initials(p.name)}<span className={'status-dot ' + p.status} />
                        </div>
                        <div>
                          <div className="player-name">{p.name}</div>
                          <div className="player-id">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><Tier tier={p.tier} /></td>
                    <td className="num" style={{ textAlign: 'right' }}>{fmtMoney(p.lifetimeDeposits)}</td>
                    <td className="num" style={{ textAlign: 'right', color: p.ngr30 >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {p.ngr30 >= 0 ? '+' : ''}{fmtMoney(p.ngr30)}
                    </td>
                    <td className="dim">{fmtTime(p.lastActive)}</td>
                    <td style={{ fontSize: 12.5 }}>{p.host}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
