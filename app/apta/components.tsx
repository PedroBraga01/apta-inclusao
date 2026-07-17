export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={`brand ${inverse ? "brand--inverse" : ""}`}
      aria-label="APTA"
    >
      <span>A</span>
      <span>P</span>
      <span>T</span>
      <span>A</span>
    </span>
  );
}

export function Marker({ children }: { children: string }) {
  return (
    <span className="nav-marker" aria-hidden="true">
      {children}
    </span>
  );
}

export function AccessibilityBar({
  fontScale,
  setFontScale,
  highContrast,
  setHighContrast,
  onRead,
}: {
  fontScale: number;
  setFontScale: (value: number) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  onRead: () => void;
}) {
  return (
    <div
      className="accessibility-bar"
      role="region"
      aria-label="Ferramentas de acessibilidade"
    >
      <p>Ferramentas de acessibilidade</p>
      <div className="accessibility-actions">
        <button
          type="button"
          onClick={() => setFontScale(Math.max(100, fontScale - 10))}
          aria-label="Diminuir tamanho do texto"
        >
          A−
        </button>
        <button
          type="button"
          onClick={() => setFontScale(Math.min(130, fontScale + 10))}
          aria-label="Aumentar tamanho do texto"
        >
          A+
        </button>
        <button
          type="button"
          aria-pressed={highContrast}
          onClick={() => setHighContrast(!highContrast)}
        >
          <span className="contrast-dot" aria-hidden="true" /> Alto contraste
        </button>
        <button type="button" onClick={onRead}>
          <span aria-hidden="true">◖</span> Ouvir página
        </button>
      </div>
    </div>
  );
}
