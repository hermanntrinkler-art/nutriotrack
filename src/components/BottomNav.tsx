import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, Clock, Scale, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const tabs = [
  { key: 'nav.dashboard' as const, icon: LayoutDashboard, path: '/' },
  { key: 'nav.meals' as const, icon: Utensils, path: '/meals' },
  { key: 'nav.history' as const, icon: Clock, path: '/history' },
  { key: 'nav.weight' as const, icon: Scale, path: '/weight' },
  { key: 'nav.profile' as const, icon: User, path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border bottom-nav-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {tabs.map(({ key, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px] ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{t(key)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
