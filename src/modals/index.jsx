import { useState } from 'react';
import Icon from '../components/Icon';
import { Modal, Tier } from '../components/Shell';
import { GAMES, TIERS, HOSTS, fmtMoney } from '../data';

function BonusModal({ player, onClose, onSubmit }) {
  const [type, setType] = useState('cash');
  const [amount, setAmount] = useState(500);
  const [spins, setSpins] = useState(100);
  const [game, setGame] = useState('Gates of Olympus');
  const [wager, setWager] = useState(10);
  const [note, setNote] = useState('');
  const [expiry, setExpiry] = useState(7);

  return (
    <Modal
      title="Issue bonus"
      sub={`To ${player.name} · ${player.tier.toUpperCase()}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSubmit({ type, amount, spins, game, wager, note, expiry }); onClose(); }}>
            <Icon name="gift" size={12} />Issue bonus
          </button>
        </>
      }
    >
      <div className="field">
        <div className="field-label">Bonus type</div>
        <div className="segmented" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[['cash', 'Cash'], ['spins', 'Free spins'], ['cashback', 'Cashback'], ['custom', 'Custom']].map(([k, l]) => (
            <button key={k} className={type === k ? 'active' : ''} onClick={() => setType(k)}>{l}</button>
          ))}
        </div>
      </div>
      {(type === 'cash' || type === 'cashback') && (
        <div className="row-fields">
          <div className="field">
            <div className="field-label">Amount (€)</div>
            <input className="input num" type="number" value={amount} onChange={e => setAmount(+e.target.value)} />
            <div className="field-hint">
              Quick:{' '}
              {[250, 500, 1000, 2500].map(v => (
                <button
                  key={v}
                  className="btn btn-sm btn-ghost"
                  style={{ padding: '2px 6px', fontSize: 11 }}
                  onClick={() => setAmount(v)}
                >
                  €{v}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <div className="field-label">Wagering multiplier</div>
            <input className="input num" type="number" value={wager} onChange={e => setWager(+e.target.value)} />
            <div className="field-hint">Standard for {player.tier}: 10×</div>
          </div>
        </div>
      )}
      {type === 'spins' && (
        <div className="row-fields">
          <div className="field">
            <div className="field-label">Number of spins</div>
            <input className="input num" type="number" value={spins} onChange={e => setSpins(+e.target.value)} />
          </div>
          <div className="field">
            <div className="field-label">On game</div>
            <select className="select" value={game} onChange={e => setGame(e.target.value)}>
              {GAMES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
      )}
      <div className="field">
        <div className="field-label">Expires in (days)</div>
        <input className="input num" type="number" value={expiry} onChange={e => setExpiry(+e.target.value)} />
      </div>
      <div className="field">
        <div className="field-label">Note to player (optional)</div>
        <textarea
          className="textarea"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Goes into bonus description on their side…"
        />
      </div>
      <div
        style={{
          padding: '10px 12px',
          background: 'var(--gold-bg)',
          border: '1px solid var(--gold-border)',
          borderRadius: 6,
          fontSize: 12,
          color: 'var(--text)',
        }}
      >
        <strong style={{ color: 'var(--gold)' }}>Summary:</strong>{' '}
        {type === 'spins' ? `${spins} free spins on ${game}` : `${fmtMoney(amount)} ${type} bonus`} ·{' '}
        {type === 'spins' ? 'no wagering' : `${wager}× wagering`} · {expiry}-day expiry
      </div>
    </Modal>
  );
}

function MessageModal({ player, onClose, onSubmit }) {
  const [channel, setChannel] = useState('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [template, setTemplate] = useState('');
  const first = player.name.split(' ')[0];
  const templates = {
    birthday: {
      subject: `Happy birthday, ${first}!`,
      body: `Hi ${first},\n\nWishing you a wonderful birthday from all of us here. To celebrate, we've loaded 200 free spins to your account.\n\nEnjoy — on us.\nElena`,
    },
    winback: {
      subject: `We miss you, ${first}`,
      body: `Hi ${first},\n\nHaven't seen you around lately. I've arranged something special for when you're ready to come back — let me know and I'll set it up personally.\n\nElena`,
    },
    event: {
      subject: `An invitation — Monaco VIP weekend`,
      body: `Hi ${first},\n\nWe're hosting our annual Monaco VIP weekend May 16–18 and I'd love to see you there. Flights, suite, and all the trimmings on us.\n\nLet me know — I'll send the full itinerary.\n\nElena`,
    },
  };
  const applyTemplate = (k) => {
    setTemplate(k);
    if (templates[k]) {
      setSubject(templates[k].subject);
      setBody(templates[k].body);
    }
  };

  return (
    <Modal
      wide
      title="Send message"
      sub={`To ${player.name}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn"><Icon name="clock" size={12} />Schedule</button>
          <button className="btn btn-primary" onClick={() => { onSubmit({ channel, subject, body }); onClose(); }}>
            <Icon name="send" size={12} />Send now
          </button>
        </>
      }
    >
      <div className="field">
        <div className="field-label">Channel</div>
        <div className="segmented" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%' }}>
          {[['email', 'Email'], ['sms', 'SMS'], ['chat', 'In-app']].map(([k, l]) => (
            <button key={k} className={channel === k ? 'active' : ''} onClick={() => setChannel(k)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="field">
        <div className="field-label">Template</div>
        <div className="hstack gap-3">
          {[['birthday', '🎂 Birthday'], ['winback', '💛 Win-back'], ['event', '✈️ Event invite']].map(([k, l]) => (
            <button key={k} className={'chip ' + (template === k ? 'active' : '')} onClick={() => applyTemplate(k)}>{l}</button>
          ))}
          <button className="chip chip-add"><Icon name="plus" size={10} />New</button>
        </div>
      </div>
      {channel === 'email' && (
        <div className="field">
          <div className="field-label">Subject</div>
          <input className="input" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
      )}
      <div className="field">
        <div className="field-label">Message</div>
        <textarea
          className="textarea"
          style={{ minHeight: 160 }}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Personal message from the host…"
        />
        <div className="field-hint">Sending as Elena Vasquez · visible to audit log</div>
      </div>
    </Modal>
  );
}

function TierModal({ player, onClose, onSubmit }) {
  const [newTier, setNewTier] = useState(player.tier);
  const [reason, setReason] = useState('');
  return (
    <Modal
      title="Adjust VIP tier"
      sub={`${player.name} · currently ${player.tier.toUpperCase()}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSubmit({ newTier, reason }); onClose(); }}>
            <Icon name="trophy" size={12} />Apply change
          </button>
        </>
      }
    >
      <div className="field">
        <div className="field-label">Select tier</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {TIERS.map(t => (
            <button
              key={t.id}
              onClick={() => setNewTier(t.id)}
              style={{
                padding: 14,
                textAlign: 'left',
                borderRadius: 8,
                cursor: 'pointer',
                background: newTier === t.id ? 'var(--gold-bg)' : 'var(--bg)',
                border: '1px solid ' + (newTier === t.id ? 'var(--gold-border)' : 'var(--border)'),
                color: 'var(--text)',
              }}
            >
              <Tier tier={t.id} />
              <div className="num" style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 6 }}>
                ≥ {fmtMoney(t.min)}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <div className="field-label">Reason (for audit log)</div>
        <textarea
          className="textarea"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Why are you overriding the automatic tier?"
        />
      </div>
      {newTier !== player.tier && (
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--warn)18',
            border: '1px solid var(--warn)40',
            borderRadius: 6,
            fontSize: 12,
          }}
        >
          <strong style={{ color: 'var(--warn)' }}>Heads up:</strong> this is a manual override and will not auto-recompute.
          Player will be notified by email.
        </div>
      )}
    </Modal>
  );
}

