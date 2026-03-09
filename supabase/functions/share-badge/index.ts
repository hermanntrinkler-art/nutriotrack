import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Default badge metadata (used when no custom share_text in DB)
const BADGE_DEFAULTS: Record<string, { title_de: string; title_en: string; shareText_de: string; shareText_en: string }> = {
  streak_3: { title_de: '3-Tage-Streak', title_en: '3-Day Streak', shareText_de: '3 Tage am Stück getrackt – der Anfang einer Gewohnheit! 🔥', shareText_en: '3 days tracked in a row – building a habit! 🔥' },
  streak_7: { title_de: '7-Tage-Streak', title_en: '7-Day Streak', shareText_de: '7 Tage am Stück – Disziplin zahlt sich aus! 💪🔥', shareText_en: '7 days in a row – consistency pays off! 💪🔥' },
  streak_14: { title_de: '14-Tage-Streak', title_en: '14-Day Streak', shareText_de: '2 Wochen Streak – nichts hält mich auf! ⚡', shareText_en: '2-week streak – nothing can stop me! ⚡' },
  streak_30: { title_de: '30-Tage-Streak', title_en: '30-Day Streak', shareText_de: '30 Tage Streak! Ein ganzer Monat Disziplin! 🏅', shareText_en: '30-day streak! A full month of discipline! 🏅' },
  streak_60: { title_de: '60-Tage-Streak', title_en: '60-Day Streak', shareText_de: '60 Tage ohne Pause – das ist Lifestyle! 💎', shareText_en: '60 days without a break – this is lifestyle! 💎' },
  streak_100: { title_de: '100-Tage-Streak', title_en: '100-Day Streak', shareText_de: '100 Tage Streak – absolut unstoppbar! 👑🔥', shareText_en: '100-day streak – absolutely unstoppable! 👑🔥' },
  meal_1: { title_de: 'Erste Mahlzeit', title_en: 'First Meal', shareText_de: 'Meine erste Mahlzeit mit NutrioTrack geloggt! 🍽️', shareText_en: 'Just logged my first meal with NutrioTrack! 🍽️' },
  meal_10: { title_de: '10 Mahlzeiten', title_en: '10 Meals', shareText_de: '10 Mahlzeiten getrackt – ich bleibe dran! 🥗', shareText_en: '10 meals tracked – staying consistent! 🥗' },
  meal_25: { title_de: '25 Mahlzeiten', title_en: '25 Meals', shareText_de: '25 Mahlzeiten – Silber-Status bei NutrioTrack! ⭐', shareText_en: '25 meals – Silver status on NutrioTrack! ⭐' },
  meal_50: { title_de: '50 Mahlzeiten', title_en: '50 Meals', shareText_de: '50 Mahlzeiten getrackt – Gold-Status! 🌟', shareText_en: '50 meals tracked – Gold status! 🌟' },
  meal_100: { title_de: '100 Mahlzeiten', title_en: '100 Meals', shareText_de: '100 Mahlzeiten getrackt – was für eine Reise! 🏆', shareText_en: '100 meals tracked – what a journey! 🏆' },
  meal_500: { title_de: '500 Mahlzeiten', title_en: '500 Meals', shareText_de: '500 Mahlzeiten – Diamant-Status erreicht! 💎👑', shareText_en: '500 meals – Diamond status achieved! 💎👑' },
  weight_1: { title_de: '1 kg Meilenstein', title_en: '1 kg Milestone', shareText_de: 'Erstes Kilo geschafft – der Anfang ist gemacht! ⚖️', shareText_en: 'First kg down – the journey has begun! ⚖️' },
  weight_5: { title_de: '5 kg Meilenstein', title_en: '5 kg Milestone', shareText_de: '5 kg abgenommen – der Fortschritt ist real! 💪⚖️', shareText_en: '5 kg down – the progress is real! 💪⚖️' },
  weight_10: { title_de: '10 kg Meilenstein', title_en: '10 kg Milestone', shareText_de: '10 kg Meilenstein geknackt – unglaublich! 🎯', shareText_en: '10 kg milestone crushed – incredible! 🎯' },
  weight_15: { title_de: '15 kg Meilenstein', title_en: '15 kg Milestone', shareText_de: '15 kg abgenommen – der Wahnsinn! 🔥⚖️', shareText_en: '15 kg down – absolutely amazing! 🔥⚖️' },
  weight_20: { title_de: '20 kg Meilenstein', title_en: '20 kg Milestone', shareText_de: '20 kg Meilenstein – echte Transformation! 💪🏆', shareText_en: '20 kg milestone – real transformation! 💪🏆' },
  weight_25: { title_de: '25 kg Meilenstein', title_en: '25 kg Milestone', shareText_de: '25 kg abgenommen – legendäre Leistung! 💎👑', shareText_en: '25 kg down – legendary achievement! 💎👑' },
  goal_reached: { title_de: 'Ziel erreicht!', title_en: 'Goal Reached!', shareText_de: 'Zielgewicht erreicht! Alles ist möglich! 🎯🏆', shareText_en: 'Goal weight reached! Anything is possible! 🎯🏆' },
  week_1: { title_de: 'Erste Woche', title_en: 'First Week', shareText_de: 'Erste Woche mit NutrioTrack geschafft! 📅', shareText_en: 'First week with NutrioTrack complete! 📅' },
  month_1: { title_de: 'Erster Monat', title_en: 'First Month', shareText_de: 'Einen Monat dabei – es ist zur Gewohnheit geworden! ❤️', shareText_en: 'One month in – it\'s become a habit! ❤️' },
  quarter: { title_de: '3 Monate', title_en: '3 Months', shareText_de: '3 Monate NutrioTrack – das ist jetzt Lifestyle! ✨', shareText_en: '3 months on NutrioTrack – this is lifestyle now! ✨' },
  month_6: { title_de: '6 Monate', title_en: '6 Months', shareText_de: '6 Monate NutrioTrack – absolut unaufhaltbar! 🌟🏆', shareText_en: '6 months on NutrioTrack – absolutely unstoppable! 🌟🏆' },
  profile_pic: { title_de: 'Profilbild', title_en: 'Profile Pic', shareText_de: 'Ich habe mein Profilbild bei NutrioTrack gesetzt! 📸', shareText_en: 'I set my profile picture on NutrioTrack! 📸' },
}

const escapeHtmlAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\s+/g, ' ')
    .trim()

const escapeHtmlText = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const badgeId = url.searchParams.get('badge')
    const lang = url.searchParams.get('lang') || 'de'
    const imageOverride = url.searchParams.get('img')
    const textOverride = url.searchParams.get('text')
    const titleOverride = url.searchParams.get('title')
    const originOverride = url.searchParams.get('origin')

    if (!badgeId) {
      return new Response('Missing badge parameter', { status: 400, headers: corsHeaders })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    // Get custom data from DB
    const { data: badgeData } = await supabase
      .from('badge_images')
      .select('image_url, share_text')
      .eq('badge_id', badgeId)
      .maybeSingle()

    const defaults = BADGE_DEFAULTS[badgeId]
    if (!defaults) {
      return new Response('Unknown badge', { status: 404, headers: corsHeaders })
    }

    const isDE = lang === 'de'
    const title = titleOverride || (isDE ? defaults.title_de : defaults.title_en)

    // Determine share text: URL override -> custom DB text -> default
    let shareText: string
    const customShareText = badgeData?.share_text

    if (textOverride) {
      shareText = textOverride
    } else if (customShareText && !isDE) {
      // Check for cached translation
      const { data: cached } = await supabase
        .from('badge_share_translations')
        .select('translated_text')
        .eq('badge_id', badgeId)
        .eq('language', lang)
        .maybeSingle()

      if (cached) {
        shareText = cached.translated_text
      } else {
        // Try to translate via edge function
        try {
          const translateUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/translate-badge-text`
          const translateRes = await fetch(translateUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({ badge_id: badgeId, source_text: customShareText, target_language: lang }),
          })
          const translateData = await translateRes.json()
          shareText = translateData.translated_text || customShareText
        } catch {
          shareText = customShareText
        }
      }
    } else {
      shareText = customShareText || (isDE ? defaults.shareText_de : defaults.shareText_en)
    }

    // Build OG image URL - prioritize direct URL override
    const ogImage = imageOverride || badgeData?.image_url || `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/badge-images/${badgeId}.png`

    const ogTitleRaw = `${title} – NutrioTrack 🏆`
    const ogDescriptionRaw = shareText

    const ogTitle = escapeHtmlAttr(ogTitleRaw)
    const ogDescription = escapeHtmlAttr(ogDescriptionRaw)
    const ogImageEscaped = escapeHtmlAttr(ogImage)
    const bodyTitle = escapeHtmlText(title)
    const bodyShareText = escapeHtmlText(shareText)

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${ogTitle}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDescription}" />
  <meta property="og:image" content="${ogImageEscaped}" />
  <meta property="og:image:secure_url" content="${ogImageEscaped}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDescription}" />
  <meta name="twitter:image" content="${ogImageEscaped}" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0a1628, #0f1f3a, #0a1628);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      text-align: center;
      padding: 3rem 2rem;
      max-width: 420px;
    }
    .badge-ring {
      width: 160px; height: 160px;
      border-radius: 50%;
      border: 4px solid #22c55e;
      margin: 0 auto 1.5rem;
      overflow: hidden;
      box-shadow: 0 0 40px rgba(34, 197, 94, 0.2);
    }
    .badge-ring img { width: 100%; height: 100%; object-fit: cover; }
    .label { 
      font-size: 0.75rem; letter-spacing: 0.15em; 
      color: rgba(255,255,255,0.4); text-transform: uppercase; 
      margin-bottom: 0.5rem; 
    }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
    .share-text { 
      font-size: 1.1rem; font-style: italic; 
      color: rgba(255,255,255,0.7); margin-bottom: 2rem; 
      line-height: 1.6;
    }
    .cta {
      display: inline-block;
      padding: 0.875rem 2rem;
      background: linear-gradient(135deg, #22c55e, #14b8a6);
      color: white;
      font-weight: 700;
      font-size: 1rem;
      border-radius: 9999px;
      text-decoration: none;
      transition: transform 0.2s;
    }
    .cta:hover { transform: scale(1.05); }
    .logo { font-size: 0.875rem; color: #22c55e; font-weight: 700; margin-top: 2rem; }
  </style>
</head>
<body>
  <div class="card">
    <p class="label">${isDE ? 'BADGE FREIGESCHALTET' : 'BADGE UNLOCKED'}</p>
    <div class="badge-ring">
      <img src="${ogImageEscaped}" alt="${bodyTitle}" />
    </div>
    <h1>${bodyTitle}</h1>
    <p class="share-text">"${bodyShareText}"</p>
    <a href="/" class="cta">${isDE ? 'Jetzt auch tracken!' : 'Start tracking too!'}</a>
    <p class="logo">NutrioTrack 🌱</p>
  </div>
</body>
</html>`

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
