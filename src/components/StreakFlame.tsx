import { motion } from 'framer-motion';

interface StreakFlameProps {
  streak: number;
  className?: string;
}

// Flame tiers with visual progression
function getFlameConfig(streak: number) {
  if (streak >= 100) return { tier: 'rainbow', size: 'h-10 w-10', colors: ['hsl(0,80%,55%)', 'hsl(45,95%,55%)', 'hsl(200,80%,55%)', 'hsl(280,70%,55%)'], label: '🌈', pulseScale: 1.15 };
  if (streak >= 60) return { tier: 'purple', size: 'h-9 w-9', colors: ['hsl(280,70%,55%)', 'hsl(320,80%,60%)'], label: '💜', pulseScale: 1.12 };
  if (streak >= 30) return { tier: 'blue', size: 'h-8 w-8', colors: ['hsl(210,80%,55%)', 'hsl(230,70%,60%)'], label: '💙', pulseScale: 1.1 };
  if (streak >= 14) return { tier: 'large', size: 'h-7 w-7', colors: ['hsl(25,95%,55%)', 'hsl(0,80%,50%)'], label: '🔥', pulseScale: 1.08 };
  if (streak >= 7) return { tier: 'medium', size: 'h-6 w-6', colors: ['hsl(35,90%,55%)', 'hsl(15,85%,50%)'], label: '🔥', pulseScale: 1.05 };
  if (streak >= 3) return { tier: 'small', size: 'h-5 w-5', colors: ['hsl(45,90%,55%)', 'hsl(30,85%,50%)'], label: '🔥', pulseScale: 1.03 };
  return { tier: 'none', size: 'h-5 w-5', colors: ['hsl(0,0%,60%)'], label: '💤', pulseScale: 1 };
}

export default function StreakFlame({ streak, className = '' }: StreakFlameProps) {
  const config = getFlameConfig(streak);
  const isActive = streak >= 3;
  const isRainbow = config.tier === 'rainbow';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Flame SVG */}
      <motion.div
        className={`relative flex items-center justify-center ${config.size}`}
        animate={isActive ? { scale: [1, config.pulseScale, 1] } : {}}
        transition={isActive ? { duration: 1.8, repeat: Infinity, repeatDelay: 1 } : undefined}
      >
        <svg viewBox="0 0 40 52" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`flame-grad-${streak}`} x1="0" y1="1" x2="0" y2="0">
              {config.colors.map((c, i) => (
                <stop key={i} offset={`${(i / (config.colors.length - 1)) * 100}%`} stopColor={c} />
              ))}
            </linearGradient>
            {isRainbow && (
              <linearGradient id="flame-rainbow" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(0,80%,55%)" />
                <stop offset="25%" stopColor="hsl(45,95%,55%)" />
                <stop offset="50%" stopColor="hsl(120,60%,50%)" />
                <stop offset="75%" stopColor="hsl(200,80%,55%)" />
                <stop offset="100%" stopColor="hsl(280,70%,55%)" />
              </linearGradient>
            )}
          </defs>

          {/* Outer flame */}
          <motion.path
            d="M20 2 C20 2, 5 18, 5 30 C5 40, 12 50, 20 50 C28 50, 35 40, 35 30 C35 18, 20 2, 20 2Z"
            fill={isRainbow ? 'url(#flame-rainbow)' : `url(#flame-grad-${streak})`}
            opacity={isActive ? 0.9 : 0.3}
            animate={isActive ? { d: [
              'M20 2 C20 2, 5 18, 5 30 C5 40, 12 50, 20 50 C28 50, 35 40, 35 30 C35 18, 20 2, 20 2Z',
              'M20 4 C20 4, 3 16, 4 28 C4 39, 11 50, 20 50 C29 50, 36 39, 36 28 C37 16, 20 4, 20 4Z',
              'M20 2 C20 2, 5 18, 5 30 C5 40, 12 50, 20 50 C28 50, 35 40, 35 30 C35 18, 20 2, 20 2Z',
            ] } : undefined}
            transition={isActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } : undefined}
          />

          {/* Inner flame */}
          {isActive && (
            <motion.path
              d="M20 18 C20 18, 12 28, 12 34 C12 40, 16 46, 20 46 C24 46, 28 40, 28 34 C28 28, 20 18, 20 18Z"
              fill="hsl(45,95%,70%)"
              opacity={0.7}
              animate={{
                d: [
                  'M20 18 C20 18, 12 28, 12 34 C12 40, 16 46, 20 46 C24 46, 28 40, 28 34 C28 28, 20 18, 20 18Z',
                  'M20 20 C20 20, 13 27, 13 33 C13 39, 17 46, 20 46 C23 46, 27 39, 27 33 C27 27, 20 20, 20 20Z',
                  'M20 18 C20 18, 12 28, 12 34 C12 40, 16 46, 20 46 C24 46, 28 40, 28 34 C28 28, 20 18, 20 18Z',
                ],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const }}
            />
          )}

          {/* Core (brightest) */}
          {streak >= 7 && (
            <ellipse cx="20" cy="40" rx="4" ry="6" fill="hsl(55,100%,85%)" opacity={0.6} />
          )}
        </svg>

        {/* Spark particles for high streaks */}
        {streak >= 30 && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ background: config.colors[i % config.colors.length] }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-2, -16 - i * 4],
                  x: [(i - 1) * 6, (i - 1) * 10],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Streak info */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-foreground tabular-nums">{streak}</span>
          <span className="text-xs font-bold text-muted-foreground">
            {streak === 1 ? 'Tag' : 'Tage'}
          </span>
        </div>
        {isActive && (
          <motion.p
            className="text-[10px] font-semibold"
            style={{ color: config.colors[0] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {config.tier === 'rainbow' ? '🌈 Regenbogen-Streak!'
              : config.tier === 'purple' ? '💎 Diamant-Streak!'
              : config.tier === 'blue' ? '❄️ Eis-Streak!'
              : config.tier === 'large' ? '🔥 Feuer-Streak!'
              : config.tier === 'medium' ? '💪 Stark!'
              : '✨ Am Ball!'}
          </motion.p>
        )}
      </div>
    </div>
  );
}
