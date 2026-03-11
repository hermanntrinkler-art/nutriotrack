import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create client with user's token to get user id
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to delete user data and auth account
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userId = user.id;

    // Delete user data from all tables (order matters for foreign keys)
    await supabaseAdmin.from("meal_food_items").delete().in(
      "meal_entry_id",
      (await supabaseAdmin.from("meal_entries").select("id").eq("user_id", userId)).data?.map(r => r.id) || []
    );
    await supabaseAdmin.from("meal_entries").delete().eq("user_id", userId);
    await supabaseAdmin.from("saved_recipe_items").delete().in(
      "recipe_id",
      (await supabaseAdmin.from("saved_recipes").select("id").eq("user_id", userId)).data?.map(r => r.id) || []
    );
    await supabaseAdmin.from("saved_recipes").delete().eq("user_id", userId);
    await supabaseAdmin.from("weight_entries").delete().eq("user_id", userId);
    await supabaseAdmin.from("activity_entries").delete().eq("user_id", userId);
    await supabaseAdmin.from("nutrition_daily_summaries").delete().eq("user_id", userId);
    await supabaseAdmin.from("user_goals").delete().eq("user_id", userId);
    await supabaseAdmin.from("custom_products").delete().eq("user_id", userId);
    await supabaseAdmin.from("community_products").delete().eq("contributor_id", userId);
    await supabaseAdmin.from("food_reports").delete().eq("reporter_id", userId);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
    await supabaseAdmin.from("profiles").delete().eq("user_id", userId);

    // Delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) {
      return new Response(JSON.stringify({ error: "Failed to delete account" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
