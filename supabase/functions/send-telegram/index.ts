import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BOT_MAP: Record<string, { tokenKey: string; chatKey: string }> = {
  ronnie: { tokenKey: "TELEGRAM_RONNIE_BOT_TOKEN", chatKey: "TELEGRAM_RONNIE_CHAT_ID" },
  ana: { tokenKey: "TELEGRAM_ANA_BOT_TOKEN", chatKey: "TELEGRAM_ANA_CHAT_ID" },
  tammy: { tokenKey: "TELEGRAM_TAMMY_BOT_TOKEN", chatKey: "TELEGRAM_TAMMY_CHAT_ID" },
  rhianna: { tokenKey: "TELEGRAM_RHIANNA_BOT_TOKEN", chatKey: "TELEGRAM_RHIANNA_CHAT_ID" },
  deondre: { tokenKey: "TELEGRAM_DEONDRE_BOT_TOKEN", chatKey: "TELEGRAM_DEONDRE_CHAT_ID" },
  carter: { tokenKey: "TELEGRAM_CARTER_BOT_TOKEN", chatKey: "TELEGRAM_CARTER_CHAT_ID" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = data.claims.sub;
    const { bot_id, message, parse_mode } = await req.json();

    if (!bot_id || !message) {
      return new Response(JSON.stringify({ error: "bot_id and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const botConfig = BOT_MAP[bot_id];
    if (!botConfig) {
      return new Response(JSON.stringify({ error: `Unknown bot_id: ${bot_id}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const botToken = Deno.env.get(botConfig.tokenKey);
    const chatId = Deno.env.get(botConfig.chatKey);

    if (!botToken || !chatId) {
      return new Response(JSON.stringify({ error: `Secrets not configured for bot: ${bot_id}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const body: Record<string, string> = { chat_id: chatId, text: message };
    if (parse_mode) body.parse_mode = parse_mode;

    const tgResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const tgResult = await tgResponse.json();

    if (!tgResponse.ok) {
      return new Response(JSON.stringify({ error: "Telegram API error", details: tgResult }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist outgoing message to chat_messages
    const { error: insertError } = await supabase.from("chat_messages").insert({
      user_id: userId,
      bot_id: bot_id,
      direction: "outgoing",
      content: message,
      telegram_message_id: tgResult.result?.message_id || null,
    });

    if (insertError) {
      console.error("Failed to persist outgoing message:", insertError);
    }

    return new Response(JSON.stringify({ success: true, bot_id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
