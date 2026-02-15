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

async function getCrossBotContext(serviceClient: any, targetBotId: string, userId: string): Promise<string | null> {
  try {
    const { data: messages, error } = await serviceClient
      .from("chat_messages")
      .select("bot_id, direction, content, created_at")
      .eq("user_id", userId)
      .neq("bot_id", targetBotId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !messages || messages.length === 0) return null;

    const formatted = messages
      .reverse()
      .map((m: any) => `[${m.bot_id}] (${m.direction}): ${m.content}`)
      .join("\n");

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return null;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Summarize the following cross-bot chat messages in 2-3 concise sentences. Focus on key decisions, action items, and topics being discussed. Be direct and factual.",
          },
          { role: "user", content: formatted },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI gateway error:", aiResponse.status, await aiResponse.text());
      return null;
    }

    const aiResult = await aiResponse.json();
    const summary = aiResult.choices?.[0]?.message?.content;
    return summary || null;
  } catch (err) {
    console.error("Cross-bot context error:", err);
    return null;
  }
}

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

    // Fetch cross-bot context using service role (bypasses RLS)
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const contextSummary = await getCrossBotContext(serviceClient, bot_id, userId as string);

    // Build Telegram message: prepend context if available
    let telegramText = message;
    if (contextSummary) {
      telegramText = `--- Cross-Bot Context ---\n${contextSummary}\n---\n\n${message}`;
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const body: Record<string, string> = { chat_id: chatId, text: telegramText };
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

    // Persist only the original message (without context) to chat_messages
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

    return new Response(JSON.stringify({ success: true, bot_id, context_injected: !!contextSummary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
