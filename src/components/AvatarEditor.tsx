import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/haptics';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJI_OPTIONS = [
  '😊', '😎', '🤓', '🧑‍🍳', '💪', '🏃', '🥗', '🔥',
  '🌟', '🦁', '🐱', '🐶', '🦊', '🐸', '🍀', '🌈',
  '🎯', '🏆', '❤️', '🦄', '🐼', '🦋', '🌸', '🍕',
];

export default function AvatarEditor() {
  const { user, profile, refreshProfile } = useAuth();
  const { language } = useTranslation();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [selectedEmoji, setSelectedEmoji] = useState(profile?.avatar_emoji || '😊');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(language === 'de' ? 'Bild max. 2MB' : 'Image max 2MB');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) {
      toast.error(language === 'de' ? 'Upload fehlgeschlagen' : 'Upload failed');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
    setUploading(false);
    hapticFeedback('success');
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    hapticFeedback('light');
  };

  const handleSave = async () => {
    if (!user) return;
    if (!displayName.trim()) {
      toast.error(language === 'de' ? 'Bitte gib einen Künstlernamen ein' : 'Please enter a display name');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      display_name: displayName.trim(),
      avatar_emoji: selectedEmoji,
      avatar_url: avatarUrl || null,
    } as any).eq('user_id', user.id);

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Failed to save');
    } else {
      hapticFeedback('success');
      toast.success(language === 'de' ? 'Profil gespeichert! 🎉' : 'Profile saved! 🎉');
      await refreshProfile();
    }
    setSaving(false);
  };

  const hasChanges = displayName !== (profile?.display_name || '') ||
    selectedEmoji !== (profile?.avatar_emoji || '😊') ||
    avatarUrl !== (profile?.avatar_url || '');

  return (
    <div className="nutri-card space-y-4">
      <h3 className="font-bold text-sm">
        {language === 'de' ? '👤 Community-Profil' : '👤 Community Profile'}
      </h3>
      <p className="text-xs text-muted-foreground">
        {language === 'de'
          ? 'Dein Künstlername wird angezeigt, wenn du Lebensmittel zur Community-Datenbank beiträgst.'
          : 'Your display name is shown when you contribute food items to the community database.'}
      </p>

      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {avatarUrl ? (
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={avatarUrl} alt="Avatar" />
              <AvatarFallback className="text-2xl bg-primary/10">{selectedEmoji}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {selectedEmoji}
            </div>
          )}
          {avatarUrl && (
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder={language === 'de' ? 'Dein Künstlername z.B. Dido' : 'Your display name e.g. Dido'}
            className="h-10 rounded-xl text-sm"
            maxLength={30}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs h-8"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Camera className="h-3 w-3 mr-1" />}
              {language === 'de' ? 'Foto' : 'Photo'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs h-8"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectedEmoji} Emoji
            </Button>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadPhoto}
        />
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-muted/50 rounded-xl">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { setSelectedEmoji(emoji); setShowEmojiPicker(false); hapticFeedback('light'); }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                    selectedEmoji === emoji ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'hover:bg-muted'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      {displayName.trim() && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 border border-border">
          <span className="text-xs text-muted-foreground">
            {language === 'de' ? 'Vorschau:' : 'Preview:'}
          </span>
          {avatarUrl ? (
            <Avatar className="h-5 w-5">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-[10px]">{selectedEmoji}</AvatarFallback>
            </Avatar>
          ) : (
            <span className="text-sm">{selectedEmoji}</span>
          )}
          <span className="text-sm font-semibold">{displayName.trim()}</span>
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={saving || !hasChanges || !displayName.trim()}
        className="w-full rounded-xl"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
        {language === 'de' ? 'Speichern' : 'Save'}
      </Button>
    </div>
  );
}
