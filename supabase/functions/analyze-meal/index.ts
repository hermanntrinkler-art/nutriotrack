import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lang = language === "de" ? "German" : "English";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a nutrition analysis AI. Analyze food images and identify all visible foods with their estimated nutritional values. Be accurate with portion sizes. Respond in ${lang}. Use common food names.

IMPORTANT RULES:
- If you see packaged products, coffee capsules, tea bags, or branded items, identify the PREPARED food/drink they produce (e.g., a Nespresso capsule = "Kaffee" / "Espresso", not "Kapsel").
- For coffee: estimate as the prepared drink. A standard espresso capsule = ~40ml espresso (~2 kcal). If milk/cream is likely added, mention separately.
- For drinks: use ml as the unit. For solid food: use g or Stück/piece.
- Estimate realistically based on visual portion size and typical serving sizes.
- Always provide realistic nutritional values based on standard food databases.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this food image. Identify each food item visible. If you see product packaging or capsules, identify the PREPARED food/drink they produce. Estimate portion sizes and provide nutritional information (calories, protein, fat, carbs) for each item. Use ml for drinks and g for solid foods. Provide a confidence score (0-1) for each identification.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_food_items",
              description: "Report the identified food items with nutritional information",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        food_name: { type: "string", description: "Name of the food item" },
                        quantity: { type: "number", description: "Estimated quantity" },
                        unit: { type: "string", description: "Unit of measurement (g, ml, Stück/piece, Scheiben/slices, etc.)" },
                        calories: { type: "number", description: "Estimated calories (kcal)" },
                        protein_g: { type: "number", description: "Estimated protein in grams" },
                        fat_g: { type: "number", description: "Estimated fat in grams" },
                        carbs_g: { type: "number", description: "Estimated carbohydrates in grams" },
                        confidence_score: { type: "number", description: "Confidence score 0.0-1.0 for this identification" },
                      },
                      required: ["food_name", "quantity", "unit", "calories", "protein_g", "fat_g", "carbs_g", "confidence_score"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["items"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_food_items" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limit" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "payment_required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "ai_error", details: text }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ items: parsed.items }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: if no tool call, return empty
    return new Response(JSON.stringify({ items: [], fallback: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-meal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
