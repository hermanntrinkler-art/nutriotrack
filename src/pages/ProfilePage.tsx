import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe, Target, Leaf } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="page-container space-y-4">
      <h1 className="text-xl font-bold">{t('profile.title')}</h1>

      {/* User info */}
      <div className="nutri-card flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Leaf className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold">{profile?.name || user?.email?.split('@')[0]}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm px-1">{t('profile.settings')}</h3>

        {/* Language */}
        <div className="nutri-card space-y-3">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm">{t('profile.language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('de')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                language === 'de' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-accent'
              }`}
            >
              🇩🇪 {t('profile.german')}
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                language === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-accent'
              }`}
            >
              🇬🇧 {t('profile.english')}
            </button>
          </div>
        </div>

        {/* Edit Goals */}
        <button onClick={() => navigate('/onboarding')} className="nutri-card w-full flex items-center gap-3 hover:border-primary/30 transition-colors">
          <Target className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-sm">{t('profile.editGoals')}</span>
        </button>
      </div>

      {/* Logout */}
      <Button variant="outline" onClick={handleLogout} className="w-full">
        <LogOut className="h-4 w-4 mr-2" />
        {t('auth.logout')}
      </Button>
    </div>
  );
}
