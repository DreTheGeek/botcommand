import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map Telegram chat IDs back to bot IDs
const CHAT_ID_TO_BOT: Record<string, string> = {};

const BOT_CHAT_KEYS: Record<string, string> = {
  ronnie: "TELEGRAM_RONNIE_CHAT_ID",
  ana: "TELEGRAM_ANA_CHAT_ID",
  tammy: "TELEGRAM_TAMMY_CHAT_ID",
  rhianna: "TELEGRAM_RHIANNA_CHAT_ID",
  deondre: "TELEGRAM_DEONDRE_CHAT_ID",
  carter: "TELEGRAM_CARTER_CHAT_ID",
};

function buildChatIdMap() {
  if (Object.keys(CHAT_ID_TO_BOT).length > 0) return;
  for (const [botId, envKey] of Object.entries(BOT_CHAT_KEYS)) {
    const chatId = Deno.env.get(envKey);
    if (chatId) CHAT_ID_TO_BOT[chatId] = botId;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    buildChatIdMap();

    const update = await req.json();

    // Telegram sends message updates
    const message = update.message;
    if (!message?.text || !message?.chat?.id) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chatIdStr = String(message.chat.id);
    const botId = CHAT_ID_TO_BOT[chatIdStr];

    if (!botId) {
      console.log(`Unknown chat_id: ${chatIdStr}`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to insert (webhook has no user auth)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find the user who owns this bot conversation (for now, get the admin user)
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!adminRole) {
      console.log("No admin user found");
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("chat_messages").insert({
      user_id: adminRole.user_id,
      bot_id: botId,
      direction: "incoming",
      content: message.text,
      telegram_message_id: message.message_id,
    });

    if (error) {
      console.error("Insert error:", error);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
