import { useState } from 'react';
import Icon from '../components/Icon';
import { Tier, Spark } from '../components/Shell';
import { avatarBg, initials, fmtMoney } from '../data';
import { useDashboard } from '../api/useDashboard';

export default function Dashboard({ setPage }) {
  const [period, setPeriod] = useState('month');
  const { data, loading, error } = useDashboard(period);
  const { kpis, tasks, topPlayers, atRisk, greeting, hostName, unreadMessages, pendingReviews } = data;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}, {hostName}</h1>
          <div className="page-sub">
            {error
              ? <span style={{ color: 'var(--text-low)', fontStyle: 'italic' }}>{error}</span>
              : <>You have {unreadMessages} unread VIP message{unreadMessages !== 1 ? 's' : ''} and {pendingReviews} withdrawal{pendingReviews !== 1 ? 's' : ''} awaiting your review.</>
            }
          </div>
        </div>
        <div className="hstack gap-4">
          <div className="segmented">
            <button className={period === 'today' ? 'active' : ''} onClick={() => setPeriod('today')}>Today</button>
            <button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>This month</button>
            <button className={period === 'quarter' ? 'active' : ''} onClick={() => setPeriod('quarter')}>Quarter</button>
          </div>
        </div>
      </div>

      <div className="kpi-row">
        {kpis.map((k, i) => (
          <div className={'kpi' + (loading ? ' kpi-loading' : '')} key={i}>
            <Spark points={k.spark} color={k.up ? '#5DBE7E' : '#E5635C'} />
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={'kpi-delta ' + (k.up ? 'up' : 'down')}>
              {k.up ? <Icon name="arrowUp" size={10} /> : <Icon name="arrowDown" size={10} />}
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        <div className="p-card">
          <div className="p-card-header">
            <div className="p-card-title">Your queue · {tasks.length} tasks</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('players')}>View all</button>
          </div>
          <div>
            {tasks.map((t, i) => (
              <div key={i} className="tl-item" style={{ borderBottom: '1px solid var(--border)', padding: '12px 16px' }}>
                <div className={'tl-ic ' + t.tone}><Icon name={t.icon} size={13} /></div>
                <div><div className="tl-title">{t.title}</div><div className="tl-desc">{t.sub}</div></div>
                <div className="tl-time">{t.due}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="vstack gap-6">
          <div className="p-card">
            <div className="p-card-header">
              <div className="p-card-title">Top players · {period === 'today' ? 'today' : period === 'quarter' ? 'this quarter' : 'this month'}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage('players')}>Full list</button>
            </div>
            <table className="mini-table">
              <thead><tr><th>Player</th><th style={{ textAlign: 'right' }}>NGR</th><th /></tr></thead>
              <tbody>
                {topPlayers.map(p => (
                  <tr key={p.id} onClick={() => setPage({ kind: 'profile', id: p.id })} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="player-cell">
                        <div className="avatar sm" style={{ background: avatarBg(p.name) }}>{initials(p.name)}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 12.5 }}>{p.name}</div>
                          <div className="dim" style={{ fontSize: 11 }}>{p.country?.flag ?? ''} <Tier tier={p.tier} /></div>
                        </div>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: 'right', color: 'var(--success)' }}>+{fmtMoney(p.ngr30 ?? p.ngr ?? 0)}</td>
                    <td><Icon name="chevronRight" size={12} style={{ color: 'var(--text-low)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-card">
            <div className="p-card-header">
              <div className="p-card-title">At-risk alerts</div>
              <span className="pill pill-warn">{atRisk.length}</span>
            </div>
            <div>
              {atRisk.map((a, i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="hstack" style={{ justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                    <Icon name="slash" size={12} style={{ color: 'var(--danger)' }} />
                  </div>
                  <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
