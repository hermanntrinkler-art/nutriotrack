import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

interface VirtualGardenProps {
  level: number;
  streak: number;
}

const pop = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
};

const swayAnim = {
  rotate: [0, 2, -2, 1, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
};

// Flower SVG helper
function Flower({ x, y, color, size = 1, delay = 0 }: { x: number; y: number; color: string; size?: number; delay?: number }) {
  return (
    <motion.g
      variants={pop}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <motion.g animate={swayAnim}>
        {/* Stem */}
        <line x1={x} y1={y} x2={x} y2={y + 16 * size} stroke="hsl(120,40%,35%)" strokeWidth={2 * size} strokeLinecap="round" />
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const px = x + Math.cos(rad) * 5 * size;
          const py = y + Math.sin(rad) * 5 * size;
          return <circle key={i} cx={px} cy={py} r={3.5 * size} fill={color} opacity={0.9} />;
        })}
        {/* Center */}
        <circle cx={x} cy={y} r={3 * size} fill="hsl(45,90%,55%)" />
      </motion.g>
    </motion.g>
  );
}

// Tree SVG helper
function Tree({ x, y, fruitLevel = 0, delay = 0 }: { x: number; y: number; fruitLevel?: number; delay?: number }) {
  return (
    <motion.g variants={pop} initial="hidden" animate="show" transition={{ delay }}>
      <motion.g animate={swayAnim}>
        {/* Trunk */}
        <rect x={x - 5} y={y} width={10} height={30} rx={3} fill="hsl(25,50%,35%)" />
        {/* Canopy */}
        <circle cx={x} cy={y - 8} r={22} fill="hsl(130,45%,40%)" />
        <circle cx={x - 12} cy={y - 2} r={16} fill="hsl(130,40%,45%)" />
        <circle cx={x + 12} cy={y - 2} r={16} fill="hsl(130,40%,45%)" />
        {/* Fruits */}
        {fruitLevel > 0 && (
          <>
            <circle cx={x - 8} cy={y - 14} r={3} fill="hsl(0,75%,50%)" />
            <circle cx={x + 10} cy={y - 6} r={3} fill="hsl(0,75%,50%)" />
            {fruitLevel > 1 && (
              <>
                <circle cx={x + 3} cy={y - 18} r={2.5} fill="hsl(40,90%,55%)" />
                <circle cx={x - 14} cy={y - 4} r={2.5} fill="hsl(40,90%,55%)" />
              </>
            )}
          </>
        )}
      </motion.g>
    </motion.g>
  );
}

// Bush SVG helper
function Bush({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g variants={pop} initial="hidden" animate="show" transition={{ delay }}>
      <ellipse cx={x} cy={y} rx={16} ry={12} fill="hsl(130,40%,42%)" />
      <ellipse cx={x - 10} cy={y + 2} rx={12} ry={9} fill="hsl(130,35%,48%)" />
      <ellipse cx={x + 10} cy={y + 2} rx={12} ry={9} fill="hsl(130,35%,48%)" />
    </motion.g>
  );
}

// Butterfly SVG helper
function Butterfly({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        x: [0, 15, -10, 5, 0],
        y: [0, -8, 4, -12, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, delay }}
    >
      <ellipse cx={x - 4} cy={y - 3} rx={4} ry={6} fill="hsl(280,70%,60%)" opacity={0.8} />
      <ellipse cx={x + 4} cy={y - 3} rx={4} ry={6} fill="hsl(320,70%,60%)" opacity={0.8} />
      <line x1={x} y1={y - 8} x2={x} y2={y + 2} stroke="hsl(0,0%,30%)" strokeWidth={1} />
    </motion.g>
  );
}

// Bird SVG helper
function Bird({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: [0, 20, 40, 20, 0] }}
      transition={{ duration: 12, repeat: Infinity, delay }}
    >
      <path d={`M${x},${y} Q${x + 5},${y - 5} ${x + 10},${y} Q${x + 15},${y - 5} ${x + 20},${y}`} fill="none" stroke="hsl(0,0%,25%)" strokeWidth={1.5} />
    </motion.g>
  );
}

// Pond SVG helper
function Pond({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g variants={pop} initial="hidden" animate="show" transition={{ delay }}>
      {/* Water */}
      <ellipse cx={x} cy={y} rx={30} ry={14} fill="hsl(200,60%,55%)" opacity={0.7} />
      <ellipse cx={x} cy={y} rx={26} ry={11} fill="hsl(200,65%,65%)" opacity={0.5} />
      {/* Lily pads */}
      <ellipse cx={x - 10} cy={y - 2} rx={5} ry={3} fill="hsl(130,50%,40%)" />
      <ellipse cx={x + 8} cy={y + 3} rx={4} ry={2.5} fill="hsl(130,50%,40%)" />
      {/* Lily flower */}
      <circle cx={x - 9} cy={y - 3} r={2} fill="hsl(330,70%,75%)" />
    </motion.g>
  );
}

