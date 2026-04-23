import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { Tier } from '../components/Shell';
import {
  PLAYERS, TIERS, NOTES, buildTimeline,
  avatarBg, initials, fmtMoney, fmtTime,
} from '../data';

export default function PlayerProfile({ playerId, setPage, openModal }) {
  const player = PLAYERS.find(p => p.id === playerId) || PLAYERS[0];
  const [tab, setTab] = useState('overview');
  const [notes, setNotes] = useState(NOTES);
  const [newNote, setNewNote] = useState('');
  const timeline = useMemo(() => buildTimeline(player.id), [player.id]);

  const tierIdx = TIERS.findIndex(t => t.id === player.tier);
  const nextTier = TIERS[tierIdx + 1];
  const curMin = TIERS[tierIdx].min;
  const nextMin = nextTier ? nextTier.min : curMin;
  const tierProgress = nextTier
    ? Math.min(100, Math.round(((player.lifetimeDeposits - curMin) / (nextMin - curMin)) * 100))
    : 100;

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([{ id: Date.now() + '', pinned: false, author: 'Elena Vasquez', at: Date.now(), text: newNote }, ...notes]);
    setNewNote('');
  };
  const togglePin = (id) => setNotes(notes.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const actions = [
    { id: 'bonus', label: 'Issue bonus', sub: 'Cash, free spins, cashback', icon: 'gift', tone: '' },
    { id: 'message', label: 'Send message', sub: 'Email, SMS, in-app', icon: 'send', tone: 'info' },
    { id: 'call', label: 'Schedule call', sub: 'Personal outreach', icon: 'phone', tone: 'info' },
    { id: 'tier', label: 'Adjust tier', sub: 'Manual override', icon: 'trophy', tone: '' },
    { id: 'withdrawal', label: 'Review withdrawal', sub: '€12,000 pending', icon: 'wallet', tone: 'success' },
    { id: 'limits', label: 'Set limits', sub: 'Deposit / loss / time', icon: 'shield', tone: '' },
    { id: 'host', label: 'Assign host', sub: player.host, icon: 'headphones', tone: '' },
    { id: 'freeze', label: 'Flag / freeze', sub: 'Send to risk review', icon: 'slash', tone: 'danger' },
  ];

  const depsBars = [
    ['Jan', 42], ['Feb', 58], ['Mar', 71], ['Apr', 49], ['May', 84], ['Jun', 62],
    ['Jul', 95], ['Aug', 77], ['Sep', 88], ['Oct', 104], ['Nov', 98], ['Dec', 128],
  ];
  const depsMax = Math.max(...depsBars.map(b => b[1]));

  return (
    <div className="page">
      <div className="hstack" style={{ marginBottom: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setPage('players')}>
          <Icon name="chevronLeft" size={13} />Back to players
        </button>
        <span className="muted" style={{ fontSize: 12, marginLeft: 'auto' }}>
          Viewing {PLAYERS.findIndex(p => p.id === player.id) + 1} of {PLAYERS.length}
        </span>
        <button className="close-btn"><Icon name="chevronLeft" size={13} /></button>
        <button className="close-btn"><Icon name="chevronRight" size={13} /></button>
      </div>

      {/* Hero header */}
      <div className="p-header">
        <div className="avatar xl" style={{ background: avatarBg(player.name) }}>
          {initials(player.name)}
          <span className={'status-dot ' + player.status} style={{ width: 14, height: 14, borderWidth: 3 }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="hstack" style={{ gap: 10 }}>
            <div className="p-name">{player.name}</div>
            <Tier tier={player.tier} />
            {player.flags.includes('bonus-abuse-review') && (
              <span className="pill pill-warn"><Icon name="flag" size={11} />Risk review</span>
            )}
            {player.kyc === 'verified' ? (
              <span className="pill pill-success"><Icon name="shield" size={11} />KYC verified</span>
            ) : (
              <span className="pill pill-warn">KYC pending</span>
            )}
          </div>
          <div className="p-meta">
            <div className="p-meta-item"><Icon name="user" size={12} />{player.id}</div>
            <div className="p-meta-item">
              <Icon name="globe" size={12} />{player.country.flag} {player.country.name} · {player.timezone}
            </div>
            <div className="p-meta-item"><Icon name="mail" size={12} />{player.email}</div>
            <div className="p-meta-item"><Icon name="phone" size={12} />{player.phone}</div>
            <div className="p-meta-item"><Icon name="headphones" size={12} />Host: {player.host}</div>
          </div>
          <div style={{ marginTop: 10, maxWidth: 420 }}>
            <div className="hstack" style={{ justifyContent: 'space-between', fontSize: 11.5 }}>
              <span className="dim">{nextTier ? `${tierProgress}% to ${nextTier.label}` : 'Max tier reached'}</span>
              <span className="num dim">
                {fmtMoney(player.lifetimeDeposits)} / {nextTier ? fmtMoney(nextMin) : '—'}
              </span>
            </div>
            <div className="tier-strip">
              {TIERS.map((t, i) => {
                const filled = i < tierIdx;
                const isCur = i === tierIdx;
                return (
                  <div
                    key={t.id}
                    className={'tier-strip-cell ' + (filled ? 'filled' : isCur ? 'current' : '')}
                    style={{ '--p': tierProgress + '%' }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="vstack gap-4" style={{ alignItems: 'flex-end' }}>
          <div className="hstack gap-4">
            <button className="btn" onClick={() => openModal({ type: 'message', player })}>
              <Icon name="message" size={13} />Message
            </button>
            <button className="btn" onClick={() => openModal({ type: 'call', player })}>
              <Icon name="phone" size={13} />Call
            </button>
            <button className="btn btn-primary" onClick={() => openModal({ type: 'bonus', player })}>
              <Icon name="gift" size={13} />Issue bonus
            </button>
            <button className="btn"><Icon name="moreH" size={14} /></button>
          </div>
          <div className="hstack gap-4" style={{ fontSize: 11.5, color: 'var(--text-low)' }}>
            <span>VIP since {new Date(player.vipSince).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
            <span>·</span>
            <span>Last active {fmtTime(player.lastActive)}</span>
          </div>
        </div>
      </div>

      {/* Top stat strip */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="kpi">
          <div className="kpi-label">Lifetime deposits</div>
          <div className="kpi-value">{fmtMoney(player.lifetimeDeposits)}</div>
          <div className="kpi-delta up"><Icon name="arrowUp" size={10} />€38,500 · 30d</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">NGR · 30d</div>
          <div className="kpi-value" style={{ color: player.ngr30 >= 0 ? 'var(--text)' : 'var(--danger)' }}>
            {player.ngr30 >= 0 ? '+' : ''}{fmtMoney(player.ngr30)}
          </div>
          <div className="kpi-delta up"><Icon name="arrowUp" size={10} />+18.2% vs prev</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Balance</div>
          <div className="kpi-value">{fmtMoney(player.balance)}</div>
          <div className="kpi-delta"><span className="dim">+ {fmtMoney(player.bonuses)} bonus</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avg bet</div>
          <div className="kpi-value">€{player.avgBet}</div>
          <div className="kpi-delta"><span className="dim">{player.sessions30} sessions · 30d</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Loyalty points</div>
          <div className="kpi-value">{player.loyaltyPoints.toLocaleString()}</div>
          <div className="kpi-delta"><span className="dim">Redeemable · €{Math.round(player.loyaltyPoints / 100)}</span></div>
        </div>
      </div>

      <div className="profile">
        {/* LEFT: identity + actions + notes */}
        <div className="vstack gap-6">
          <div className="p-card">
            <div className="p-card-header"><div className="p-card-title">Quick actions</div></div>
            <div className="action-grid">
              {actions.map(a => (
                <button key={a.id} className="action-btn" onClick={() => openModal({ type: a.id, player })}>
                  <div className={'ic ' + (a.tone || '')}><Icon name={a.icon} size={14} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div>{a.label}</div>
                    <div className="sub">{a.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-card">
            <div className="p-card-header">
              <div className="p-card-title">Account</div>
              <button className="btn btn-ghost btn-sm"><Icon name="copy" size={11} />Copy all</button>
            </div>
            <div className="p-card-body">
              <dl className="kv">
                <dt>Player ID</dt><dd className="num">{player.id}</dd>
                <dt>Email</dt><dd>{player.email}</dd>
                <dt>Phone</dt><dd className="num">{player.phone}</dd>
                <dt>Country</dt><dd>{player.country.flag} {player.country.name}</dd>
                <dt>Language</dt><dd>{player.language}</dd>
                <dt>Timezone</dt><dd>{player.timezone}</dd>
                <dt>Date of birth</dt><dd className="num">{player.dob}</dd>
                <dt>VIP since</dt>
                <dd>{new Date(player.vipSince).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</dd>
                <dt>Joined</dt>
                <dd>{new Date(player.joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</dd>
                <dt>Deposit limit</dt>
                <dd>{player.depositLimit ? fmtMoney(player.depositLimit) + ' / day' : <span className="dim">None</span>}</dd>
                <dt>Loss limit</dt>
                <dd>{player.lossLimit ? fmtMoney(player.lossLimit) + ' / week' : <span className="dim">None</span>}</dd>
              </dl>
            </div>
          </div>

          <div className="p-card">
            <div className="p-card-header">
              <div className="p-card-title">Internal notes</div>
              <button className="btn btn-ghost btn-sm"><Icon name="plus" size={11} />Tag</button>
            </div>
            <div className="p-card-body tight">
              <textarea
                className="textarea"
                placeholder="Write a note visible only to hosts…"
                rows="2"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                style={{ minHeight: 60 }}
              />
              <div className="hstack" style={{ justifyContent: 'flex-end', marginTop: 6, marginBottom: 10 }}>
                <button className="btn btn-sm btn-primary" onClick={addNote}>Post note</button>
              </div>
              {notes
                .slice()
                .sort((a, b) => (b.pinned - a.pinned) || (b.at - a.at))
                .map(n => (
                  <div key={n.id} className={'note' + (n.pinned ? ' note-pinned' : '')}>
                    <div className="note-meta">
                      {n.pinned && <Icon name="pin" size={10} style={{ color: 'var(--gold)' }} />}
                      <strong style={{ color: 'var(--text-mid)', fontWeight: 500 }}>{n.author}</strong>
                      <span>·</span>
                      <span>{fmtTime(n.at)}</span>
                      <button
                        className="close-btn"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => togglePin(n.id)}
                        title={n.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Icon name="pin" size={11} />
                      </button>
                    </div>
                    <div className="note-body">{n.text}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT: tabs with detail */}
        <div className="p-card">
          <div className="tabs">
            <button className={'tab ' + (tab === 'overview' ? 'active' : '')} onClick={() => setTab('overview')}>Overview</button>
            <button className={'tab ' + (tab === 'activity' ? 'active' : '')} onClick={() => setTab('activity')}>
              Activity<span className="tab-count">{timeline.length}</span>
            </button>
            <button className={'tab ' + (tab === 'transactions' ? 'active' : '')} onClick={() => setTab('transactions')}>
              Transactions
            </button>
            <button className={'tab ' + (tab === 'bonuses' ? 'active' : '')} onClick={() => setTab('bonuses')}>
              Bonuses<span className="tab-count">4</span>
            </button>
            <button className={'tab ' + (tab === 'games' ? 'active' : '')} onClick={() => setTab('games')}>Games</button>
            <button className={'tab ' + (tab === 'comms' ? 'active' : '')} onClick={() => setTab('comms')}>
              Comms<span className="tab-count">12</span>
            </button>
          </div>

          {tab === 'overview' && (
            <div>
              <div className="p-card-header" style={{ borderTop: 'none' }}>
                <div>
                  <div className="p-card-title">Deposits · last 12 months</div>
                  <div style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 2 }}>Monthly deposit totals (thousands €)</div>
                </div>
                <div className="segmented">
                  <button className="active">12M</button>
                  <button>6M</button>
                  <button>30d</button>
                </div>
              </div>
              <div style={{ padding: '4px 16px 18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, alignItems: 'end', height: 140 }}>
                  {depsBars.map(([m, v], i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${(v / depsMax) * 120}px`,
                          background:
                            i === depsBars.length - 1
                              ? 'linear-gradient(180deg, var(--gold), #C89535)'
                              : 'linear-gradient(180deg, #3A3A44, #2A2A33)',
                          borderRadius: '3px 3px 0 0',
                          position: 'relative',
                        }}
                      >
                        {i === depsBars.length - 1 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: -22,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: 10.5,
                              fontFamily: 'var(--mono)',
                              color: 'var(--gold)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            €{v}K
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-low)' }}>{m}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stat-grid" style={{ borderTop: '1px solid var(--border)' }}>
                <div>
                  <div className="stat-label">Wagered · 30d</div>
                  <div className="stat-val">{fmtMoney(player.wagered30)}</div>
                  <div className="dim" style={{ fontSize: 11 }}>Hold rate 6.0%</div>
                </div>
                <div>
                  <div className="stat-label">Lifetime withdrawals</div>
                  <div className="stat-val">{fmtMoney(player.lifetimeWithdrawals)}</div>
                  <div className="dim" style={{ fontSize: 11 }}>
                    Net: +{fmtMoney(player.lifetimeDeposits - player.lifetimeWithdrawals)}
                  </div>
                </div>
                <div>
                  <div className="stat-label">Avg session</div>
                  <div className="stat-val">1h 48m</div>
                  <div className="dim" style={{ fontSize: 11 }}>Peak: Thu 20–23 CET</div>
                </div>
              </div>

              <div className="p-card-header" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="p-card-title">Favorite games</div>
                <span className="dim" style={{ fontSize: 11 }}>by wager · last 30 days</span>
              </div>
              <div className="p-card-body">
                <div className="bar-list">
                  {[
                    { g: 'Lightning Roulette', pct: 42, amt: 173240 },
                    { g: 'Crazy Time', pct: 28, amt: 115360 },
                    { g: 'Blackjack VIP', pct: 16, amt: 65920 },
                    { g: 'Gates of Olympus', pct: 9, amt: 37080 },
                    { g: 'Baccarat Squeeze', pct: 5, amt: 20600 },
                  ].map((r, i) => (
                    <div key={i} className="bar-row">
                      <span>{r.g}</span>
                      <div className="bar-track"><div className="bar-fill" style={{ width: r.pct + '%' }} /></div>
                      <span className="bar-val">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="timeline" style={{ padding: '6px 0 16px' }}>
              {timeline.map((e, i) => (
                <div key={i} className="tl-item">
                  <div className={'tl-ic ' + e.tone}><Icon name={e.icon} size={13} /></div>
                  <div>
                    <div className="tl-title">{e.title}</div>
                    <div className="tl-desc">{e.desc}</div>
                  </div>
                  <div className="tl-time">{fmtTime(e.at)}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'transactions' && (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Type</th><th>Method</th><th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Status</th><th>When</th><th />
                </tr>
              </thead>
              <tbody>
                {[
                  ['Deposit', 'Visa •4421', 5000, 'completed', 2 * 3600_000],
                  ['Withdrawal', 'SEPA', -12000, 'completed', 6 * 86400_000],
                  ['Deposit', 'Skrill', 2500, 'completed', 4 * 86400_000],
                  ['Withdrawal', 'Bank transfer', -8000, 'pending', 1 * 86400_000],
                  ['Deposit', 'Visa •4421', 10000, 'completed', 11 * 86400_000],
                  ['Bonus', 'Weekly loyalty', 500, 'completed', 4 * 86400_000],
                  ['Deposit', 'Apple Pay', 1500, 'completed', 13 * 86400_000],
                  ['Withdrawal', 'SEPA', -15000, 'review', 18 * 86400_000],
                ].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td>
                    <td className="dim">{r[1]}</td>
                    <td className="num" style={{ textAlign: 'right', color: r[2] > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {r[2] > 0 ? '+' : ''}{fmtMoney(r[2])}
                    </td>
                    <td>
                      <span className={'pill ' + (r[3] === 'completed' ? 'pill-success' : r[3] === 'pending' ? 'pill-warn' : 'pill-info')}>
                        {r[3]}
                      </span>
                    </td>
                    <td className="dim">{fmtTime(Date.now() - r[4])}</td>
                    <td><button className="btn btn-ghost btn-sm">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'bonuses' && (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Bonus</th><th>Type</th><th style={{ textAlign: 'right' }}>Value</th>
                  <th>Wagering</th><th>Status</th><th>Issued</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Weekly loyalty', 'Cash', 500, '12× · 78%', 'active', 4 * 86400_000],
                  ['Birthday gift', 'Free spins', '200 FS', 'no wager', 'active', 2 * 86400_000],
                  ['Platinum welcome', 'Cash', 2500, '8× · complete', 'completed', 48 * 86400_000],
                  ['Reload March', 'Cashback', 850, 'no wager', 'completed', 62 * 86400_000],
                ].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td>
                    <td className="dim">{r[1]}</td>
                    <td className="num" style={{ textAlign: 'right' }}>
                      {typeof r[2] === 'number' ? fmtMoney(r[2]) : r[2]}
                    </td>
                    <td className="dim">{r[3]}</td>
                    <td><span className={'pill ' + (r[4] === 'active' ? 'pill-success' : 'pill-neutral')}>{r[4]}</span></td>
                    <td className="dim">{fmtTime(Date.now() - r[5])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'games' && (
            <div className="p-card-body">
              <div className="bar-list">
                {[
                  { g: 'Lightning Roulette', cat: 'Live · Evolution', pct: 42, amt: 173240, sessions: 78 },
                  { g: 'Crazy Time', cat: 'Live · Evolution', pct: 28, amt: 115360, sessions: 42 },
                  { g: 'Blackjack VIP', cat: 'Live · Evolution', pct: 16, amt: 65920, sessions: 31 },
                  { g: 'Gates of Olympus', cat: 'Slot · Pragmatic', pct: 9, amt: 37080, sessions: 22 },
                  { g: 'Baccarat Squeeze', cat: 'Live · Evolution', pct: 5, amt: 20600, sessions: 14 },
                ].map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '200px 1fr 120px 80px',
                      gap: 14,
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.g}</div>
                      <div className="dim" style={{ fontSize: 11 }}>{r.cat}</div>
                    </div>
                    <div className="bar-track"><div className="bar-fill" style={{ width: r.pct + '%' }} /></div>
                    <div className="num" style={{ textAlign: 'right' }}>{fmtMoney(r.amt)}</div>
                    <div className="dim num" style={{ textAlign: 'right', fontSize: 11 }}>{r.sessions} sess.</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'comms' && (
            <div className="timeline" style={{ padding: '6px 0 16px' }}>
              {[
                { ic: 'mail', tone: 'info', t: 'Email: Re: Monaco event', d: 'From Niko · host: Elena Vasquez', at: 2 * 3600_000 },
                { ic: 'phone', tone: 'info', t: 'Call · 18 min', d: 'Outbound by Elena V. — event logistics', at: 5 * 86400_000 },
                { ic: 'message', tone: '', t: 'SMS: Weekend schedule', d: 'Delivered · read', at: 6 * 86400_000 },
                { ic: 'mail', tone: 'info', t: 'Email: Platinum welcome', d: 'Template + custom note', at: 48 * 86400_000 },
                { ic: 'phone', tone: 'info', t: 'Missed call · inbound', d: 'Voicemail transcribed', at: 55 * 86400_000 },
              ].map((e, i) => (
                <div key={i} className="tl-item">
                  <div className={'tl-ic ' + e.tone}><Icon name={e.ic} size={13} /></div>
                  <div>
                    <div className="tl-title">{e.t}</div>
                    <div className="tl-desc">{e.d}</div>
                  </div>
                  <div className="tl-time">{fmtTime(Date.now() - e.at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
