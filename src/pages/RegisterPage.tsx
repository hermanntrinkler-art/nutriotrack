import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-xl font-semibold">{t('common.success')}</h2>
          <p className="text-muted-foreground">{t('auth.checkEmail')}</p>
          <Link to="/login">
            <Button variant="outline" className="mt-4">{t('auth.login')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <img src={logo} alt="Snap2Fit" className="h-16 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-foreground">Snap2Fit</h1>
          <p className="text-muted-foreground text-sm">{t('auth.subtitle')}</p>
        </div>

        <h2 className="text-xl font-semibold text-foreground">{t('auth.createAccount')}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('auth.name')}</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('common.loading') : t('auth.register')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
