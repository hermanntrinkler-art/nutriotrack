import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { badge_id, source_text, target_language } = await req.json()

    if (!badge_id || !source_text || !target_language) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If target is German, return source directly
    if (target_language === 'de') {
      return new Response(JSON.stringify({ translated_text: source_text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Check cache first
    const { data: cached } = await supabase
      .from('badge_share_translations')
      .select('translated_text')
      .eq('badge_id', badge_id)
      .eq('language', target_language)
      .maybeSingle()

    if (cached) {
      return new Response(JSON.stringify({ translated_text: cached.translated_text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Translate via AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      // Fallback: return source text
      return new Response(JSON.stringify({ translated_text: source_text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const LANGUAGE_NAMES: Record<string, string> = {
      en: 'English',
      fr: 'French',
      es: 'Spanish',
      it: 'Italian',
      pt: 'Portuguese',
      tr: 'Turkish',
      pl: 'Polish',
      nl: 'Dutch',
      ar: 'Arabic',
    }

    const langName = LANGUAGE_NAMES[target_language] || target_language

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are a translator. Translate the following German text to ${langName}. Keep the same tone, emojis, and enthusiasm. Return ONLY the translated text, nothing else.`,
          },
          { role: 'user', content: source_text },
        ],
      }),
    })

    if (!aiResponse.ok) {
      if (aiResponse.status === 429 || aiResponse.status === 402) {
        return new Response(JSON.stringify({ translated_text: source_text, error: 'Rate limited' }), {
          status: aiResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      console.error('AI translation error:', aiResponse.status)
      return new Response(JSON.stringify({ translated_text: source_text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const aiData = await aiResponse.json()
    const translatedText = aiData.choices?.[0]?.message?.content?.trim() || source_text

    // Cache the translation (using service role)
    await supabase
      .from('badge_share_translations')
      .upsert(
        { badge_id, language: target_language, translated_text: translatedText },
        { onConflict: 'badge_id,language' }
      )

    return new Response(JSON.stringify({ translated_text: translatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Translation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
