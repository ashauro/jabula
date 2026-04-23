export default function TweaksPanel({ visible, density, setDensity, theme, setTheme }) {
  if (!visible) return null;
  return (
    <div className="tweak-panel">
      <div className="tweak-title">Tweaks</div>
      <div className="field" style={{ margin: 0 }}>
        <div className="field-label">Density</div>
        <div className="segmented" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%' }}>
          {['dense', 'balanced', 'airy'].map(d => (
            <button key={d} className={density === d ? 'active' : ''} onClick={() => setDensity(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="field" style={{ margin: '10px 0 0' }}>
        <div className="field-label">Theme</div>
        <div className="segmented" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%' }}>
          {['dark', 'light'].map(t => (
            <button key={t} className={theme === t ? 'active' : ''} onClick={() => setTheme(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
