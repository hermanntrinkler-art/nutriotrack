import { useState } from 'react';
import type { AnalyzedFoodItem } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Pencil, Trash2, Shield, ShieldAlert, Minus, Plus } from 'lucide-react';

interface FoodItemCardProps {
  item: AnalyzedFoodItem;
  index: number;
  isAiResult: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onQuantityChange?: (newItem: AnalyzedFoodItem) => void;
}

function confidenceColor(score: number): string {
  if (score >= 0.85) return 'text-primary';
  if (score >= 0.65) return 'text-warning';
  return 'text-destructive';
}

function confidenceLabel(score: number, t: (key: any) => string): string {
  if (score >= 0.85) return t('meals.confidenceHigh');
  if (score >= 0.65) return t('meals.confidenceMedium');
  return t('meals.confidenceLow');
}

function scaleItem(item: AnalyzedFoodItem, oldQty: number, newQty: number): AnalyzedFoodItem {
  if (oldQty <= 0) return { ...item, quantity: newQty };
  const factor = newQty / oldQty;
  return {
    ...item,
    quantity: newQty,
    calories: Math.round(item.calories * factor),
    protein_g: Math.round(item.protein_g * factor * 10) / 10,
    fat_g: Math.round(item.fat_g * factor * 10) / 10,
    carbs_g: Math.round(item.carbs_g * factor * 10) / 10,
  };
}

export default function FoodItemCard({ item, index, isAiResult, onEdit, onRemove, onQuantityChange }: FoodItemCardProps) {
  const { t } = useTranslation();

  const isPiece = item.unit === 'Stück' || item.unit === 'piece';
  const step = isPiece ? 1 : item.quantity <= 20 ? 1 : item.quantity <= 100 ? 5 : 10;

  const handleStep = (delta: number) => {
    if (!onQuantityChange) return;
    const oldQty = item.quantity;
    const newQty = Math.max(isPiece ? 1 : step, Math.round((oldQty + delta * step) * 10) / 10);
    onQuantityChange(scaleItem(item, oldQty, newQty));
  };

  return (
    <div className="nutri-card animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{item.food_name || t('meals.foodName')}</h4>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label={t('common.edit')}
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
            aria-label={t('common.delete')}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </button>
        </div>
      </div>

      {/* Inline quantity stepper */}
      {onQuantityChange && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => handleStep(-1)}
            className="w-7 h-7 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95"
          >
            <Minus className="h-3.5 w-3.5 text-foreground" />
          </button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {item.quantity} {item.unit}
          </span>
          <button
            onClick={() => handleStep(1)}
            className="w-7 h-7 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 text-foreground" />
          </button>
        </div>
      )}

      {/* Macros row */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="py-1.5 rounded-lg bg-muted">
          <p className="text-xs font-bold text-foreground">{Math.round(item.calories)}</p>
          <p className="text-[10px] text-muted-foreground">{t('dashboard.kcal')}</p>
        </div>
        <div className="py-1.5 rounded-lg bg-muted">
          <p className="text-xs font-bold text-protein">{Math.round(item.protein_g)}g</p>
          <p className="text-[10px] text-muted-foreground">P</p>
        </div>
        <div className="py-1.5 rounded-lg bg-muted">
          <p className="text-xs font-bold text-fat">{Math.round(item.fat_g)}g</p>
          <p className="text-[10px] text-muted-foreground">F</p>
        </div>
        <div className="py-1.5 rounded-lg bg-muted">
          <p className="text-xs font-bold text-carbs">{Math.round(item.carbs_g)}g</p>
          <p className="text-[10px] text-muted-foreground">C</p>
        </div>
      </div>

      {/* Confidence badge */}
      {isAiResult && (
        <div className="mt-2 flex items-center gap-1.5">
          {item.confidence_score >= 0.85 ? (
            <Shield className={`h-3 w-3 ${confidenceColor(item.confidence_score)}`} />
          ) : (
            <ShieldAlert className={`h-3 w-3 ${confidenceColor(item.confidence_score)}`} />
          )}
          <span className={`text-[10px] font-medium ${confidenceColor(item.confidence_score)}`}>
            {confidenceLabel(item.confidence_score, t)} ({Math.round(item.confidence_score * 100)}%)
          </span>
        </div>
      )}
    </div>
  );
}