// Sun SVG helper
function Sun({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
      <circle cx={320} cy={35} r={18} fill="hsl(45,95%,60%)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.line
            key={i}
            x1={320 + Math.cos(rad) * 22}
            y1={35 + Math.sin(rad) * 22}
            x2={320 + Math.cos(rad) * 30}
            y2={35 + Math.sin(rad) * 30}
            stroke="hsl(45,95%,60%)"
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          />
        );
      })}
    </motion.g>
  );
}

// Cloud SVG helper
function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <motion.g animate={{ x: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity }}>
      <ellipse cx={x} cy={y} rx={20} ry={10} fill="hsl(0,0%,80%)" opacity={0.8} />
      <ellipse cx={x - 12} cy={y + 3} rx={14} ry={8} fill="hsl(0,0%,82%)" opacity={0.7} />
      <ellipse cx={x + 14} cy={y + 2} rx={16} ry={9} fill="hsl(0,0%,78%)" opacity={0.75} />
    </motion.g>
  );
}

// Rain drops
function Rain() {
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.line
          key={i}
          x1={30 + i * 30}
          y1={50}
          x2={25 + i * 30}
          y2={60}
          stroke="hsl(210,60%,65%)"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
          animate={{ y: [0, 140], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </g>
  );
}

// Pavilion SVG helper
function Pavilion({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g variants={pop} initial="hidden" animate="show" transition={{ delay }}>
      {/* Roof */}
      <polygon points={`${x - 25},${y} ${x},${y - 18} ${x + 25},${y}`} fill="hsl(15,55%,45%)" />
      {/* Pillars */}
      <rect x={x - 20} y={y} width={4} height={24} fill="hsl(0,0%,85%)" />
      <rect x={x + 16} y={y} width={4} height={24} fill="hsl(0,0%,85%)" />
      {/* Floor */}
      <rect x={x - 22} y={y + 24} width={44} height={3} rx={1} fill="hsl(0,0%,75%)" />
    </motion.g>
  );
}

// Rainbow
function Rainbow({ delay = 0 }: { delay?: number }) {
  const colors = ['hsl(0,70%,60%)', 'hsl(30,80%,60%)', 'hsl(55,80%,55%)', 'hsl(120,50%,50%)', 'hsl(210,60%,55%)', 'hsl(270,50%,55%)'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay, duration: 1.5 }}>
      {colors.map((c, i) => (
        <path
          key={i}
          d={`M 40,190 Q 190,${20 + i * 8} 340,190`}
          fill="none"
          stroke={c}
          strokeWidth={3}
          opacity={0.6}
        />
      ))}
    </motion.g>
  );
}

// Fence
function Fence() {
  return (
    <g>
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <rect x={10 + i * 38} y={170} width={4} height={20} rx={1} fill="hsl(30,30%,55%)" />
          {i < 9 && <rect x={12 + i * 38} y={176} width={36} height={3} rx={1} fill="hsl(30,25%,50%)" />}
        </g>
      ))}
    </g>
  );
}

