/**
 * Generates a shareable achievement image using Canvas API.
 * Returns a Blob of the PNG image.
 */
export async function generateShareImage({
  name,
  streak,
  totalMeals,
  unlockedAchievements,
  totalAchievements,
  language,
}: {
  name: string;
  streak: number;
  totalMeals: number;
  unlockedAchievements: number;
  totalAchievements: number;
  language: 'de' | 'en';
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

  // Streak section
  const streakY = 260;
  
  // Streak ring
  const ringX = W / 2;
  const ringR = 110;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(ringX, streakY, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Streak ring colored
  const streakGrad = ctx.createLinearGradient(ringX - ringR, streakY, ringX + ringR, streakY);
  streakGrad.addColorStop(0, '#f59e0b');
  streakGrad.addColorStop(1, '#ef4444');
  ctx.strokeStyle = streakGrad;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const streakAngle = Math.min(streak / 30, 1) * Math.PI * 2;
  ctx.arc(ringX, streakY, ringR, -Math.PI / 2, -Math.PI / 2 + streakAngle);
  ctx.stroke();

  // Fire emoji
  ctx.font = '52px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔥', ringX, streakY - 15);

  // Streak number
  ctx.font = 'bold 64px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(String(streak), ringX, streakY + 55);

  // Streak label
  ctx.font = '600 22px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText(
    language === 'de' ? 'Tage Streak' : 'Day Streak',
    ringX, streakY + 90
  );

  // Stats cards
  const statsY = 480;
  const cardW = 280;
  const cardH = 140;
  const cardGap = 40;
  const cards = [
    {
      emoji: '🍽️',
      value: String(totalMeals),
      label: language === 'de' ? 'Mahlzeiten' : 'Meals',
      color: '#3b82f6',
    },
    {
      emoji: '🏆',
      value: `${unlockedAchievements}/${totalAchievements}`,
      label: language === 'de' ? 'Achievements' : 'Achievements',
      color: '#22c55e',
    },
  ];

  cards.forEach((card, i) => {
    const x = W / 2 - cardW - cardGap / 2 + i * (cardW + cardGap);
    const y = statsY;

    // Card background
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    roundRect(ctx, x, y, cardW, cardH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, cardW, cardH, 20);
    ctx.stroke();

    // Emoji
    ctx.font = '36px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.emoji, x + cardW / 2, y + 45);

    // Value
    ctx.font = 'bold 36px "Inter", "SF Pro Display", -apple-system, sans-serif';
    ctx.fillStyle = card.color;
    ctx.fillText(card.value, x + cardW / 2, y + 90);

    // Label
    ctx.font = '500 18px "Inter", "SF Pro Display", -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(card.label, x + cardW / 2, y + 120);
  });

  // Motivational quote
  const quoteY = 720;
  ctx.font = 'italic 600 28px "Inter", "SF Pro Display", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'center';
  const quote = language === 'de'
    ? streak >= 7 ? '„Disziplin schlägt Motivation."' : '„Jeder Tag zählt!"'
    : streak >= 7 ? '"Discipline beats motivation."' : '"Every day counts!"';
  ctx.fillText(quote, W / 2, quoteY);

  // Achievement dots row
  const dotsY = 800;
  const dotR = 14;
  const dotGap = 42;
  const dotsStartX = W / 2 - ((totalAchievements - 1) * dotGap) / 2;
  const achievementEmojis = ['🍽️', '🔥', '🏅', '⭐', '🏆', '🎯'];

  for (let i = 0; i < totalAchievements; i++) {
    const dx = dotsStartX + i * dotGap;
    const unlocked = i < unlockedAchievements;

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
    ctx.fillText(achievementEmojis[i] || '⭐', dx, dotsY + 1);
    ctx.globalAlpha = 1;
    ctx.textBaseline = 'alphabetic';
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

export async function shareImage(blob: Blob, language: 'de' | 'en') {
  const file = new File([blob], 'nutriotrack-achievement.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: 'NutrioTrack',
        text: language === 'de'
          ? 'Schau dir meine Fortschritte bei NutrioTrack an! 🔥💪'
          : 'Check out my progress on NutrioTrack! 🔥💪',
        files: [file],
      });
      return true;
    } catch {
      // User cancelled or share failed
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nutriotrack-achievement.png';
  a.click();
  URL.revokeObjectURL(url);
  return false;
}