function CallModal({ player, onClose, onSubmit }) {
  const [when, setWhen] = useState('today-18');
  const [purpose, setPurpose] = useState('check-in');
  const [notes, setNotes] = useState('');
  return (
    <Modal
      title="Schedule call"
      sub={`With ${player.name} · ${player.phone}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSubmit({ when, purpose, notes }); onClose(); }}>
            <Icon name="calendar" size={12} />Add to calendar
          </button>
        </>
      }
    >
      <div className="field">
        <div className="field-label">When</div>
        <div className="vstack gap-3">
          {[
            ['today-18', 'Today, 18:00 CET'],
            ['tomorrow-10', 'Tomorrow, 10:00 CET'],
            ['thu-20', 'Thursday, 20:00 CET'],
            ['custom', 'Custom…'],
          ].map(([k, l]) => (
            <label
              key={k}
              className="hstack gap-4"
              style={{
                padding: '8px 10px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                cursor: 'pointer',
                background: when === k ? 'var(--gold-bg)' : 'var(--bg)',
              }}
            >
              <input
                type="radio"
                checked={when === k}
                onChange={() => setWhen(k)}
                style={{ accentColor: '#F2B544' }}
              />
              <span style={{ fontSize: 13 }}>{l}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="field">
        <div className="field-label">Purpose</div>
        <select className="select" value={purpose} onChange={e => setPurpose(e.target.value)}>
          <option value="check-in">Routine check-in</option>
          <option value="event">Event invitation</option>
          <option value="winback">Re-engagement</option>
          <option value="issue">Issue resolution</option>
        </select>
      </div>
      <div className="field">
        <div className="field-label">Prep notes</div>
        <textarea
          className="textarea"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Talking points, context…"
        />
      </div>
    </Modal>
  );
}

function WithdrawalModal({ player, onClose }) {
  return (
    <Modal
      title="Review withdrawal"
      sub={`${player.name} · €12,000 SEPA`}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-danger"><Icon name="x" size={12} />Deny</button>
          <button className="btn"><Icon name="clock" size={12} />Escalate</button>
          <button className="btn btn-primary" onClick={onClose}><Icon name="check" size={12} />Approve</button>
        </>
      }
    >
      <div
        className="stat-grid"
        style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 14 }}
      >
        <div><div className="stat-label">Amount</div><div className="stat-val num">€12,000</div></div>
        <div><div className="stat-label">Method</div><div className="stat-val" style={{ fontSize: 14 }}>SEPA · DE**1294</div></div>
        <div><div className="stat-label">Balance after</div><div className="stat-val num">€6,420</div></div>
      </div>
      <dl className="kv" style={{ marginBottom: 12 }}>
        <dt>Requested</dt><dd>22 hours ago</dd>
        <dt>KYC</dt><dd><span className="pill pill-success"><Icon name="check" size={10} />Verified</span></dd>
        <dt>Risk score</dt><dd><span className="pill pill-success">Low · 12/100</span></dd>
        <dt>Source of funds</dt><dd>Card deposits · verified</dd>
        <dt>Pattern match</dt><dd className="dim">Consistent with 30-day history</dd>
        <dt>Prior withdrawals</dt><dd>8 completed · 0 denied</dd>
      </dl>
      <div className="note">
        <div className="note-meta">
          <Icon name="shield" size={10} />
          <strong style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Risk engine</strong>
        </div>
        <div className="note-body" style={{ fontSize: 12.5 }}>
          All checks passed. Amount is within the player's 90-day moving average. No bonus funds in play.
        </div>
      </div>
    </Modal>
  );
}

function LimitsModal({ player, onClose, onSubmit }) {
  const [deposit, setDeposit] = useState(player.depositLimit || '');
  const [loss, setLoss] = useState(player.lossLimit || '');
  const [session, setSession] = useState(180);
  return (
    <Modal
      title="Set player limits"
      sub={player.name}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSubmit({ deposit, loss, session }); onClose(); }}>
            Apply limits
          </button>
        </>
      }
    >
      <div className="field">
        <div className="field-label">Daily deposit limit (€)</div>
        <input className="input num" type="number" value={deposit} onChange={e => setDeposit(+e.target.value)} placeholder="No limit" />
      </div>
      <div className="field">
        <div className="field-label">Weekly loss limit (€)</div>
        <input className="input num" type="number" value={loss} onChange={e => setLoss(+e.target.value)} placeholder="No limit" />
      </div>
      <div className="field">
        <div className="field-label">Session time cap (min)</div>
        <input className="input num" type="number" value={session} onChange={e => setSession(+e.target.value)} />
      </div>
      <div className="field-hint">
        Limit changes can only be tightened for 72 hours after being raised. Player is notified automatically.
      </div>
    </Modal>
  );
}

function HostModal({ player, onClose, onSubmit }) {
  const [host, setHost] = useState(player.host);
  return (
    <Modal
      title="Assign VIP host"
      sub={player.name}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSubmit({ host }); onClose(); }}>Reassign</button>
        </>
      }
    >
      <div className="vstack gap-3">
        {HOSTS.map(h => {
          const load = {
            'Elena Vasquez': 42,
            'Marcus Chen': 38,
            'Priya Shah': 51,
            'Kenji Tanaka': 29,
            'Sofia Rossi': 44,
            "Liam O'Brien": 36,
          }[h] || 30;
          return (
            <label
              key={h}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 10,
                alignItems: 'center',
                padding: 10,
                border: '1px solid var(--border)',
                borderRadius: 6,
                cursor: 'pointer',
                background: host === h ? 'var(--gold-bg)' : 'var(--bg)',
              }}
            >
              <input
                type="radio"
                checked={host === h}
                onChange={() => setHost(h)}
                style={{ accentColor: '#F2B544' }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{h}</div>
                <div className="dim" style={{ fontSize: 11 }}>{load} active VIPs · EN/DE</div>
              </div>
              <div className="progress" style={{ width: 80 }}>
                <div className="progress-fill" style={{ width: (load / 60) * 100 + '%' }} />
              </div>
            </label>
          );
        })}
      </div>
    </Modal>
  );
}

function FreezeModal({ player, onClose, onSubmit }) {
  const [action, setAction] = useState('flag');
  const [reason, setReason] = useState('');
  return (
    <Modal
      title="Flag or freeze account"
      sub={player.name}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { onSubmit({ action, reason }); onClose(); }}>Confirm</button>
        </>
      }
    >
      <div className="vstack gap-3" style={{ marginBottom: 14 }}>
        {[
          ['flag', 'Flag for risk review', 'Player can continue. Risk team is notified.'],
          ['freeze', 'Freeze deposits', 'Prevents new deposits. Withdrawals allowed.'],
          ['suspend', 'Suspend account', 'Full suspension until reviewed.'],
        ].map(([k, l, d]) => (
          <label
            key={k}
            className="hstack gap-4"
            style={{
              padding: 12,
              border: '1px solid var(--border)',
              borderRadius: 6,
              cursor: 'pointer',
              background: action === k ? 'var(--danger-bg)' : 'var(--bg)',
              alignItems: 'flex-start',
            }}
          >
            <input
              type="radio"
              checked={action === k}
              onChange={() => setAction(k)}
              style={{ accentColor: '#E5635C', marginTop: 2 }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{l}</div>
              <div className="dim" style={{ fontSize: 12, marginTop: 2 }}>{d}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="field">
        <div className="field-label">Reason</div>
        <textarea
          className="textarea"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Required for audit log"
        />
      </div>
    </Modal>
  );
}

function CashbackModal({ player, onClose, onSubmit }) {
  const [pct, setPct] = useState(10);
  const [period, setPeriod] = useState('weekly');
  const projected = Math.round((Math.max(0, -player.ngr30) * pct) / 100);
  return (
    <Modal
      title="Add deposit cashback"
      sub={player.name}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSubmit({ pct, period }); onClose(); }}>
            Activate cashback
          </button>
        </>
      }
    >
      <div className="row-fields">
        <div className="field">
          <div className="field-label">Cashback %</div>
          <input className="input num" type="number" value={pct} onChange={e => setPct(+e.target.value)} />
        </div>
        <div className="field">
          <div className="field-label">Period</div>
          <select className="select" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div
        style={{
          padding: '10px 12px',
          background: 'var(--gold-bg)',
          border: '1px solid var(--gold-border)',
          borderRadius: 6,
          fontSize: 12.5,
        }}
      >
        <strong style={{ color: 'var(--gold)' }}>Projected:</strong> Based on last {period === 'weekly' ? '7' : '30'} days,
        next payout would be ~<span className="num">{fmtMoney(projected || 420)}</span>
      </div>
    </Modal>
  );
}

export function renderModal(modal, close, dispatch) {
  if (!modal) return null;
  const p = modal.player;
  const sub = (data) => dispatch({ type: modal.type, player: p, data });
  const M = {
    bonus: <BonusModal player={p} onClose={close} onSubmit={sub} />,
    message: <MessageModal player={p} onClose={close} onSubmit={sub} />,
    tier: <TierModal player={p} onClose={close} onSubmit={sub} />,
    call: <CallModal player={p} onClose={close} onSubmit={sub} />,
    withdrawal: <WithdrawalModal player={p} onClose={close} />,
    limits: <LimitsModal player={p} onClose={close} onSubmit={sub} />,
    host: <HostModal player={p} onClose={close} onSubmit={sub} />,
    freeze: <FreezeModal player={p} onClose={close} onSubmit={sub} />,
    cashback: <CashbackModal player={p} onClose={close} onSubmit={sub} />,
  };
  return M[modal.type] || null;
}
