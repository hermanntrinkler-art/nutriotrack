import { useState, useEffect } from 'react';
import { ScanSearch, Utensils, Brain, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyseScreenProps {
  imagePreview: string | null;
}

const analysisSteps = [
  { icon: ScanSearch, de: 'Bild wird erkannt…', en: 'Scanning image…' },
  { icon: Brain, de: 'KI analysiert Lebensmittel…', en: 'AI analyzing food…' },
  { icon: Utensils, de: 'Nährwerte werden berechnet…', en: 'Calculating nutrition…' },
  { icon: CheckCircle2, de: 'Fast fertig…', en: 'Almost done…' },
];

export default function AnalyseScreen({ imagePreview }: AnalyseScreenProps) {
  const { t, language } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) return prev;
        const increment = prev < 30 ? 3 : prev < 60 ? 2 : 1;
        return Math.min(prev + increment, 92);
      });
    }, 200);
    return () => clearInterval(progressInterval);
  }, []);

  const StepIcon = analysisSteps[currentStep].icon;
  const stepText = language === 'de' ? analysisSteps[currentStep].de : analysisSteps[currentStep].en;

  return (
    <motion.div
      className="flex flex-col items-center py-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image preview with scan overlay */}
      {imagePreview && (
        <motion.div
          className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-lg border border-border"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={imagePreview} alt="Meal" className="w-full h-48 object-cover" />
          {/* Scan line animation */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ top: 0 }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-primary/5" />
        </motion.div>
      )}

      {/* Animated icon */}
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{ duration: 0.3 }}
            >
              <StepIcon className="h-9 w-9 text-primary" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        {/* Orbiting dot */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-primary shadow-md"
          style={{ top: '50%', left: '50%' }}
          animate={{
            x: [0, 36, 0, -36, 0],
            y: [-36, 0, 36, 0, -36],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Step text */}
      <div className="text-center space-y-1 min-h-[48px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            className="font-semibold text-lg text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {stepText}
          </motion.p>
        </AnimatePresence>
        <p className="text-sm text-muted-foreground">{t('meals.aiAnalyzing')}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' as const }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t('meals.analyzing')}</span>
          <span className="tabular-nums font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-3">
        {analysisSteps.map((s, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
            animate={i === currentStep ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.8, repeat: i === currentStep ? Infinity : 0 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
