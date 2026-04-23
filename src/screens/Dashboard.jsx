import Icon from '../components/Icon';
import { Tier, Spark } from '../components/Shell';
import { PLAYERS, avatarBg, initials, fmtMoney } from '../data';

export default function Dashboard({ setPage }) {
  const kpis = [
    { label: 'Active VIPs', value: '342', delta: '+18 this month', up: true, spark: [20, 22, 24, 26, 28, 30, 32, 34] },
    { label: 'NGR · this month', value: '€2.84M', delta: '+12.4%', up: true, spark: [12, 15, 14, 18, 17, 22, 26, 28] },
    { label: 'Bonuses issued', value: '€184K', delta: '−4.1% vs plan', up: false, spark: [22, 19, 20, 18, 17, 16, 17, 18] },
    { label: 'Pending withdrawals', value: '€128K', delta: '7 need review', up: false, spark: [5, 6, 8, 7, 9, 8, 10, 12] },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, Elena</h1>
          <div className="page-sub">You have 3 unread VIP messages and 2 withdrawals awaiting your review.</div>
        </div>
        <div className="hstack gap-4">
          <div className="segmented">
            <button>Today</button>
            <button className="active">This month</button>
            <button>Quarter</button>
          </div>
        </div>
      </div>

      <div className="kpi-row">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
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
            <div className="p-card-title">Your queue · 8 tasks</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('players')}>View all</button>
          </div>
          <div>
            {[
              { icon: 'wallet', tone: 'gold', title: 'Review withdrawal — Niko Ahonen', sub: '€12,000 SEPA · flagged large', due: '2h' },
              { icon: 'message', tone: 'info', title: 'Reply to Aria Blake', sub: 'Withdrawal question · unread 40m', due: 'now' },
              { icon: 'gift', tone: 'gold', title: 'Birthday bonus — Leon Fischer', sub: 'Send within 24h', due: 'today' },
              { icon: 'phone', tone: 'info', title: 'Call — Mira Lindqvist', sub: 'Scheduled 14:30 CET', due: '3h' },
              { icon: 'trophy', tone: 'gold', title: 'Approve Platinum upgrade — Oskar Müller', sub: 'Crossed €100K threshold yesterday', due: 'today' },
              { icon: 'flag', tone: 'danger', title: 'Risk review — Hana Ito', sub: 'Possible bonus abuse pattern', due: 'today' },
            ].map((t, i) => (
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
              <div className="p-card-title">Top players · this month</div>
              <button className="btn btn-ghost btn-sm">Full list</button>
            </div>
            <table className="mini-table">
              <thead><tr><th>Player</th><th style={{ textAlign: 'right' }}>NGR</th><th /></tr></thead>
              <tbody>
                {PLAYERS.slice().sort((a, b) => b.ngr30 - a.ngr30).slice(0, 6).map(p => (
                  <tr key={p.id} onClick={() => setPage({ kind: 'profile', id: p.id })} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="player-cell">
                        <div className="avatar sm" style={{ background: avatarBg(p.name) }}>{initials(p.name)}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 12.5 }}>{p.name}</div>
                          <div className="dim" style={{ fontSize: 11 }}>{p.country.flag} <Tier tier={p.tier} /></div>
                        </div>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: 'right', color: 'var(--success)' }}>+{fmtMoney(p.ngr30)}</td>
                    <td><Icon name="chevronRight" size={12} style={{ color: 'var(--text-low)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-card">
            <div className="p-card-header">
              <div className="p-card-title">At-risk alerts</div>
              <span className="pill pill-warn">12</span>
            </div>
            <div>
              {[
                { t: 'Niko Ahonen', d: 'No deposit in 9 days · -62% vs avg' },
                { t: 'Yuki Tan', d: 'Reduced bet size 85% · possible churn' },
                { t: 'Sasha Udell', d: 'Self-exclusion request pending' },
              ].map((a, i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="hstack" style={{ justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.t}</div>
                    <Icon name="slash" size={12} style={{ color: 'var(--danger)' }} />
                  </div>
                  <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>{a.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
