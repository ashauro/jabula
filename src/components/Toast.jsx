import Icon from './Icon';

export default function Toast({ message }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--surface)',
        border: '1px solid var(--gold-border)',
        padding: '10px 16px',
        borderRadius: 8,
        fontSize: 13,
        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        animation: 'popIn 0.2s ease',
      }}
    >
      <Icon name="check" size={14} style={{ color: 'var(--gold)' }} />
      {message}
    </div>
  );
}
