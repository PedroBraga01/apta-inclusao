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
  comfortableReading,
  setComfortableReading,
  onRead,
}: {
  fontScale: number;
  setFontScale: (value: number) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  comfortableReading: boolean;
  setComfortableReading: (value: boolean) => void;
  onRead: () => void;
}) {
  return (
    <div
      className="accessibility-bar"
      role="region"
      aria-label="Ferramentas de acessibilidade"
    >
      <p>
        <b>Acessibilidade</b>
        <span>Tamanho do texto: {fontScale}%</span>
      </p>
      <div className="accessibility-actions">
        <button
          type="button"
          disabled={fontScale === 100}
          onClick={() => setFontScale(Math.max(100, fontScale - 25))}
          aria-label="Reduzir tamanho do texto"
        >
          A− <span>Reduzir</span>
        </button>
        <button
          type="button"
          disabled={fontScale === 200}
          onClick={() => setFontScale(Math.min(200, fontScale + 25))}
          aria-label="Ampliar tamanho do texto"
        >
          A+ <span>Ampliar</span>
        </button>
        <button
          type="button"
          aria-pressed={comfortableReading}
          onClick={() => setComfortableReading(!comfortableReading)}
        >
          <span aria-hidden="true">↕</span> Mais espaço
        </button>
        <button
          type="button"
          aria-pressed={highContrast}
          onClick={() => setHighContrast(!highContrast)}
        >
          <span className="contrast-dot" aria-hidden="true" /> Contraste
        </button>
        <button type="button" onClick={onRead}>
          <span aria-hidden="true">◖</span> Ouvir
        </button>
      </div>
    </div>
  );
}
