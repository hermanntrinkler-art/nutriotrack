import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Users, Image, Upload, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Static badge imports for preview
import badgeFirstMeal from '@/assets/badges/first-meal.png';
import badgeStreak3 from '@/assets/badges/streak-3.png';
import badgeStreak7 from '@/assets/badges/streak-7.png';
import badgeStreak14 from '@/assets/badges/streak-14.png';
import badgeStreak30 from '@/assets/badges/streak-30.png';
import badgeStreak60 from '@/assets/badges/streak-60.png';
import badgeStreak100 from '@/assets/badges/streak-100.png';
import badgeMeal10 from '@/assets/badges/meal-10.png';
import badgeMeal25 from '@/assets/badges/meal-25.png';
import badgeMeal50 from '@/assets/badges/meal-50.png';
import badgeMeal100 from '@/assets/badges/meal-100.png';
import badgeMeal500 from '@/assets/badges/meal-500.png';
import badgeWeight1 from '@/assets/badges/weight-1.png';
import badgeWeight5 from '@/assets/badges/weight-5.png';
import badgeWeight10 from '@/assets/badges/weight-10.png';
import badgeWeight15 from '@/assets/badges/weight-15.png';
import badgeWeight20 from '@/assets/badges/weight-20.png';
import badgeWeight25 from '@/assets/badges/weight-25.png';
import badgeGoalReached from '@/assets/badges/goal-reached.png';
import badgeWeek1 from '@/assets/badges/week-1.png';
import badgeMonth1 from '@/assets/badges/month-1.png';
import badgeQuarter from '@/assets/badges/quarter.png';
import badgeMonth6 from '@/assets/badges/month-6.png';
import badgeProfilePic from '@/assets/badges/profile-pic.png';

const BADGE_DEFINITIONS = [
  { id: 'streak_3', title: '3-Day Streak', fallback: badgeStreak3 },
  { id: 'streak_7', title: '7-Day Streak', fallback: badgeStreak7 },
  { id: 'streak_14', title: '14-Day Streak', fallback: badgeStreak14 },
  { id: 'streak_30', title: '30-Day Streak', fallback: badgeStreak30 },
  { id: 'streak_60', title: '60-Day Streak', fallback: badgeStreak60 },
  { id: 'streak_100', title: '100-Day Streak', fallback: badgeStreak100 },
  { id: 'meal_1', title: 'First Meal', fallback: badgeFirstMeal },
  { id: 'meal_10', title: '10 Meals', fallback: badgeMeal10 },
  { id: 'meal_25', title: '25 Meals', fallback: badgeMeal25 },
  { id: 'meal_50', title: '50 Meals', fallback: badgeMeal50 },
  { id: 'meal_100', title: '100 Meals', fallback: badgeMeal100 },
  { id: 'meal_500', title: '500 Meals', fallback: badgeMeal500 },
  { id: 'weight_1', title: '1 kg Milestone', fallback: badgeWeight1 },
  { id: 'weight_5', title: '5 kg Milestone', fallback: badgeWeight5 },
  { id: 'weight_10', title: '10 kg Milestone', fallback: badgeWeight10 },
  { id: 'weight_15', title: '15 kg Milestone', fallback: badgeWeight15 },
  { id: 'weight_20', title: '20 kg Milestone', fallback: badgeWeight20 },
  { id: 'weight_25', title: '25 kg Milestone', fallback: badgeWeight25 },
  { id: 'goal_reached', title: 'Goal Reached!', fallback: badgeGoalReached },
  { id: 'week_1', title: 'First Week', fallback: badgeWeek1 },
  { id: 'month_1', title: 'First Month', fallback: badgeMonth1 },
  { id: 'quarter', title: '3 Months', fallback: badgeQuarter },
  { id: 'month_6', title: '6 Months', fallback: badgeMonth6 },
  { id: 'profile_pic', title: 'Profile Pic', fallback: badgeProfilePic },
];

interface UserStats {
  user_id: string;
  name: string | null;
  email: string | null;
  created_at: string;
  subscription_status: string;
  meal_count: number;
  last_meal_date: string | null;
}

