import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

const REMEMBERED_EMAIL_KEY = 'nutriotrack_remembered_email';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function LoginPage() {
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    const { error } = await signIn(email.trim(), password);
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    setError('');
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (error) {
        setError(error.message || 'Social login fehlgeschlagen');
      }
    } catch (err) {
      setError('Social login fehlgeschlagen');
    }
    setSocialLoading(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
      <motion.div
        className="w-full max-w-[420px] space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Logo */}
        <motion.div className="text-center space-y-3 pb-2" variants={scaleIn}>
          <motion.img
            src={logo}
            alt="NutrioTrack"
            className="h-48 mx-auto object-contain"
            whileHover={{ scale: 1.04, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
          <p className="text-muted-foreground text-sm">
            Tracke deine Ernährung mit nur einem Foto.
          </p>
        </motion.div>

        {/* Title */}
        <motion.h2 className="text-lg font-semibold text-foreground" variants={fadeUp}>
          {t('auth.welcomeBack')}
        </motion.h2>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-4" variants={fadeUp}>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Passwort</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Passwort eingeben"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
              Angemeldet bleiben
            </Label>
          </div>

          {error && (
            <motion.p
              className="text-destructive text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button type="submit" className="w-full rounded-xl h-11 text-base font-semibold" disabled={loading}>
              {loading ? t('common.loading') : 'Anmelden'}
            </Button>
          </motion.div>
        </motion.form>

        {/* Divider */}
        <motion.div className="flex items-center gap-3" variants={fadeUp}>
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">oder</span>
          <Separator className="flex-1" />
        </motion.div>

        {/* Social Login */}
        <motion.div className="space-y-3" variants={fadeUp}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              className="w-full rounded-xl h-11 text-sm font-medium gap-3"
              onClick={() => handleSocialLogin('google')}
              disabled={!!socialLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.02 11.02 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {socialLoading === 'google' ? t('common.loading') : 'Mit Google anmelden'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              className="w-full rounded-xl h-11 text-sm font-medium gap-3"
              onClick={() => handleSocialLogin('apple')}
              disabled={!!socialLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              {socialLoading === 'apple' ? t('common.loading') : 'Mit Apple anmelden'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Forgot password */}
        <motion.div className="text-center" variants={fadeUp}>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Passwort vergessen?
          </Link>
        </motion.div>

        {/* Register */}
        <motion.div className="text-center pt-2 pb-4" variants={fadeUp}>
          <p className="text-sm text-muted-foreground mb-1">Noch kein Konto?</p>
          <Link
            to="/register"
            className="text-primary hover:underline font-semibold text-base"
          >
            Kostenlos registrieren
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
