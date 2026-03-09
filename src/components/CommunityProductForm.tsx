import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/haptics';
import { motion } from 'framer-motion';

interface CommunityProductFormProps {
  onClose: () => void;
  onSaved: () => void;
  prefillName?: string;
  prefillBarcode?: string;
}

export default function CommunityProductForm({ onClose, onSaved, prefillName, prefillBarcode }: CommunityProductFormProps) {
  const { user, profile } = useAuth();
  const { language } = useTranslation();
  const [saving, setSaving] = useState(false);

  const [foodName, setFoodName] = useState(prefillName || '');
  const [brand, setBrand] = useState('');
  const [store, setStore] = useState('');
  const [barcode, setBarcode] = useState(prefillBarcode || '');
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');

  const displayName = profile?.display_name || profile?.name || 'Anonym';
  const avatarEmoji = profile?.avatar_emoji || '😊';

  const handleSave = async () => {
    if (!user || !foodName.trim() || !calories) {
      toast.error(language === 'de' ? 'Name und Kalorien sind Pflicht' : 'Name and calories are required');
      return;
    }

    if (!profile?.display_name) {
      toast.error(language === 'de' ? 'Bitte zuerst einen Künstlernamen im Profil setzen' : 'Please set a display name in your profile first');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('community_products').insert({
      contributor_id: user.id,
      contributor_display_name: displayName,
      contributor_avatar_emoji: avatarEmoji,
      food_name: foodName.trim(),
      barcode: barcode.trim() || null,
      brand: brand.trim() || null,
      store: store.trim() || null,
      quantity: Number(quantity) || 100,
      unit,
      calories: Number(calories) || 0,
      protein_g: Number(protein) || 0,
      fat_g: Number(fat) || 0,
      carbs_g: Number(carbs) || 0,
    } as any);

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Failed to save');
    } else {
      hapticFeedback('success');
      toast.success(language === 'de' ? 'Zur Community-Datenbank hinzugefügt! 🎉' : 'Added to community database! 🎉');
      onSaved();
    }
    setSaving(false);
  };

  const de = language === 'de';

  return (
    <motion.div
      className="nutri-card space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm">
          {de ? '👥 Community-Produkt hinzufügen' : '👥 Add Community Product'}
        </h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {de
          ? `Wird für alle User sichtbar als Beitrag von ${avatarEmoji} ${displayName}`
          : `Will be visible to all users as contribution by ${avatarEmoji} ${displayName}`}
      </p>

      <div className="grid gap-3">
        <div>
          <Label className="text-xs">{de ? 'Produktname *' : 'Product Name *'}</Label>
          <Input value={foodName} onChange={e => setFoodName(e.target.value)} placeholder="z.B. Hacendado Protein Joghurt" className="h-9 rounded-xl text-sm mt-1" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">{de ? 'Marke' : 'Brand'}</Label>
            <Input value={brand} onChange={e => setBrand(e.target.value)} placeholder="z.B. Hacendado" className="h-9 rounded-xl text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs">{de ? 'Laden' : 'Store'}</Label>
            <Input value={store} onChange={e => setStore(e.target.value)} placeholder="z.B. Mercadona" className="h-9 rounded-xl text-sm mt-1" />
          </div>
        </div>

        <div>
          <Label className="text-xs">Barcode</Label>
          <Input value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="8480000..." className="h-9 rounded-xl text-sm mt-1" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">{de ? 'Menge' : 'Quantity'}</Label>
            <Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="h-9 rounded-xl text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs">{de ? 'Einheit' : 'Unit'}</Label>
            <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="g, ml, Stk" className="h-9 rounded-xl text-sm mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label className="text-xs">kcal *</Label>
            <Input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="h-9 rounded-xl text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs">P (g)</Label>
            <Input type="number" value={protein} onChange={e => setProtein(e.target.value)} className="h-9 rounded-xl text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs">F (g)</Label>
            <Input type="number" value={fat} onChange={e => setFat(e.target.value)} className="h-9 rounded-xl text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs">C (g)</Label>
            <Input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} className="h-9 rounded-xl text-sm mt-1" />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving || !foodName.trim() || !calories} className="w-full rounded-xl">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
        {de ? 'Zur Community hinzufügen' : 'Add to Community'}
      </Button>
    </motion.div>
  );
}
