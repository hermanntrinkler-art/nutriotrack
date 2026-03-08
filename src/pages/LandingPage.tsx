import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, BarChart3, Zap, Shield, Star, ArrowRight, Check, Sparkles } from 'lucide-react';
import heroMockup from '@/assets/hero-mockup.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              NutrioTrack
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold">
                Anmelden
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-bold">
                Kostenlos starten
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="sport-badge">
              <Sparkles className="h-3 w-3" />
              KI-gestützte Ernährungsanalyse
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Deine Ernährung.{' '}
              <span className="gradient-text">Smart getrackt.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Fotografiere dein Essen und erhalte sofort eine detaillierte Nährwertanalyse. 
              Kalorien, Makros und Fortschritte – alles auf einen Blick.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register">
                <Button size="lg" className="h-13 px-8 text-base font-bold w-full sm:w-auto">
                  7 Tage kostenlos testen
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold w-full sm:w-auto">
                  Anmelden
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                Keine Kreditkarte nötig
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                3 Scans/Tag gratis
              </div>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-full blur-3xl" />
              <img 
                src={heroMockup} 
                alt="NutrioTrack App Vorschau" 
                className="relative w-72 sm:w-80 lg:w-96 drop-shadow-2xl"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Alles was du brauchst
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              NutrioTrack kombiniert KI-Technologie mit smartem Tracking für optimale Ernährungskontrolle.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: 'Foto-Analyse',
                desc: 'Fotografiere dein Essen und erhalte sofort Kalorien und Makronährstoffe per KI.',
                color: 'hsl(var(--primary))',
              },
              {
                icon: BarChart3,
                title: 'Detaillierte Statistiken',
                desc: 'Tägliche, wöchentliche und monatliche Auswertungen deiner Ernährung.',
                color: 'hsl(var(--protein))',
              },
              {
                icon: Zap,
                title: 'Barcode-Scanner',
                desc: 'Scanne Produkte und erhalte alle Nährwerte direkt aus der Datenbank.',
                color: 'hsl(var(--energy))',
              },
              {
                icon: Shield,
                title: 'Persönliche Ziele',
                desc: 'Setze individuelle Kalorien- und Makro-Ziele basierend auf deinem Profil.',
                color: 'hsl(var(--carbs))',
              },
              {
                icon: Star,
                title: 'Gewichtstracking',
                desc: 'Verfolge deinen Gewichtsverlauf und sieh deinen Fortschritt über die Zeit.',
                color: 'hsl(var(--fat))',
              },
              {
                icon: Sparkles,
                title: 'Smart & Schnell',
                desc: 'In Sekunden tracken statt mühsam suchen. KI erkennt Portionsgrößen automatisch.',
                color: 'hsl(var(--primary))',
              },
            ].map((feature, i) => (
              <div key={i} className="nutri-card group hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              So einfach geht's
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Foto machen', desc: 'Einfach dein Essen fotografieren oder Barcode scannen.' },
              { step: '02', title: 'KI analysiert', desc: 'Unsere KI erkennt Lebensmittel und berechnet Nährwerte.' },
              { step: '03', title: 'Fortschritt sehen', desc: 'Verfolge Kalorien, Makros und dein Gewicht über Zeit.' },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="text-5xl font-black gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {item.step}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Starte kostenlos
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              3 Foto-Analysen pro Tag – komplett gratis. Upgrade für unbegrenzten Zugriff.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="nutri-card space-y-4">
              <h3 className="font-bold text-xl">Free</h3>
              <div className="text-4xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>0 €</div>
              <ul className="space-y-2.5">
                {['3 Foto-Analysen/Tag', 'Barcode-Scanner', 'Tagesübersicht', 'Gewichtstracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block">
                <Button variant="outline" className="w-full font-bold">Kostenlos starten</Button>
              </Link>
            </div>
            {/* Pro */}
            <div className="nutri-card-highlight space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl">Pro</h3>
                <span className="sport-badge text-[10px]">Beliebt</span>
              </div>
              <div>
                <span className="text-4xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>7,99 €</span>
                <span className="text-muted-foreground text-sm">/Monat</span>
              </div>
              <p className="text-xs text-primary font-semibold">7 Tage kostenlos testen</p>
              <ul className="space-y-2.5">
                {['Unbegrenzte Foto-Analysen', 'Wochen- & Monatsstatistiken', 'Makro-Charts', 'Fortschrittskurven', 'Ernährungstipps'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block">
                <Button className="w-full font-bold">7 Tage kostenlos testen</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Bereit, deine Ernährung zu{' '}
            <span className="gradient-text">optimieren?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Schließe dich tausenden Nutzern an, die ihre Ernährung mit NutrioTrack im Griff haben.
          </p>
          <Link to="/register">
            <Button size="lg" className="h-14 px-10 text-base font-bold">
              Jetzt kostenlos starten
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">NutrioTrack</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NutrioTrack. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