interface BadgeImageRecord {
  badge_id: string;
  image_url: string;
}

export default function AdminPage() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { loading: authLoading } = useAuth();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </div>

        <Tabs defaultValue="badges">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="badges" className="flex items-center gap-1.5">
              <Image className="h-4 w-4" />
              Badge Images
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              User Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges">
            <BadgeManager />
          </TabsContent>
          <TabsContent value="users">
            <UserAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BadgeManager() {
  const [badgeImages, setBadgeImages] = useState<Record<string, string>>({});
  const [badgeShareTexts, setBadgeShareTexts] = useState<Record<string, string>>({});
  const [editingText, setEditingText] = useState<string | null>(null);
  const [textDraft, setTextDraft] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadgeImages();
  }, []);

  const loadBadgeImages = async () => {
    const { data } = await supabase
      .from('badge_images')
      .select('badge_id, image_url, share_text');
    
    if (data) {
      const imgMap: Record<string, string> = {};
      const txtMap: Record<string, string> = {};
      (data as Array<{ badge_id: string; image_url: string; share_text: string | null }>).forEach(r => {
        imgMap[r.badge_id] = r.image_url;
        if (r.share_text) txtMap[r.badge_id] = r.share_text;
      });
      setBadgeImages(imgMap);
      setBadgeShareTexts(txtMap);
    }
    setLoading(false);
  };

  const handleUpload = async (badgeId: string, file: File) => {
    setUploading(badgeId);
    try {
      const ext = file.name.split('.').pop();
      const path = `${badgeId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('badge-images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('badge-images')
        .getPublicUrl(path);

      const imageUrl = urlData.publicUrl + '?t=' + Date.now();

      const { error: dbError } = await supabase
        .from('badge_images')
        .upsert({ badge_id: badgeId, image_url: imageUrl }, { onConflict: 'badge_id' });

      if (dbError) throw dbError;

      setBadgeImages(prev => ({ ...prev, [badgeId]: imageUrl }));
      toast.success(`Badge "${badgeId}" aktualisiert!`);
    } catch (err: any) {
      toast.error(err.message || 'Upload fehlgeschlagen');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (badgeId: string) => {
    try {
      await supabase.from('badge_images').delete().eq('badge_id', badgeId);
      const extensions = ['png', 'jpg', 'jpeg', 'webp'];
      for (const ext of extensions) {
        await supabase.storage.from('badge-images').remove([`${badgeId}.${ext}`]);
      }
      setBadgeImages(prev => { const next = { ...prev }; delete next[badgeId]; return next; });
      setBadgeShareTexts(prev => { const next = { ...prev }; delete next[badgeId]; return next; });
      toast.success('Badge zurückgesetzt auf Standard');
    } catch {
      toast.error('Fehler beim Zurücksetzen');
    }
  };

  const handleSaveShareText = async (badgeId: string) => {
    try {
      // Check if record exists
      const existingImage = badgeImages[badgeId];
      if (existingImage) {
        await supabase
          .from('badge_images')
          .update({ share_text: textDraft || null })
          .eq('badge_id', badgeId);
      } else {
        // Create record with a placeholder image URL
        await supabase
          .from('badge_images')
          .upsert({ badge_id: badgeId, image_url: '', share_text: textDraft || null }, { onConflict: 'badge_id' });
      }
      setBadgeShareTexts(prev => textDraft ? { ...prev, [badgeId]: textDraft } : (() => { const n = { ...prev }; delete n[badgeId]; return n; })());
      setEditingText(null);
      toast.success('Share-Text gespeichert!');
    } catch {
      toast.error('Fehler beim Speichern');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Klicke auf ein Badge, um ein eigenes Bild hochzuladen. Bearbeite den Share-Text, der beim Teilen auf Social Media erscheint.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BADGE_DEFINITIONS.map(badge => {
          const customUrl = badgeImages[badge.id];
          const customText = badgeShareTexts[badge.id];
          const isUploading = uploading === badge.id;
          const isEditingThis = editingText === badge.id;

          return (
            <div
              key={badge.id}
              className="relative border border-border rounded-xl p-3 flex flex-col items-center gap-2 bg-card"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                <img src={customUrl || badge.fallback} alt={badge.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-bold text-center leading-tight">{badge.title}</span>
              {customUrl && <span className="text-[9px] text-primary font-medium">Custom</span>}
              {customText && <span className="text-[9px] text-muted-foreground">✏️ Custom Text</span>}
              
              {/* Edit share text */}
              {isEditingThis ? (
                <div className="w-full space-y-1">
                  <textarea
                    value={textDraft}
                    onChange={e => setTextDraft(e.target.value)}
                    className="w-full text-[10px] p-1.5 rounded-md border border-border bg-background resize-none"
                    rows={2}
                    placeholder="Share-Text..."
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSaveShareText(badge.id)}
                      className="flex-1 text-[9px] font-bold px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => setEditingText(null)}
                      className="text-[9px] font-bold px-2 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingText(badge.id); setTextDraft(customText || ''); }}
                  className="text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  ✏️ Share-Text
                </button>
              )}

              <div className="flex gap-1.5">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(badge.id, file);
                      e.target.value = '';
                    }}
                    disabled={isUploading}
                  />
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-colors">
                    {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    Upload
                  </span>
                </label>
                {customUrl && (
                  <button
                    onClick={() => handleDelete(badge.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-[10px] font-bold hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UserAnalytics() {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // Get all profiles (admin can see all)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, name, email, created_at, subscription_status')
      .order('created_at', { ascending: false });

    if (!profiles) {
      setLoading(false);
      return;
    }

    // Get meal counts per user
    const { data: mealData } = await supabase
      .from('meal_entries')
      .select('user_id, entry_date');

    const mealCountMap: Record<string, { count: number; lastDate: string | null }> = {};
    if (mealData) {
      for (const entry of mealData) {
        if (!mealCountMap[entry.user_id]) {
          mealCountMap[entry.user_id] = { count: 0, lastDate: null };
        }
        mealCountMap[entry.user_id].count++;
        const d = entry.entry_date;
        if (!mealCountMap[entry.user_id].lastDate || d > mealCountMap[entry.user_id].lastDate!) {
          mealCountMap[entry.user_id].lastDate = d;
        }
      }
    }

    const stats: UserStats[] = profiles.map(p => ({
      user_id: p.user_id,
      name: p.name,
      email: p.email,
      created_at: p.created_at,
      subscription_status: p.subscription_status,
      meal_count: mealCountMap[p.user_id]?.count || 0,
      last_meal_date: mealCountMap[p.user_id]?.lastDate || null,
    }));

    setUsers(stats);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="nutri-card text-center">
          <p className="text-2xl font-black text-primary">{users.length}</p>
          <p className="text-[10px] text-muted-foreground font-medium">User gesamt</p>
        </div>
        <div className="nutri-card text-center">
          <p className="text-2xl font-black text-primary">
            {users.filter(u => u.subscription_status === 'active').length}
          </p>
          <p className="text-[10px] text-muted-foreground font-medium">Pro Abos</p>
        </div>
        <div className="nutri-card text-center">
          <p className="text-2xl font-black text-primary">
            {users.reduce((sum, u) => sum + u.meal_count, 0)}
          </p>
          <p className="text-[10px] text-muted-foreground font-medium">Mahlzeiten</p>
        </div>
      </div>

      {/* User list */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Alle Nutzer ({users.length})
        </h3>
        {users.map(u => (
          <div key={u.user_id} className="border border-border rounded-xl p-3 bg-card">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{u.name || 'Unbekannt'}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email || '–'}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                u.subscription_status === 'active' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {u.subscription_status === 'active' ? 'Pro' : 'Free'}
              </span>
            </div>
            <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
              <span>🍽️ {u.meal_count} Mahlzeiten</span>
              <span>📅 Seit {new Date(u.created_at).toLocaleDateString('de-DE')}</span>
              {u.last_meal_date && (
                <span>🕐 Letztes Meal: {new Date(u.last_meal_date).toLocaleDateString('de-DE')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
