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
    return aiResult.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("Cross-bot context error:", err);
    return null;
  }
}

async function sendToBot(
  botId: string,
  message: string,
  messageType: string,
  fileUrl: string | null,
  parseMode: string | null,
  contextSummary: string | null
): Promise<{ ok: boolean; result?: any; error?: string }> {
  const botConfig = BOT_MAP[botId];
  if (!botConfig) return { ok: false, error: `Unknown bot_id: ${botId}` };

  const botToken = Deno.env.get(botConfig.tokenKey);
  const chatId = Deno.env.get(botConfig.chatKey);

  if (!botToken || !chatId) {
    return { ok: false, error: `Secrets not configured for bot: ${botId}` };
  }

  let tgResponse: Response;
  let tgResult: any;

  if (messageType === "photo" && fileUrl) {
    let caption = message || "";
    if (contextSummary) caption = `--- Cross-Bot Context ---\n${contextSummary}\n---\n\n${caption}`;
    tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, photo: fileUrl, caption: caption || undefined }),
    });
    tgResult = await tgResponse.json();
  } else if (messageType === "document" && fileUrl) {
    let caption = message || "";
    if (contextSummary) caption = `--- Cross-Bot Context ---\n${contextSummary}\n---\n\n${caption}`;
    tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, document: fileUrl, caption: caption || undefined }),
    });
    tgResult = await tgResponse.json();
  } else {
    let telegramText = message;
    if (contextSummary) {
      telegramText = `--- Cross-Bot Context ---\n${contextSummary}\n---\n\n${message}`;
    }
    const body: Record<string, string> = { chat_id: chatId, text: telegramText };
    if (parseMode) body.parse_mode = parseMode;
    tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    tgResult = await tgResponse.json();
  }

  return {
    ok: tgResponse.ok,
    result: tgResult,
    error: tgResponse.ok ? undefined : `Telegram error for ${botId}: ${JSON.stringify(tgResult)}`,
  };
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

    const userId = data.claims.sub as string;
    const body = await req.json();
    const {
      bot_id,
      bot_ids,
      message,
      parse_mode,
      type,
      file_url,
      file_name,
      group_chat_id,
    } = body;

    const messageType = type || "text";

    // Validate: need at least one bot target and a message/file
    const targetBotIds: string[] = bot_ids?.length ? bot_ids : (bot_id ? [bot_id] : []);
    if (targetBotIds.length === 0 || (!message && !file_url)) {
      return new Response(JSON.stringify({ error: "bot_id (or bot_ids) and message/file_url are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Group message: send to all bots, skip cross-bot context for group messages
    if (targetBotIds.length > 1) {
      const results: Record<string, any> = {};
      const persistRows: any[] = [];

      await Promise.all(
        targetBotIds.map(async (bid) => {
          const r = await sendToBot(bid, message, messageType, file_url || null, parse_mode || null, null);
          results[bid] = r;
          if (r.ok) {
            persistRows.push({
              user_id: userId,
              bot_id: bid,
              direction: "outgoing",
              content: message || (file_url ? `[${messageType === "photo" ? "Photo" : "Document"}]` : ""),
              message_type: messageType,
              file_url: file_url || null,
              file_name: file_name || null,
              telegram_message_id: r.result?.result?.message_id || null,
              group_chat_id: group_chat_id || null,
            });
          }
        })
      );

      if (persistRows.length > 0) {
        const { error: insertError } = await serviceClient.from("chat_messages").insert(persistRows);
        if (insertError) console.error("Failed to persist group messages:", insertError);
      }

      const successCount = Object.values(results).filter((r: any) => r.ok).length;
      return new Response(
        JSON.stringify({ success: true, sent_to: successCount, total: targetBotIds.length, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Single bot message
    const singleBotId = targetBotIds[0];
    if (!BOT_MAP[singleBotId]) {
      return new Response(JSON.stringify({ error: `Unknown bot_id: ${singleBotId}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contextSummary = await getCrossBotContext(serviceClient, singleBotId, userId);
    const sendResult = await sendToBot(singleBotId, message, messageType, file_url || null, parse_mode || null, contextSummary);

    if (!sendResult.ok) {
      return new Response(JSON.stringify({ error: "Telegram API error", details: sendResult.error }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await supabase.from("chat_messages").insert({
      user_id: userId,
      bot_id: singleBotId,
      direction: "outgoing",
      content: message || (file_url ? `[${messageType === "photo" ? "Photo" : "Document"}]` : ""),
      message_type: messageType,
      file_url: file_url || null,
      file_name: file_name || null,
      telegram_message_id: sendResult.result?.result?.message_id || null,
      group_chat_id: group_chat_id || null,
    });

    if (insertError) {
      console.error("Failed to persist outgoing message:", insertError);
    }

    return new Response(
      JSON.stringify({ success: true, bot_id: singleBotId, context_injected: !!contextSummary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
