import { Crown, Lock } from 'lucide-react';

export function ProBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full ${className}`}>
      <Crown className="h-3 w-3" /> PRO
    </span>
  );
}

export function ProLockOverlay({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-background/70 transition-colors"
    >
      <Lock className="h-5 w-5 text-primary" />
      <span className="text-xs font-bold text-primary">PRO</span>
    </button>
  );
}
