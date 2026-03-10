import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Users, Image, Upload, Trash2, ArrowLeft, Loader2, Flag, CheckCircle, XCircle, ChevronDown, ChevronUp, Pencil, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchFoods, type FoodEntry } from '@/lib/food-database';
import { estimateMicronutrients } from '@/lib/micronutrients';

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

        <Tabs defaultValue="reports">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="reports" className="flex items-center gap-1.5">
              <Flag className="h-4 w-4" />
              Meldungen
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-1.5">
              <Image className="h-4 w-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <FoodReports />
          </TabsContent>
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

interface FoodReport {
  id: string;
  reporter_id: string;
  food_name: string;
  food_source: string;
  community_product_id: string | null;
  reason: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

function FoodReports() {
  const [reports, setReports] = useState<FoodReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const { data } = await supabase
      .from('food_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setReports(data as unknown as FoodReport[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('food_reports')
      .update({ status, resolved_at: status !== 'open' ? new Date().toISOString() : null } as any)
      .eq('id', id);
    if (error) {
      toast.error('Fehler beim Aktualisieren');
    } else {
      toast.success(`Status → ${status}`);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status, resolved_at: status !== 'open' ? new Date().toISOString() : null } : r));
    }
  };

  const deleteReport = async (id: string) => {
    const { error } = await supabase.from('food_reports').delete().eq('id', id);
    if (error) {
      toast.error('Fehler beim Löschen');
    } else {
      toast.success('Meldung gelöscht');
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateReport = async (id: string, updates: Partial<FoodReport>) => {
    const { error } = await supabase
      .from('food_reports')
      .update(updates as any)
      .eq('id', id);
    if (error) {
      toast.error('Fehler beim Speichern');
      return false;
    }
    toast.success('Meldung aktualisiert');
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    return true;
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const openReports = reports.filter(r => r.status === 'open');
  const resolvedReports = reports.filter(r => r.status !== 'open');

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="nutri-card text-center">
          <p className="text-2xl font-black text-destructive">{openReports.length}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Offen</p>
        </div>
        <div className="nutri-card text-center">
          <p className="text-2xl font-black text-primary">{resolvedReports.length}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Erledigt</p>
        </div>
        <div className="nutri-card text-center">
          <p className="text-2xl font-black text-foreground">{reports.length}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Gesamt</p>
        </div>
      </div>

      {reports.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">Keine Meldungen vorhanden</p>
      )}

      {/* Open reports */}
      {openReports.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Flag className="h-4 w-4 text-destructive" />
            Offene Meldungen ({openReports.length})
          </h3>
          {openReports.map(report => (
            <ReportCard key={report.id} report={report} onUpdateStatus={updateStatus} onDelete={deleteReport} onUpdate={updateReport} />
          ))}
        </div>
      )}

      {/* Resolved reports */}
      {resolvedReports.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            Erledigte Meldungen ({resolvedReports.length})
          </h3>
          {resolvedReports.map(report => (
            <ReportCard key={report.id} report={report} onUpdateStatus={updateStatus} onDelete={deleteReport} onUpdate={updateReport} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportCard({ report, onUpdateStatus, onDelete, onUpdate }: { 
  report: FoodReport; 
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FoodReport>) => Promise<boolean>;
}) {
  const isOpen = report.status === 'open';
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(report.food_name);
  const [editReason, setEditReason] = useState(report.reason || '');
  const [editSource, setEditSource] = useState(report.food_source);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [productData, setProductData] = useState<{
    calories: number; protein_g: number; fat_g: number; carbs_g: number;
    quantity: number; unit: string; brand?: string; store?: string; food_name?: string;
  } | null>(null);
  const [editProduct, setEditProduct] = useState<typeof productData>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const isCommunity = !!report.community_product_id;

  useEffect(() => {
    if (!expanded || productData) return;
    const loadProduct = async () => {
      setLoadingProduct(true);
      if (report.community_product_id) {
        const { data } = await supabase
          .from('community_products')
          .select('food_name, calories, protein_g, fat_g, carbs_g, quantity, unit, brand, store')
          .eq('id', report.community_product_id)
          .single();
        if (data) { setProductData(data as any); setLoadingProduct(false); return; }
      }
      const results = searchFoods(report.food_name, 'de');
      if (results.length > 0) {
        const f = results[0];
        setProductData({ food_name: f.name, calories: f.calories, protein_g: f.protein_g, fat_g: f.fat_g, carbs_g: f.carbs_g, quantity: f.quantity, unit: f.unit });
      }
      setLoadingProduct(false);
    };
    loadProduct();
  }, [expanded]);

  const micros = useMemo(() => {


    const grams = productData.unit === 'g' || productData.unit === 'ml' ? productData.quantity : 100;
    return estimateMicronutrients(report.food_name, grams);
  }, [productData, report.food_name]);

  const handleSaveReport = async () => {
    const ok = await onUpdate(report.id, { food_name: editName, reason: editReason || null, food_source: editSource });
    if (ok) setEditing(false);
  };

  const handleSaveProduct = async () => {
    if (!editProduct || !report.community_product_id) return;
    setSavingProduct(true);
    const { error } = await supabase
      .from('community_products')
      .update({
        food_name: editProduct.food_name || report.food_name,
        calories: Number(editProduct.calories),
        protein_g: Number(editProduct.protein_g),
        fat_g: Number(editProduct.fat_g),
        carbs_g: Number(editProduct.carbs_g),
        quantity: Number(editProduct.quantity),
        unit: editProduct.unit,
        brand: editProduct.brand || null,
        store: editProduct.store || null,
      } as any)
      .eq('id', report.community_product_id);
    setSavingProduct(false);
    if (error) {
      toast.error('Fehler beim Speichern der Produktdaten');
    } else {
      toast.success('Produktdaten aktualisiert!');
      setProductData({ ...editProduct });
      setEditProduct(null);
    }
  };

  const startEditProduct = () => {
    if (productData) setEditProduct({ ...productData });
  };

  const NutritionRow = ({ label, value, unit }: { label: string; value: number | string; unit: string }) => (
    <div className="flex justify-between text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value} {unit}</span>
    </div>
  );

  const EditField = ({ label, value, onChange, unit, type = 'number' }: { label: string; value: string | number; onChange: (v: string) => void; unit: string; type?: string }) => (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-muted-foreground w-24 shrink-0">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 p-1.5 rounded-md border border-border bg-background text-xs text-right"
        step={type === 'number' ? '0.1' : undefined}
      />
      <span className="text-muted-foreground text-[10px] w-6 shrink-0">{unit}</span>
    </div>
  );

  return (
    <div className={`border rounded-xl bg-card transition-colors ${isOpen ? 'border-destructive/30' : 'border-border opacity-70'}`}>
      <button
        onClick={() => { setExpanded(!expanded); setConfirmDelete(false); }}
        className="w-full p-3 flex items-center justify-between gap-2 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm">{report.food_name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium">{report.food_source}</span>
            <span>📅 {new Date(report.created_at).toLocaleDateString('de-DE')}</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          {/* Report meta editing */}
          {editing ? (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Produktname</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full mt-0.5 text-sm p-2 rounded-lg border border-border bg-background" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Quelle</label>
                <input value={editSource} onChange={e => setEditSource(e.target.value)} className="w-full mt-0.5 text-sm p-2 rounded-lg border border-border bg-background" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Grund / Notiz</label>
                <textarea value={editReason} onChange={e => setEditReason(e.target.value)} className="w-full mt-0.5 text-sm p-2 rounded-lg border border-border bg-background resize-none" rows={3} placeholder="Grund der Meldung..." />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveReport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                  <Save className="h-3.5 w-3.5" /> Speichern
                </button>
                <button onClick={() => { setEditing(false); setEditName(report.food_name); setEditReason(report.reason || ''); setEditSource(report.food_source); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                  <X className="h-3.5 w-3.5" /> Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Report info */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-bold ${isOpen ? 'text-destructive' : 'text-primary'}`}>
                    {report.status === 'open' ? 'Offen' : report.status === 'resolved' ? 'Erledigt' : 'Verworfen'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gemeldet am</span>
                  <span className="font-medium">{new Date(report.created_at).toLocaleString('de-DE')}</span>
                </div>
                {report.resolved_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Erledigt am</span>
                    <span className="font-medium">{new Date(report.resolved_at).toLocaleString('de-DE')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Melder-ID</span>
                  <span className="font-mono text-[10px]">{report.reporter_id.slice(0, 8)}…</span>
                </div>
                {report.community_product_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Produkt-ID</span>
                    <span className="font-mono text-[10px]">{report.community_product_id.slice(0, 8)}…</span>
                  </div>
                )}
                {report.reason && (
                  <div className="pt-1">
                    <span className="text-muted-foreground">Grund:</span>
                    <p className="mt-0.5 text-foreground">{report.reason}</p>
                  </div>
                )}
              </div>

              {/* Product nutritional data */}
              {loadingProduct ? (
                <div className="flex justify-center py-3"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
              ) : productData ? (
                <div className="space-y-2">
                  {/* Editable product data */}
                  {editProduct ? (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-2">
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">Nährwerte bearbeiten</p>
                      <EditField label="Produktname" value={editProduct.food_name || ''} onChange={v => setEditProduct(p => p ? { ...p, food_name: v } : p)} unit="" type="text" />
                      <EditField label="Marke" value={editProduct.brand || ''} onChange={v => setEditProduct(p => p ? { ...p, brand: v } : p)} unit="" type="text" />
                      <EditField label="Geschäft" value={editProduct.store || ''} onChange={v => setEditProduct(p => p ? { ...p, store: v } : p)} unit="" type="text" />
                      <div className="border-t border-border pt-2 mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-muted-foreground w-24 shrink-0">Menge</span>
                          <input type="number" value={editProduct.quantity} onChange={e => setEditProduct(p => p ? { ...p, quantity: Number(e.target.value) } : p)} className="flex-1 p-1.5 rounded-md border border-border bg-background text-xs text-right" />
                          <input type="text" value={editProduct.unit} onChange={e => setEditProduct(p => p ? { ...p, unit: e.target.value } : p)} className="w-12 p-1.5 rounded-md border border-border bg-background text-xs text-center" />
                        </div>
                        <EditField label="Kalorien" value={editProduct.calories} onChange={v => setEditProduct(p => p ? { ...p, calories: Number(v) } : p)} unit="kcal" />
                        <EditField label="Protein" value={editProduct.protein_g} onChange={v => setEditProduct(p => p ? { ...p, protein_g: Number(v) } : p)} unit="g" />
                        <EditField label="Fett" value={editProduct.fat_g} onChange={v => setEditProduct(p => p ? { ...p, fat_g: Number(v) } : p)} unit="g" />
                        <EditField label="Kohlenhydrate" value={editProduct.carbs_g} onChange={v => setEditProduct(p => p ? { ...p, carbs_g: Number(v) } : p)} unit="g" />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={handleSaveProduct} disabled={savingProduct} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                          {savingProduct ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Produktdaten speichern
                        </button>
                        <button onClick={() => setEditProduct(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                          <X className="h-3.5 w-3.5" /> Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">
                            Nährwerte pro {productData.quantity} {productData.unit}
                          </p>
                          {isCommunity && (
                            <button onClick={startEditProduct} className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors">
                              <Pencil className="h-3 w-3" /> Bearbeiten
                            </button>
                          )}
                        </div>
                        {productData.brand && <NutritionRow label="Marke" value={productData.brand} unit="" />}
                        {productData.store && <NutritionRow label="Geschäft" value={productData.store} unit="" />}
                        <NutritionRow label="Kalorien" value={Number(productData.calories).toFixed(0)} unit="kcal" />
                        <NutritionRow label="Protein" value={Number(productData.protein_g).toFixed(1)} unit="g" />
                        <NutritionRow label="Fett" value={Number(productData.fat_g).toFixed(1)} unit="g" />
                        <NutritionRow label="Kohlenhydrate" value={Number(productData.carbs_g).toFixed(1)} unit="g" />
                      </div>
                      {!isCommunity && (
                        <p className="text-[10px] text-muted-foreground italic">ℹ️ Nur Community-Produkte können bearbeitet werden</p>
                      )}
                    </>
                  )}

                  {micros && !editProduct && (
                    <>
                      <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Vitamine (geschätzt)</p>
                        <NutritionRow label="Vitamin A" value={micros.vitaminA_ug} unit="µg" />
                        <NutritionRow label="Vitamin B1" value={micros.vitaminB1_mg} unit="mg" />
                        <NutritionRow label="Vitamin B2" value={micros.vitaminB2_mg} unit="mg" />
                        <NutritionRow label="Vitamin B6" value={micros.vitaminB6_mg} unit="mg" />
                        <NutritionRow label="Vitamin B12" value={micros.vitaminB12_ug} unit="µg" />
                        <NutritionRow label="Vitamin C" value={micros.vitaminC_mg} unit="mg" />
                        <NutritionRow label="Vitamin D" value={micros.vitaminD_ug} unit="µg" />
                        <NutritionRow label="Vitamin E" value={micros.vitaminE_mg} unit="mg" />
                        <NutritionRow label="Vitamin K" value={micros.vitaminK_ug} unit="µg" />
                        <NutritionRow label="Folsäure" value={micros.folate_ug} unit="µg" />
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Mineralstoffe (geschätzt)</p>
                        <NutritionRow label="Eisen" value={micros.iron_mg} unit="mg" />
                        <NutritionRow label="Kalzium" value={micros.calcium_mg} unit="mg" />
                        <NutritionRow label="Magnesium" value={micros.magnesium_mg} unit="mg" />
                        <NutritionRow label="Zink" value={micros.zinc_mg} unit="mg" />
                        <NutritionRow label="Kalium" value={micros.potassium_mg} unit="mg" />
                        <NutritionRow label="Natrium" value={micros.sodium_mg} unit="mg" />
                        <NutritionRow label="Phosphor" value={micros.phosphorus_mg} unit="mg" />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">Keine Produktdaten gefunden</p>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {isOpen ? (
                  <>
                    <button onClick={() => onUpdateStatus(report.id, 'resolved')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5" /> Erledigt
                    </button>
                    <button onClick={() => onUpdateStatus(report.id, 'dismissed')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                      <XCircle className="h-3.5 w-3.5" /> Verwerfen
                    </button>
                  </>
                ) : (
                  <button onClick={() => onUpdateStatus(report.id, 'open')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                    <Flag className="h-3.5 w-3.5" /> Wieder öffnen
                  </button>
                )}
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/80 transition-colors">
                  <Pencil className="h-3.5 w-3.5" /> Meldung
                </button>
                {confirmDelete ? (
                  <button onClick={() => onDelete(report.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 transition-colors animate-pulse">
                    <Trash2 className="h-3.5 w-3.5" /> Wirklich löschen?
                  </button>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> Löschen
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

      reason: editReason || null,
      food_source: editSource,
    });
    if (ok) setEditing(false);
  };

  const NutritionRow = ({ label, value, unit }: { label: string; value: number | string; unit: string }) => (
    <div className="flex justify-between text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value} {unit}</span>
    </div>
  );

  return (
    <div className={`border rounded-xl bg-card transition-colors ${isOpen ? 'border-destructive/30' : 'border-border opacity-70'}`}>
      {/* Header */}
      <button
        onClick={() => { setExpanded(!expanded); setConfirmDelete(false); }}
        className="w-full p-3 flex items-center justify-between gap-2 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm">{report.food_name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium">{report.food_source}</span>
            <span>📅 {new Date(report.created_at).toLocaleDateString('de-DE')}</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          {editing ? (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Produktname</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full mt-0.5 text-sm p-2 rounded-lg border border-border bg-background" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Quelle</label>
                <input value={editSource} onChange={e => setEditSource(e.target.value)} className="w-full mt-0.5 text-sm p-2 rounded-lg border border-border bg-background" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Grund / Notiz</label>
                <textarea value={editReason} onChange={e => setEditReason(e.target.value)} className="w-full mt-0.5 text-sm p-2 rounded-lg border border-border bg-background resize-none" rows={3} placeholder="Grund der Meldung..." />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                  <Save className="h-3.5 w-3.5" /> Speichern
                </button>
                <button onClick={() => { setEditing(false); setEditName(report.food_name); setEditReason(report.reason || ''); setEditSource(report.food_source); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                  <X className="h-3.5 w-3.5" /> Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Report info */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-bold ${isOpen ? 'text-destructive' : 'text-primary'}`}>
                    {report.status === 'open' ? 'Offen' : report.status === 'resolved' ? 'Erledigt' : 'Verworfen'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gemeldet am</span>
                  <span className="font-medium">{new Date(report.created_at).toLocaleString('de-DE')}</span>
                </div>
                {report.resolved_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Erledigt am</span>
                    <span className="font-medium">{new Date(report.resolved_at).toLocaleString('de-DE')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Melder-ID</span>
                  <span className="font-mono text-[10px]">{report.reporter_id.slice(0, 8)}…</span>
                </div>
                {report.community_product_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Produkt-ID</span>
                    <span className="font-mono text-[10px]">{report.community_product_id.slice(0, 8)}…</span>
                  </div>
                )}
                {report.reason && (
                  <div className="pt-1">
                    <span className="text-muted-foreground">Grund:</span>
                    <p className="mt-0.5 text-foreground">{report.reason}</p>
                  </div>
                )}
              </div>

              {/* Product nutritional data */}
              {loadingProduct ? (
                <div className="flex justify-center py-3"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
              ) : productData ? (
                <div className="space-y-2">
                  <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">
                      Nährwerte pro {productData.quantity} {productData.unit}
                    </p>
                    {productData.brand && <NutritionRow label="Marke" value={productData.brand} unit="" />}
                    {productData.store && <NutritionRow label="Geschäft" value={productData.store} unit="" />}
                    <NutritionRow label="Kalorien" value={Number(productData.calories).toFixed(0)} unit="kcal" />
                    <NutritionRow label="Protein" value={Number(productData.protein_g).toFixed(1)} unit="g" />
                    <NutritionRow label="Fett" value={Number(productData.fat_g).toFixed(1)} unit="g" />
                    <NutritionRow label="Kohlenhydrate" value={Number(productData.carbs_g).toFixed(1)} unit="g" />
                  </div>

                  {micros && (
                    <>
                      <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Vitamine (geschätzt)</p>
                        <NutritionRow label="Vitamin A" value={micros.vitaminA_ug} unit="µg" />
                        <NutritionRow label="Vitamin B1" value={micros.vitaminB1_mg} unit="mg" />
                        <NutritionRow label="Vitamin B2" value={micros.vitaminB2_mg} unit="mg" />
                        <NutritionRow label="Vitamin B6" value={micros.vitaminB6_mg} unit="mg" />
                        <NutritionRow label="Vitamin B12" value={micros.vitaminB12_ug} unit="µg" />
                        <NutritionRow label="Vitamin C" value={micros.vitaminC_mg} unit="mg" />
                        <NutritionRow label="Vitamin D" value={micros.vitaminD_ug} unit="µg" />
                        <NutritionRow label="Vitamin E" value={micros.vitaminE_mg} unit="mg" />
                        <NutritionRow label="Vitamin K" value={micros.vitaminK_ug} unit="µg" />
                        <NutritionRow label="Folsäure" value={micros.folate_ug} unit="µg" />
                      </div>

                      <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Mineralstoffe (geschätzt)</p>
                        <NutritionRow label="Eisen" value={micros.iron_mg} unit="mg" />
                        <NutritionRow label="Kalzium" value={micros.calcium_mg} unit="mg" />
                        <NutritionRow label="Magnesium" value={micros.magnesium_mg} unit="mg" />
                        <NutritionRow label="Zink" value={micros.zinc_mg} unit="mg" />
                        <NutritionRow label="Kalium" value={micros.potassium_mg} unit="mg" />
                        <NutritionRow label="Natrium" value={micros.sodium_mg} unit="mg" />
                        <NutritionRow label="Phosphor" value={micros.phosphorus_mg} unit="mg" />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">Keine Produktdaten gefunden</p>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {isOpen ? (
                  <>
                    <button onClick={() => onUpdateStatus(report.id, 'resolved')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5" /> Erledigt
                    </button>
                    <button onClick={() => onUpdateStatus(report.id, 'dismissed')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                      <XCircle className="h-3.5 w-3.5" /> Verwerfen
                    </button>
                  </>
                ) : (
                  <button onClick={() => onUpdateStatus(report.id, 'open')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                    <Flag className="h-3.5 w-3.5" /> Wieder öffnen
                  </button>
                )}
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/80 transition-colors">
                  <Pencil className="h-3.5 w-3.5" /> Bearbeiten
                </button>
                {confirmDelete ? (
                  <button onClick={() => onDelete(report.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 transition-colors animate-pulse">
                    <Trash2 className="h-3.5 w-3.5" /> Wirklich löschen?
                  </button>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> Löschen
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}