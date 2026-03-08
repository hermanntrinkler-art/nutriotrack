import { Loader2, ScanSearch } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface AnalyseScreenProps {
  imagePreview: string | null;
}

export default function AnalyseScreen({ imagePreview }: AnalyseScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center py-8 space-y-6 animate-fade-in">
      {/* Image preview */}
      {imagePreview && (
        <div className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-md border border-border">
          <img src={imagePreview} alt="Meal" className="w-full h-48 object-cover" />
        </div>
      )}

      {/* Analysis animation */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <ScanSearch className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="font-semibold text-lg">{t('meals.analyzing')}</p>
          <p className="text-sm text-muted-foreground">{t('meals.aiAnalyzing')}</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
