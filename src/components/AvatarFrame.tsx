import { motion } from 'framer-motion';

interface AvatarFrameProps {
  level: number;
  avatarUrl?: string | null;
  avatarEmoji?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FRAME_CONFIG: Record<number, { label: string; colors: string[]; glow: string }> = {
  1: { label: 'Starter', colors: ['hsl(0,0%,65%)', 'hsl(0,0%,75%)'], glow: 'none' },
  2: { label: 'Bronze', colors: ['hsl(30,60%,45%)', 'hsl(25,50%,55%)'], glow: 'hsl(30,60%,45%)' },
  3: { label: 'Silber', colors: ['hsl(0,0%,72%)', 'hsl(0,0%,82%)'], glow: 'hsl(0,0%,72%)' },
  4: { label: 'Gold', colors: ['hsl(45,85%,50%)', 'hsl(38,80%,60%)'], glow: 'hsl(45,85%,50%)' },
  5: { label: 'Platin', colors: ['hsl(200,30%,70%)', 'hsl(210,40%,80%)'], glow: 'hsl(200,30%,70%)' },
  6: { label: 'Diamant', colors: ['hsl(200,80%,60%)', 'hsl(260,70%,65%)'], glow: 'hsl(230,75%,62%)' },
  7: { label: 'Meister', colors: ['hsl(280,70%,55%)', 'hsl(320,80%,60%)'], glow: 'hsl(300,75%,57%)' },
  8: { label: 'Legende', colors: ['hsl(0,80%,55%)', 'hsl(30,90%,55%)', 'hsl(55,90%,55%)', 'hsl(120,60%,50%)', 'hsl(200,80%,55%)', 'hsl(280,70%,55%)'], glow: 'hsl(45,90%,55%)' },
};

const TITLES: Record<number, { de: string; en: string }> = {
  1: { de: 'Rookie', en: 'Rookie' },
  2: { de: 'Tracker', en: 'Tracker' },
  3: { de: 'Aufsteiger', en: 'Climber' },
  4: { de: 'Athlet', en: 'Athlete' },
  5: { de: 'Profi', en: 'Pro' },
  6: { de: 'Champion', en: 'Champion' },
  7: { de: 'Meister', en: 'Master' },
  8: { de: 'Legende', en: 'Legend' },
};

const SIZE_MAP = {
  sm: { outer: 'w-10 h-10', inner: 'w-8 h-8', border: 2, emoji: 'text-lg' },
  md: { outer: 'w-16 h-16', inner: 'w-[52px] h-[52px]', border: 3, emoji: 'text-3xl' },
  lg: { outer: 'w-20 h-20', inner: 'w-[66px] h-[66px]', border: 4, emoji: 'text-4xl' },
};

export function getTitle(level: number, lang: string) {
  const l = Math.min(Math.max(level, 1), 8);
  return lang === 'de' ? TITLES[l].de : TITLES[l].en;
}

export function getFrameLabel(level: number) {
  const l = Math.min(Math.max(level, 1), 8);
  return FRAME_CONFIG[l].label;
}

export default function AvatarFrame({ level, avatarUrl, avatarEmoji, size = 'md', className = '' }: AvatarFrameProps) {
  const l = Math.min(Math.max(level, 1), 8);
  const config = FRAME_CONFIG[l];
  const sizeConfig = SIZE_MAP[size];

  const gradientColors = config.colors.join(', ');
  const isAnimated = l >= 6;
  const isRainbow = l === 8;

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-2xl ${sizeConfig.outer} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientColors})`,
        boxShadow: config.glow !== 'none' ? `0 0 ${l >= 6 ? 16 : 10}px ${config.glow}40` : 'none',
        padding: sizeConfig.border,
      }}
      animate={isAnimated ? {
        background: isRainbow
          ? [
              'linear-gradient(0deg, hsl(0,80%,55%), hsl(55,90%,55%), hsl(200,80%,55%))',
              'linear-gradient(120deg, hsl(55,90%,55%), hsl(200,80%,55%), hsl(280,70%,55%))',
              'linear-gradient(240deg, hsl(200,80%,55%), hsl(280,70%,55%), hsl(0,80%,55%))',
              'linear-gradient(360deg, hsl(0,80%,55%), hsl(55,90%,55%), hsl(200,80%,55%))',
            ]
          : [
              `linear-gradient(0deg, ${gradientColors})`,
              `linear-gradient(180deg, ${gradientColors})`,
              `linear-gradient(360deg, ${gradientColors})`,
            ],
      } : undefined}
      transition={isAnimated ? { duration: isRainbow ? 3 : 4, repeat: Infinity, ease: 'linear' as const } : undefined}
    >
      <div className={`${sizeConfig.inner} rounded-xl overflow-hidden flex items-center justify-center bg-card`}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className={sizeConfig.emoji}>{avatarEmoji || '😊'}</span>
        )}
      </div>

      {/* Sparkle effect for high levels */}
      {l >= 7 && (
        <>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: config.colors[i % config.colors.length] }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                x: [0, (i - 1) * 12],
                y: [0, -8 - i * 4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
