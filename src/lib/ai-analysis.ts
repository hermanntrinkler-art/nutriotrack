import type { AnalyzedFoodItem } from './types';
import { supabase } from '@/integrations/supabase/client';

export async function analyzeFoodImage(imageFile: File, language: string): Promise<AnalyzedFoodItem[]> {
  // Convert file to base64
  const base64 = await fileToBase64(imageFile);

  const { data, error } = await supabase.functions.invoke('analyze-meal', {
    body: { imageBase64: base64, language },
  });

  if (error) {
    console.error('Analysis error:', error);
    throw new Error(error.message || 'Analysis failed');
  }

  if (data?.error === 'rate_limit') {
    throw new Error('RATE_LIMIT');
  }
  if (data?.error === 'payment_required') {
    throw new Error('PAYMENT_REQUIRED');
  }
  if (data?.error) {
    throw new Error(data.error);
  }

  return (data?.items || []).map((item: any) => ({
    food_name: item.food_name || '',
    quantity: Number(item.quantity) || 0,
    unit: item.unit || 'g',
    calories: Math.round(Number(item.calories) || 0),
    protein_g: Math.round(Number(item.protein_g) || 0),
    fat_g: Math.round(Number(item.fat_g) || 0),
    carbs_g: Math.round(Number(item.carbs_g) || 0),
    confidence_score: Number(item.confidence_score) || 0.5,
  }));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
