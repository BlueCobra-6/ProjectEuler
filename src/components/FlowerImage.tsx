import type { Flower } from '../types';

// Placeholder "photo" drawn from the flower's color and shape. A real image URL wins when present.
export function FlowerImage({ flower, size = 64 }: { flower: Flower; size?: number }) {
  if (flower.imageUrl) {
    return <img className="flower-img" src={flower.imageUrl} alt={flower.name} width={size} height={size} />;
  }
  const c = flower.hex;
  return (
    <svg className="flower-img" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={flower.name}>
      <rect width="100" height="100" fill="#eef1ea" />
      <path d="M50 100 C50 80 52 70 50 58" stroke="#5f7d55" strokeWidth="3" fill="none" />
      {shape(flower.shape, c)}
    </svg>
  );
}

function shape(kind: Flower['shape'], c: string) {
  const stroke = 'rgba(0,0,0,0.12)';
  switch (kind) {
    case 'round':
      return (
        <g stroke={stroke}>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx="50" cy="28" rx="11" ry="20" fill={c} transform={`rotate(${i * 45} 50 45)`} />
          ))}
          <circle cx="50" cy="45" r="12" fill={c} />
          <circle cx="50" cy="45" r="6" fill="rgba(0,0,0,0.1)" />
        </g>
      );
    case 'spike':
      return (
        <g stroke={stroke} fill={c}>
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse key={i} cx={i % 2 ? 56 : 44} cy={14 + i * 7} rx="8" ry="6" />
          ))}
        </g>
      );
    case 'spray':
      return (
        <g stroke={stroke} fill={c}>
          {[
            [32, 34],
            [50, 22],
            [68, 34],
            [42, 50],
            [60, 50],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="11" />
          ))}
        </g>
      );
    case 'cluster':
      return (
        <g stroke={stroke} fill={c}>
          {Array.from({ length: 19 }, (_, i) => {
            const a = i * 2.4;
            const r = Math.sqrt(i) * 7.5;
            return <circle key={i} cx={50 + Math.cos(a) * r} cy={40 + Math.sin(a) * r} r="7" />;
          })}
        </g>
      );
    case 'foliage':
      return (
        <g stroke={stroke} fill={c}>
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse
              key={i}
              cx={i % 2 ? 60 : 40}
              cy={18 + i * 8}
              rx="10"
              ry="6"
              transform={`rotate(${i % 2 ? -30 : 30} ${i % 2 ? 60 : 40} ${18 + i * 8})`}
            />
          ))}
        </g>
      );
  }
}
