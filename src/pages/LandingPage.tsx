import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, BarChart3, Zap, Shield, Star, ArrowRight, Check, Sparkles, Users, TrendingUp, Flame, Heart } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import heroMockup from '@/assets/hero-mockup.png';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function LandingPage() {
  const { t } = useTranslation();

  const stats = [
    { value: '15K+', label: t('landing.statsUsers'), icon: Users },
    { value: '2M+', label: t('landing.statsMeals'), icon: Flame },
    { value: '98%', label: t('landing.statsAccuracy'), icon: TrendingUp },
    { value: '4.8★', label: t('landing.statsRating'), icon: Star },
  ];

  const features = [
    { icon: Camera, title: t('landing.featurePhoto'), desc: t('landing.featurePhotoDesc'), color: 'hsl(var(--primary))' },
    { icon: BarChart3, title: t('landing.featureStats'), desc: t('landing.featureStatsDesc'), color: 'hsl(var(--protein))' },
    { icon: Zap, title: t('landing.featureBarcode'), desc: t('landing.featureBarcodeDesc'), color: 'hsl(var(--energy))' },
    { icon: Shield, title: t('landing.featureGoals'), desc: t('landing.featureGoalsDesc'), color: 'hsl(var(--carbs))' },
    { icon: Star, title: t('landing.featureWeight'), desc: t('landing.featureWeightDesc'), color: 'hsl(var(--fat))' },
    { icon: Sparkles, title: t('landing.featureSmart'), desc: t('landing.featureSmartDesc'), color: 'hsl(var(--primary))' },
  ];

  const steps = [
    { step: '01', title: t('landing.step1'), desc: t('landing.step1Desc') },
    { step: '02', title: t('landing.step2'), desc: t('landing.step2Desc') },
    { step: '03', title: t('landing.step3'), desc: t('landing.step3Desc') },
  ];

  const testimonials = [
    { text: t('landing.testimonial1'), name: t('landing.testimonial1Name'), role: t('landing.testimonial1Role'), avatar: '👩‍🦰' },
    { text: t('landing.testimonial2'), name: t('landing.testimonial2Name'), role: t('landing.testimonial2Role'), avatar: '👨‍💼' },
    { text: t('landing.testimonial3'), name: t('landing.testimonial3Name'), role: t('landing.testimonial3Role'), avatar: '👩‍🏫' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight font-display">NutrioTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold">{t('landing.signIn')}</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-bold">{t('landing.startFree')}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl" />
        </div>
        <motion.div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative" variants={stagger} initial="hidden" animate="show">
          <div className="space-y-7">
            <motion.div className="sport-badge" variants={fadeUp}>
              <Sparkles className="h-3 w-3" />
              {t('landing.badge')}
            </motion.div>
            <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-display" variants={fadeUp}>
              {t('landing.heroTitle1')}{' '}
              <span className="gradient-text">{t('landing.heroTitle2')}</span>
            </motion.h1>
            <motion.p className="text-lg text-muted-foreground max-w-lg leading-relaxed" variants={fadeUp}>
              {t('landing.heroDesc')}
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-3" variants={fadeUp}>
              <Link to="/register">
                <Button size="lg" className="h-13 px-8 text-base font-bold w-full sm:w-auto group">
                  {t('landing.cta')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold w-full sm:w-auto">
                  {t('landing.signIn')}
                </Button>
              </Link>
            </motion.div>
            <motion.div className="flex items-center gap-6 pt-2" variants={fadeUp}>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                {t('landing.noCreditCard')}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                {t('landing.freeScans')}
              </div>
            </motion.div>
          </div>
          <motion.div className="relative flex justify-center lg:justify-end" variants={scaleIn}>
            <div className="relative">
              <div className="absolute -inset-12 bg-gradient-to-br from-primary/20 via-primary/5 to-energy/10 rounded-full blur-3xl animate-pulse" />
              <motion.img src={heroMockup} alt="NutrioTrack App" className="relative w-72 sm:w-80 lg:w-96 drop-shadow-2xl" loading="eager" whileHover={{ scale: 1.03, rotate: 1 }} transition={{ type: 'spring', stiffness: 200 }} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <AnimatedSection className="py-12 px-4 border-y border-border/50 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-6" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {stats.map((stat, i) => (
              <motion.div key={i} className="text-center space-y-1.5" variants={fadeUp}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl sm:text-3xl font-black font-display tracking-tight">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-display">{t('landing.featuresTitle')}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('landing.featuresDesc')}</p>
          </div>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {features.map((feature, i) => (
              <motion.div key={i} className="nutri-card group hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300" variants={fadeUp}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${feature.color}15` }}>
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* How it works */}
      <AnimatedSection className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-display">{t('landing.howTitle')}</h2>
          </div>
          <motion.div className="grid sm:grid-cols-3 gap-8" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {steps.map((item, i) => (
              <motion.div key={i} className="text-center space-y-3" variants={fadeUp}>
                <motion.div className="text-5xl font-black gradient-text font-display" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
                  {item.step}
                </motion.div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-display">{t('landing.testimonialsTitle')}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('landing.testimonialsDesc')}</p>
          </div>
          <motion.div className="grid sm:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {testimonials.map((item, i) => (
              <motion.div key={i} className="nutri-card space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300" variants={fadeUp}>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-energy text-energy" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">"{item.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <span className="text-2xl">{item.avatar}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Pricing */}
      <AnimatedSection className="py-20 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-display">{t('landing.pricingTitle')}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('landing.pricingDesc')}</p>
          </div>
          <motion.div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div className="nutri-card space-y-4" variants={fadeUp}>
              <h3 className="font-bold text-xl">Free</h3>
              <div className="text-4xl font-black font-display">0 €</div>
              <ul className="space-y-2.5">
                {[t('landing.priceFree1'), t('landing.priceFree2'), t('landing.priceFree3'), t('landing.priceFree4')].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/register" className="block">
                <Button variant="outline" className="w-full font-bold">{t('landing.startFree')}</Button>
              </Link>
            </motion.div>
            <motion.div className="nutri-card-highlight space-y-4" variants={fadeUp}>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl">Pro</h3>
                <span className="sport-badge text-[10px]">{t('landing.popular')}</span>
              </div>
              <div>
                <span className="text-4xl font-black font-display">7,99 €</span>
                <span className="text-muted-foreground text-sm">{t('landing.perMonth')}</span>
              </div>
              <p className="text-xs text-primary font-semibold">{t('landing.freeTrial')}</p>
              <ul className="space-y-2.5">
                {[t('landing.pricePro1'), t('landing.pricePro2'), t('landing.pricePro3'), t('landing.pricePro4'), t('landing.pricePro5')].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/register" className="block">
                <Button className="w-full font-bold">{t('landing.freeTrial')}</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection className="py-24 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-t from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto text-center space-y-6 relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-destructive animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground">{t('landing.lovedBy')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
              {t('landing.ctaTitle1')}{' '}
              <span className="gradient-text">{t('landing.ctaTitle2')}</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4">{t('landing.ctaDesc')}</p>
            <Link to="/register" className="inline-block mt-8">
              <Button size="lg" className="h-14 px-10 text-base font-bold group">
                {t('landing.ctaButton')}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

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
            © {new Date().getFullYear()} NutrioTrack. {t('landing.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
