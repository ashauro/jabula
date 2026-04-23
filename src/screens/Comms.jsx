import { useState } from 'react';
import Icon from '../components/Icon';
import { Tier } from '../components/Shell';
import { THREADS, avatarBg, initials, fmtTime, fmtDateTime } from '../data';

const channelIcon = (c) => (c === 'email' ? 'mail' : c === 'sms' ? 'message' : 'chat');

export default function Comms({ setPage }) {
  const [threads, setThreads] = useState(THREADS);
  const [activeId, setActiveId] = useState(THREADS[0].id);
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState('');

  const active = threads.find(t => t.id === activeId);
  const visible = threads.filter(
    t => filter === 'all' || (filter === 'unread' && t.unread) || t.channel === filter
  );

  const send = () => {
    if (!draft.trim()) return;
    setThreads(ts =>
      ts.map(t =>
        t.id === activeId
          ? {
              ...t,
              messages: [...t.messages, { from: 'host', who: 'Elena Vasquez', at: Date.now(), text: draft }],
              preview: draft.slice(0, 80),
              when: Date.now(),
              unread: false,
            }
          : t
      )
    );
    setDraft('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inbox</h1>
          <div className="page-sub">VIP conversations across email, SMS, and in-app chat</div>
        </div>
        <div className="hstack gap-4">
          <button className="btn"><Icon name="calendar" size={13} />Schedule</button>
          <button className="btn btn-primary"><Icon name="send" size={13} />New message</button>
        </div>
      </div>

      <div className="toolbar">
        {[['all', 'All'], ['unread', 'Unread'], ['email', 'Email'], ['sms', 'SMS'], ['chat', 'In-app']].map(([k, l]) => (
          <button key={k} className={'chip ' + (filter === k ? 'active' : '')} onClick={() => setFilter(k)}>
            {l}
          </button>
        ))}
      </div>

      <div className="inbox">
        <div className="inbox-list">
          {visible.map(t => (
            <div
              key={t.id}
              className={'inbox-item ' + (t.id === activeId ? 'active ' : '') + (t.unread ? 'unread' : '')}
              onClick={() => setActiveId(t.id)}
            >
              <div className="avatar" style={{ background: avatarBg(t.with.name) }}>
                {initials(t.with.name)}
                <span className={'status-dot ' + t.with.status} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="inbox-who">
                  <span className="hstack gap-3">
                    <Icon name={channelIcon(t.channel)} size={11} style={{ color: 'var(--text-low)' }} />
                    {t.with.name}
                  </span>
                  <span className="inbox-time">{fmtTime(t.when)}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 2, fontWeight: t.unread ? 500 : 400 }}>
                  {t.subject}
                </div>
                <div className="inbox-preview">{t.preview}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="inbox-main">
          {active && (
            <>
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div className="hstack gap-4">
                  <div className="avatar" style={{ background: avatarBg(active.with.name) }}>
                    {initials(active.with.name)}
                    <span className={'status-dot ' + active.with.status} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{active.with.name}</div>
                    <div className="hstack gap-3" style={{ fontSize: 12, color: 'var(--text-low)' }}>
                      <Tier tier={active.with.tier} />
                      <span>{active.subject}</span>
                    </div>
                  </div>
                </div>
                <div className="hstack gap-3">
                  <button className="btn btn-sm" onClick={() => setPage({ kind: 'profile', id: active.with.id })}>
                    <Icon name="external" size={11} />Open profile
                  </button>
                  <button className="btn btn-sm"><Icon name="phone" size={11} />Call</button>
                  <button className="close-btn"><Icon name="moreH" size={14} /></button>
                </div>
              </div>
              <div className="inbox-thread">
                {active.messages.length === 0 && <div className="empty">No messages in this thread yet.</div>}
                {active.messages.map((m, i) => (
                  <div key={i} className={'msg ' + (m.from === 'host' ? 'out' : '')}>
                    {m.from === 'player' && (
                      <div className="avatar sm" style={{ background: avatarBg(active.with.name) }}>
                        {initials(active.with.name)}
                      </div>
                    )}
                    <div>
                      <div className="msg-bubble">{m.text}</div>
                      <div className="msg-meta">{m.who} · {fmtDateTime(m.at)}</div>
                    </div>
                    {m.from === 'host' && (
                      <div className="avatar sm" style={{ background: 'linear-gradient(135deg, #F2B544, #C8722A)', color: '#0A0A0C' }}>
                        EV
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="composer">
                <textarea
                  className="composer-input"
                  placeholder={`Reply to ${active.with.firstName || active.with.name.split(' ')[0]}…`}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                />
                <div className="composer-tools">
                  <div className="segmented">
                    <button className={active.channel === 'email' ? 'active' : ''}>Email</button>
                    <button className={active.channel === 'sms' ? 'active' : ''}>SMS</button>
                    <button className={active.channel === 'chat' ? 'active' : ''}>In-app</button>
                  </div>
                  <button className="btn btn-sm btn-ghost"><Icon name="tag" size={11} />Template</button>
                  <button className="btn btn-sm btn-ghost"><Icon name="gift" size={11} />Attach bonus</button>
                  <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }} onClick={send}>
                    <Icon name="send" size={11} />Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
