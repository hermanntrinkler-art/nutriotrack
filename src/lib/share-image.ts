import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a shareable achievement image using Canvas API.
 * Returns a Blob of the PNG image.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry without crossOrigin for local assets
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = reject;
      img2.src = src;
    };
    img.src = src;
  });
}

export async function generateShareImage({
  name,
  streak,
  totalMeals,
  unlockedAchievements,
  totalAchievements,
  language,
  badgeTitle,
  badgeShareText,
  badgeImageUrl,
}: {
  name: string;
  streak: number;
  totalMeals: number;
  unlockedAchievements: number;
  totalAchievements: number;
  language: 'de' | 'en';
  badgeTitle?: string;
  badgeShareText?: string;
  badgeImageUrl?: string;
}): Promise<Blob> {
  const W = 1080;
  const H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0a1628');
  bg.addColorStop(0.5, '#0f1f3a');
  bg.addColorStop(1, '#0a1628');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(W * 0.85, H * 0.15, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(W * 0.15, H * 0.85, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Top accent line
  const accent = ctx.createLinearGradient(0, 0, W, 0);
  accent.addColorStop(0, '#22c55e');
  accent.addColorStop(0.5, '#14b8a6');
  accent.addColorStop(1, '#f59e0b');
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, 6);

  // Logo text
  ctx.font = 'bold 36px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'center';
  ctx.fillText('NutrioTrack', W / 2, 80);

  // User name
  ctx.font = '600 28px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText(name, W / 2, 125);

  if (badgeTitle && badgeShareText) {
    // === Single badge share mode ===
    const badgeImg = badgeImageUrl ? await loadImage(badgeImageUrl) : null;
    drawBadgeShareLayout(ctx, W, H, { badgeTitle, badgeShareText, streak, totalMeals, unlockedAchievements, totalAchievements, language, badgeImg });
  } else {
    // === General overview mode ===
    drawOverviewLayout(ctx, W, H, { streak, totalMeals, unlockedAchievements, totalAchievements, language });
  }

  // Bottom CTA
  ctx.font = '500 20px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.textAlign = 'center';
  ctx.fillText(
    language === 'de' ? 'Tracke deine Ernährung mit NutrioTrack 🌱' : 'Track your nutrition with NutrioTrack 🌱',
    W / 2, H - 50
  );

  // Bottom accent line
  ctx.fillStyle = accent;
  ctx.fillRect(0, H - 6, W, 6);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

function drawBadgeShareLayout(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  opts: { badgeTitle: string; badgeShareText: string; streak: number; totalMeals: number; unlockedAchievements: number; totalAchievements: number; language: 'de' | 'en'; badgeImg: HTMLImageElement | null }
) {
  const centerY = 380;

  // Badge unlocked label
  ctx.font = '600 24px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.textAlign = 'center';
  ctx.fillText(opts.language === 'de' ? 'BADGE FREIGESCHALTET' : 'BADGE UNLOCKED', W / 2, 200);

  // Glow ring
  const ringR = 100;
  const glowGrad = ctx.createRadialGradient(W / 2, centerY, ringR - 20, W / 2, centerY, ringR + 30);
  glowGrad.addColorStop(0, 'rgba(34, 197, 94, 0.15)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(W / 2, centerY, ringR + 30, 0, Math.PI * 2);
  ctx.fill();

  // Ring
  const ringGrad = ctx.createLinearGradient(W / 2 - ringR, centerY, W / 2 + ringR, centerY);
  ringGrad.addColorStop(0, '#22c55e');
  ringGrad.addColorStop(1, '#14b8a6');
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(W / 2, centerY, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Badge image or trophy emoji
  if (opts.badgeImg) {
    const imgSize = 160;
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, centerY, imgSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(opts.badgeImg, W / 2 - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
    ctx.restore();
  } else {
    ctx.font = '72px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆', W / 2, centerY + 25);
  }

  // Badge title
  ctx.font = 'bold 48px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(opts.badgeTitle, W / 2, centerY + ringR + 70);

  // Share text (wrap if needed)
  ctx.font = 'italic 600 28px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  const lines = wrapText(ctx, `"${opts.badgeShareText}"`, W - 160);
  let textY = centerY + ringR + 130;
  for (const line of lines) {
    ctx.fillText(line, W / 2, textY);
    textY += 38;
  }

  // Mini stats
  const statsY = Math.max(textY + 40, 780);
  const miniStats = [
    { label: '🔥', value: String(opts.streak) },
    { label: '🍽️', value: String(opts.totalMeals) },
    { label: '🏆', value: `${opts.unlockedAchievements}/${opts.totalAchievements}` },
  ];
  const statGap = 160;
  const startX = W / 2 - statGap;
  miniStats.forEach((s, i) => {
    const x = startX + i * statGap;
    ctx.font = '28px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.fillText(s.label, x, statsY);
    ctx.font = 'bold 28px "Inter", "SF Pro Display", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(s.value, x, statsY + 40);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
  });
}

function drawOverviewLayout(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  opts: { streak: number; totalMeals: number; unlockedAchievements: number; totalAchievements: number; language: 'de' | 'en' }
) {
  // Streak section
  const streakY = 260;
  const ringX = W / 2;
  const ringR = 110;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(ringX, streakY, ringR, 0, Math.PI * 2);
  ctx.stroke();

  const streakGrad = ctx.createLinearGradient(ringX - ringR, streakY, ringX + ringR, streakY);
  streakGrad.addColorStop(0, '#f59e0b');
  streakGrad.addColorStop(1, '#ef4444');
  ctx.strokeStyle = streakGrad;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const streakAngle = Math.min(opts.streak / 30, 1) * Math.PI * 2;
  ctx.arc(ringX, streakY, ringR, -Math.PI / 2, -Math.PI / 2 + streakAngle);
  ctx.stroke();

  ctx.font = '52px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔥', ringX, streakY - 15);

  ctx.font = 'bold 64px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(String(opts.streak), ringX, streakY + 55);

  ctx.font = '600 22px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText(opts.language === 'de' ? 'Tage Streak' : 'Day Streak', ringX, streakY + 90);

  // Stats cards
  const statsY = 480;
  const cardW = 280;
  const cardH = 140;
  const cardGap = 40;
  const cards = [
    { emoji: '🍽️', value: String(opts.totalMeals), label: opts.language === 'de' ? 'Mahlzeiten' : 'Meals', color: '#3b82f6' },
    { emoji: '🏆', value: `${opts.unlockedAchievements}/${opts.totalAchievements}`, label: 'Achievements', color: '#22c55e' },
  ];

  cards.forEach((card, i) => {
    const x = W / 2 - cardW - cardGap / 2 + i * (cardW + cardGap);
    const y = statsY;

    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    roundRect(ctx, x, y, cardW, cardH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, cardW, cardH, 20);
    ctx.stroke();

    ctx.font = '36px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.emoji, x + cardW / 2, y + 45);

    ctx.font = 'bold 36px "Inter", "SF Pro Display", -apple-system, sans-serif';
    ctx.fillStyle = card.color;
    ctx.fillText(card.value, x + cardW / 2, y + 90);

    ctx.font = '500 18px "Inter", "SF Pro Display", -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(card.label, x + cardW / 2, y + 120);
  });

  // Motivational quote
  const quoteY = 720;
  ctx.font = 'italic 600 28px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'center';
  const quote = opts.language === 'de'
    ? opts.streak >= 7 ? '„Disziplin schlägt Motivation."' : '„Jeder Tag zählt!"'
    : opts.streak >= 7 ? '"Discipline beats motivation."' : '"Every day counts!"';
  ctx.fillText(quote, W / 2, quoteY);

  // Achievement dots row
  const dotsY = 800;
  const dotR = 14;
  const dotGap = 42;
  const dotsStartX = W / 2 - ((opts.totalAchievements - 1) * dotGap) / 2;
  const achievementEmojis = ['🍽️', '🔥', '🏅', '⭐', '🏆', '🎯'];

  for (let i = 0; i < Math.min(opts.totalAchievements, 12); i++) {
    const dx = dotsStartX + i * dotGap;
    const unlocked = i < opts.unlockedAchievements;

    if (unlocked) {
      const dotGrad = ctx.createRadialGradient(dx, dotsY, 0, dx, dotsY, dotR + 4);
      dotGrad.addColorStop(0, '#22c55e40');
      dotGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = dotGrad;
      ctx.beginPath();
      ctx.arc(dx, dotsY, dotR + 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = unlocked ? '#22c55e20' : 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.arc(dx, dotsY, dotR, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `${unlocked ? 18 : 14}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.globalAlpha = unlocked ? 1 : 0.3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(achievementEmojis[i % achievementEmojis.length] || '⭐', dx, dotsY + 1);
    ctx.globalAlpha = 1;
    ctx.textBaseline = 'alphabetic';
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function shareImage(blob: Blob, language: 'de' | 'en', customShareText?: string) {
  const file = new File([blob], 'nutriotrack-achievement.png', { type: 'image/png' });

  const defaultText = language === 'de'
    ? 'Schau dir meine Fortschritte bei NutrioTrack an! 🔥💪'
    : 'Check out my progress on NutrioTrack! 🔥💪';

  const text = customShareText || defaultText;

  if (navigator.share) {
    try {
      const fileOnlyData: ShareData = { files: [file] };
      const canShareFiles = !navigator.canShare || navigator.canShare(fileOnlyData);

      // Best compatibility for Facebook target: share file only first
      if (canShareFiles) {
        await navigator.share(fileOnlyData);
        return true;
      }

      // Fallback: text share if file share is not supported
      await navigator.share({
        title: 'NutrioTrack',
        text,
      });
      return true;
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return true;
    }
  }

  // Fallback: save/open image
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nutriotrack-achievement.png';
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
    return false;
  } catch {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      // Keep URL alive briefly even if popup is blocked
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      return false;
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return true;
  }
}

/**
 * Uploads a generated Facebook share image and returns a public URL.
 */
export async function uploadShareImageForFacebook(blob: Blob, badgeId: string) {
  const filePath = `facebook-shares/${badgeId}-${Date.now()}.png`;

  const { error } = await supabase.storage
    .from('badge-images')
    .upload(filePath, blob, { contentType: 'image/png', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('badge-images').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Opens Facebook share dialog with a branded share page URL (professional preview).
 */
export async function shareImageToFacebook(
  badgeId: string,
  language: 'de' | 'en',
  shareText: string,
  imageUrlOverride?: string,
  badgeTitleOverride?: string,
  sourceOrigin?: string,
) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const cacheBuster = Date.now();
  const normalizedText = shareText.replace(/\s+/g, ' ').trim();

  const params = new URLSearchParams({
    badge: badgeId,
    lang: language,
    v: String(cacheBuster),
  });

  if (imageUrlOverride) params.set('img', imageUrlOverride);
  if (normalizedText) params.set('text', normalizedText);
  if (badgeTitleOverride) params.set('title', badgeTitleOverride);
  if (sourceOrigin) params.set('origin', sourceOrigin);

  const shareUrl = `${supabaseUrl}/functions/v1/share-badge?${params.toString()}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const popup = window.open(fbShareUrl, '_blank', 'noopener,noreferrer');
  if (!popup) {
    return false;
  }

  return true;
}

/**
 * @deprecated Use shareImage directly instead
 */
export async function shareBadgeLink(badgeId: string, language: 'de' | 'en', shareText: string) {
  const shareUrl = `${window.location.origin}/share/${badgeId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'NutrioTrack 🏆',
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch {
      // User cancelled
    }
  }

  try {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    return 'copied';
  } catch {
    return false;
  }
}
