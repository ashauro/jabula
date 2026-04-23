import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { Tier, Spark } from '../components/Shell';
import { PLAYERS, TIERS, HOSTS, avatarBg, initials, fmtMoney, fmtTime } from '../data';

export default function PlayerList({ setPage }) {
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hostFilter, setHostFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'ngr30', dir: 'desc' });
  const [view, setView] = useState('table');

  const filtered = useMemo(() => {
    let list = PLAYERS.slice();
    if (tierFilter !== 'all') list = list.filter(p => p.tier === tierFilter);
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (hostFilter !== 'all') list = list.filter(p => p.host === hostFilter);
    list.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      if (typeof av === 'string') return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sort.dir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [tierFilter, statusFilter, hostFilter, sort]);

  const SortHead = ({ k, children, align }) => (
    <th
      style={{ textAlign: align || 'left', cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setSort(s => ({ key: k, dir: s.key === k && s.dir === 'desc' ? 'asc' : 'desc' }))}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
        {sort.key === k && <Icon name={sort.dir === 'desc' ? 'arrowDown' : 'arrowUp'} size={10} style={{ color: 'var(--gold)' }} />}
      </span>
    </th>
  );

  const kpis = [
    { label: 'Active VIPs', value: '342', delta: '+18', up: true, spark: [10, 14, 13, 16, 18, 17, 22, 24] },
    { label: 'NGR · last 30d', value: '€2.84M', delta: '+12.4%', up: true, spark: [12, 15, 14, 18, 17, 22, 26, 28] },
    { label: 'Avg lifetime deposits', value: '€87,420', delta: '+3.1%', up: true, spark: [20, 22, 21, 23, 24, 26, 27, 28] },
    { label: 'At-risk players', value: '12', delta: '+3', up: false, spark: [8, 9, 10, 12, 11, 10, 12, 12] },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">VIP Players</h1>
          <div className="page-sub">342 active across 4 tiers · assigned to 6 hosts</div>
        </div>
        <div className="hstack gap-4">
          <button className="btn"><Icon name="download" size={13} />Export</button>
          <button className="btn btn-primary"><Icon name="userPlus" size={13} />Add VIP</button>
        </div>
      </div>

      <div className="kpi-row">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <Spark points={k.spark} color={k.up ? '#5DBE7E' : '#E5635C'} />
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={'kpi-delta ' + (k.up ? 'up' : 'down')}>
              <Icon name={k.up ? 'arrowUp' : 'arrowDown'} size={10} />{k.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <button className={'chip ' + (tierFilter === 'all' ? 'active' : '')} onClick={() => setTierFilter('all')}>All tiers</button>
        {TIERS.map(t => (
          <button key={t.id} className={'chip ' + (tierFilter === t.id ? 'active' : '')} onClick={() => setTierFilter(t.id)}>
            <span
              className="tier-dot"
              style={{
                background:
                  t.id === 'bronze' ? '#B57A4D' : t.id === 'silver' ? '#B8B4AC' : t.id === 'gold' ? '#F2B544' : '#9FD1E0',
              }}
            />
            {t.label}
          </button>
        ))}
        <span className="toolbar-sep" />
        <select className="chip" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'var(--surface)' }}>
          <option value="all">Any status</option>
          <option value="online">Online now</option>
          <option value="away">Away</option>
          <option value="offline">Offline</option>
        </select>
        <select className="chip" value={hostFilter} onChange={e => setHostFilter(e.target.value)}>
          <option value="all">All hosts</option>
          {HOSTS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <button className="chip chip-add"><Icon name="plus" size={11} />Add filter</button>
        <div style={{ marginLeft: 'auto' }} className="hstack gap-4">
          <div className="segmented">
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
            <button className={view === 'kanban' ? 'active' : ''} onClick={() => setView('kanban')}>By tier</button>
          </div>
          <span className="muted" style={{ fontSize: 12 }}>{filtered.length} players</span>
        </div>
      </div>

      {view === 'table' ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 28 }}><input type="checkbox" style={{ accentColor: '#F2B544' }} /></th>
                <SortHead k="name">Player</SortHead>
                <SortHead k="tier">Tier</SortHead>
                <SortHead k="lifetimeDeposits" align="right">Lifetime dep.</SortHead>
                <SortHead k="ngr30" align="right">NGR · 30d</SortHead>
                <SortHead k="balance" align="right">Balance</SortHead>
                <SortHead k="avgBet" align="right">Avg bet</SortHead>
                <SortHead k="sessions30" align="right">Sessions</SortHead>
                <SortHead k="lastActive">Last active</SortHead>
                <th>Host</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 24).map(p => (
                <tr key={p.id} onClick={() => setPage({ kind: 'profile', id: p.id })}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox" style={{ accentColor: '#F2B544' }} /></td>
                  <td>
                    <div className="player-cell">
                      <div className="avatar" style={{ background: avatarBg(p.name) }}>
                        {initials(p.name)}
                        <span className={'status-dot ' + p.status} />
                      </div>
                      <div>
                        <div className="player-name">
                          {p.name}{' '}
                          {p.flags.includes('bonus-abuse-review') && (
                            <Icon name="flag" size={11} style={{ color: 'var(--warn)', marginLeft: 4 }} />
                          )}
                        </div>
                        <div className="player-id">{p.id} · {p.country.flag} {p.country.code}</div>
                      </div>
                    </div>
                  </td>
                  <td><Tier tier={p.tier} /></td>
                  <td className="num" style={{ textAlign: 'right' }}>{fmtMoney(p.lifetimeDeposits)}</td>
                  <td className="num" style={{ textAlign: 'right', color: p.ngr30 >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {p.ngr30 >= 0 ? '+' : ''}{fmtMoney(p.ngr30)}
                  </td>
                  <td className="num" style={{ textAlign: 'right' }}>{fmtMoney(p.balance)}</td>
                  <td className="num" style={{ textAlign: 'right' }}>€{p.avgBet}</td>
                  <td className="num" style={{ textAlign: 'right' }}>{p.sessions30}</td>
                  <td className="dim" style={{ fontSize: 12 }}>{fmtTime(p.lastActive)}</td>
                  <td style={{ fontSize: 12.5 }}>{p.host.split(' ')[0]} {p.host.split(' ')[1]?.[0]}.</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="close-btn"><Icon name="moreH" size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {TIERS.slice().reverse().map(t => {
            const members = filtered.filter(p => p.tier === t.id);
            return (
              <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
                <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <Tier tier={t.id} />
                  <span className="muted" style={{ fontSize: 11.5 }}>{members.length}</span>
                </div>
                <div className="vstack gap-4">
                  {members.slice(0, 8).map(p => (
                    <div
                      key={p.id}
                      onClick={() => setPage({ kind: 'profile', id: p.id })}
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: 10, cursor: 'pointer' }}
                    >
                      <div className="player-cell">
                        <div className="avatar sm" style={{ background: avatarBg(p.name) }}>
                          {initials(p.name)}
                          <span className={'status-dot ' + p.status} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                          <div className="num" style={{ fontSize: 11, color: 'var(--text-low)' }}>
                            NGR30{' '}
                            <span style={{ color: p.ngr30 >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                              {p.ngr30 >= 0 ? '+' : ''}{fmtMoney(p.ngr30)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {members.length > 8 && (
                    <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'center' }}>+{members.length - 8} more</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
