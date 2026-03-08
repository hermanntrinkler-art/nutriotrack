import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];

    // Reset daily photo scans for all users where reset date is not today
    const { data: resetData, error: resetError } = await supabase
      .from('profiles')
      .update({ daily_photo_scans: 0, daily_scans_reset_date: today })
      .neq('daily_scans_reset_date', today);

    if (resetError) {
      console.error('Reset error:', resetError);
      throw resetError;
    }

    // Expire pro subscriptions that have passed their end date
    const { data: expireData, error: expireError } = await supabase
      .from('profiles')
      .update({ subscription_status: 'free' })
      .eq('subscription_status', 'pro')
      .lt('subscription_end_date', new Date().toISOString());

    if (expireError) {
      console.error('Expire error:', expireError);
      throw expireError;
    }

    return new Response(JSON.stringify({ success: true, reset: resetData, expired: expireData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
