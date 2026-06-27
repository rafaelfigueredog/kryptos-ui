const ROWS = 6;
const COLS = 24;
const CHAR_W = 18;
const CHAR_H = 22;

// Caracteres misturados — letras, números e símbolos como na escultura
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!@#";

// Amplitude e fase da onda por coluna
const wave = (col: number, row: number) => {
  const phase = (col / COLS) * Math.PI * 2;
  const amp = 1.5;
  return Math.sin(phase + row * 0.4) * amp;
};

const getChar = (col: number, row: number) => {
  // Padrão pseudo-aleatório determinístico
  const idx = (col * 7 + row * 13 + col * row) % CHARS.length;
  return CHARS[idx];
};

const KryptosLogo = ({ width = 432, className = "" }: { width?: number; className?: string }) => {
  const scale = width / (COLS * CHAR_W);
  const height = ROWS * CHAR_H * scale + 16;

  return (
    <svg
      viewBox={`0 0 ${COLS * CHAR_W} ${ROWS * CHAR_H + 8}`}
      width={width}
      height={height}
      className={className}
      aria-label="KRYPTOS logo"
    >
      <defs>
        <linearGradient id="kg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="25%" stopColor="#caf0f8" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="80%" stopColor="#90e0ef" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {Array.from({ length: ROWS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => {
          const x = col * CHAR_W + CHAR_W / 2;
          const baseY = row * CHAR_H + CHAR_H;
          const offset = wave(col, row);
          const y = baseY + offset;
          const opacity = 0.5 + Math.abs(Math.sin((col / COLS) * Math.PI)) * 0.5;

          return (
            <text
              key={`${row}-${col}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fontFamily="'Courier New', monospace"
              fontWeight="600"
              fill="url(#kg)"
              opacity={opacity}
              letterSpacing="0"
            >
              {getChar(col, row)}
            </text>
          );
        })
      )}
    </svg>
  );
};

export default KryptosLogo;