export default function VirtualGarden({ level, streak }: VirtualGardenProps) {
  const { language } = useTranslation();
  const de = language === 'de';
  const hasStreak = streak > 0;

  const levelLabels: Record<number, { de: string; en: string }> = {
    1: { de: 'Kahles Grundstück', en: 'Bare Plot' },
    2: { de: 'Erstes Grün sprießt', en: 'First Greens Sprout' },
    3: { de: 'Blumen blühen', en: 'Flowers Bloom' },
    4: { de: 'Sonnenblumen & Schmetterlinge', en: 'Sunflowers & Butterflies' },
    5: { de: 'Bäume wachsen', en: 'Trees Grow' },
    6: { de: 'Teich mit Seerosen', en: 'Pond with Lilies' },
    7: { de: 'Obstgarten & Vögel', en: 'Orchard & Birds' },
    8: { de: 'Traumgarten vollendet!', en: 'Dream Garden Complete!' },
  };

  const currentLabel = levelLabels[Math.min(level, 8)] || levelLabels[8];

  return (
    <div className="nutri-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground">
          🌱 {de ? 'Dein Garten' : 'Your Garden'} — Level {level}
        </p>
        <p className="text-[10px] text-muted-foreground italic">
          {de ? currentLabel.de : currentLabel.en}
        </p>
      </div>

      <div className="rounded-xl overflow-hidden border border-border bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-950 dark:to-emerald-950">
        <svg viewBox="0 0 380 210" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Sky */}
          <rect x={0} y={0} width={380} height={130} fill="url(#skyGradient)" />
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(200,70%,75%)" />
              <stop offset="100%" stopColor="hsl(195,60%,85%)" />
            </linearGradient>
            <linearGradient id="groundGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(90,30%,50%)" />
              <stop offset="100%" stopColor="hsl(30,35%,40%)" />
            </linearGradient>
          </defs>

          {/* Weather */}
          <AnimatePresence>
            {hasStreak ? (
              <Sun active />
            ) : (
              <>
                <Cloud x={80} y={30} />
                <Cloud x={220} y={22} />
                <Cloud x={310} y={38} />
                <Rain />
              </>
            )}
          </AnimatePresence>

          {/* Level 8: Rainbow */}
          {level >= 8 && <Rainbow delay={0.5} />}

          {/* Ground */}
          {level >= 2 ? (
            <motion.ellipse cx={190} cy={195} rx={200} ry={30} fill="hsl(120,35%,45%)" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
          ) : (
            <ellipse cx={190} cy={195} rx={200} ry={30} fill="hsl(30,30%,40%)" />
          )}
          <rect x={0} y={190} width={380} height={20} fill={level >= 2 ? 'hsl(120,30%,40%)' : 'hsl(30,28%,38%)'} />

          {/* Fence (always visible) */}
          <Fence />

          {/* Level 2: Grass patches + 1 flower */}
          {level >= 2 && (
            <>
              {[40, 100, 170, 250, 320].map((gx, i) => (
                <motion.g key={`grass-${i}`} variants={pop} initial="hidden" animate="show" transition={{ delay: i * 0.1 }}>
                  <line x1={gx} y1={185} x2={gx - 3} y2={175} stroke="hsl(120,45%,40%)" strokeWidth={1.5} />
                  <line x1={gx + 3} y1={185} x2={gx + 5} y2={173} stroke="hsl(120,40%,45%)" strokeWidth={1.5} />
                  <line x1={gx + 6} y1={185} x2={gx + 4} y2={176} stroke="hsl(120,45%,38%)" strokeWidth={1.5} />
                </motion.g>
              ))}
              <Flower x={80} y={162} color="hsl(350,70%,60%)" delay={0.3} />
            </>
          )}

          {/* Level 3: More flowers + bush */}
          {level >= 3 && (
            <>
              <Flower x={150} y={158} color="hsl(280,60%,60%)" delay={0.2} />
              <Flower x={230} y={165} color="hsl(45,80%,55%)" delay={0.35} />
              <Bush x={310} y={172} delay={0.4} />
            </>
          )}

          {/* Level 4: Sunflower + butterflies */}
          {level >= 4 && (
            <>
              <Flower x={55} y={148} color="hsl(45,90%,50%)" size={1.4} delay={0.15} />
              <Butterfly x={120} y={130} delay={0.5} />
              <Butterfly x={270} y={120} delay={1.2} />
            </>
          )}

          {/* Level 5: Tree + flower meadow */}
          {level >= 5 && (
            <>
              <Tree x={60} y={140} delay={0.2} />
              <Flower x={190} y={160} color="hsl(330,65%,60%)" size={0.8} delay={0.3} />
              <Flower x={210} y={168} color="hsl(200,60%,55%)" size={0.7} delay={0.35} />
              <Flower x={175} y={170} color="hsl(50,75%,55%)" size={0.75} delay={0.4} />
            </>
          )}

          {/* Level 6: Pond */}
          {level >= 6 && <Pond x={280} y={172} delay={0.3} />}

          {/* Level 7: Fruit tree + birds */}
          {level >= 7 && (
            <>
              <Tree x={340} y={135} fruitLevel={2} delay={0.2} />
              <Bird x={140} y={45} delay={0.5} />
              <Bird x={250} y={35} delay={1.5} />
            </>
          )}

          {/* Level 8: Pavilion */}
          {level >= 8 && <Pavilion x={190} y={132} delay={0.4} />}
        </svg>
      </div>

      {/* Streak weather indicator */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">
          {hasStreak
            ? `☀️ ${streak} ${de ? 'Tage Streak – Sonne scheint!' : 'day streak – Sun is shining!'}`
            : `🌧️ ${de ? 'Keine Streak – es regnet im Garten' : 'No streak – it\'s raining in the garden'}`
          }
        </span>
      </div>
    </div>
  );
}
