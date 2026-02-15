import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BOT_CHAT_KEYS: Record<string, string> = {
  ronnie: "TELEGRAM_RONNIE_CHAT_ID",
  ana: "TELEGRAM_ANA_CHAT_ID",
  tammy: "TELEGRAM_TAMMY_CHAT_ID",
  rhianna: "TELEGRAM_RHIANNA_CHAT_ID",
  deondre: "TELEGRAM_DEONDRE_CHAT_ID",
  carter: "TELEGRAM_CARTER_CHAT_ID",
};

const BOT_TOKEN_KEYS: Record<string, string> = {
  ronnie: "TELEGRAM_RONNIE_BOT_TOKEN",
  ana: "TELEGRAM_ANA_BOT_TOKEN",
  tammy: "TELEGRAM_TAMMY_BOT_TOKEN",
  rhianna: "TELEGRAM_RHIANNA_BOT_TOKEN",
  deondre: "TELEGRAM_DEONDRE_BOT_TOKEN",
  carter: "TELEGRAM_CARTER_BOT_TOKEN",
};

const CHAT_ID_TO_BOT: Record<string, string> = {};

function buildChatIdMap() {
  if (Object.keys(CHAT_ID_TO_BOT).length > 0) return;
  for (const [botId, envKey] of Object.entries(BOT_CHAT_KEYS)) {
    const chatId = Deno.env.get(envKey);
    if (chatId) CHAT_ID_TO_BOT[chatId] = botId;
  }
}

async function downloadTelegramFile(
  botToken: string,
  fileId: string,
  supabase: any
): Promise<{ url: string; fileName: string } | null> {
  try {
    const fileRes = await fetch(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
    );
    const fileData = await fileRes.json();
    if (!fileData.ok || !fileData.result?.file_path) return null;

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
    const fileResponse = await fetch(downloadUrl);
    if (!fileResponse.ok) return null;

    const blob = await fileResponse.blob();
    const ext = filePath.split(".").pop() || "bin";
    const storagePath = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("chat-attachments")
      .upload(storagePath, blob, { contentType: blob.type || "application/octet-stream" });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("chat-attachments")
      .getPublicUrl(storagePath);

    return { url: urlData.publicUrl, fileName: filePath.split("/").pop() || storagePath };
  } catch (err) {
    console.error("File download error:", err);
    return null;
  }
}

async function extractBotData(
  supabase: any,
  messageId: string,
  botId: string,
  userId: string,
  content: string
) {
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
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
              content: `You analyze messages from AI bots and extract structured data. The bot "${botId}" sent this message. Extract any actionable data points.

Return a JSON object with:
- "has_data": boolean (true if the message contains meaningful data worth tracking)
- "category": one of "property_deal", "trade", "prospect", "revenue", "alert", "content_stat", "product", "research", "task", "general"
- "data": an object with relevant key-value pairs extracted from the message

Examples:
- Property deal: { "address": "...", "min_bid": 18000, "arv": 185000, "profit": 62000, "beds": 3, "baths": 2, "status": "Hot Deal" }
- Trade: { "symbol": "NVDA", "pnl": 89, "shares": 27, "strategy": "Swing", "result": "W" }
- Alert: { "severity": "urgent", "message": "...", "action_required": true }
- Content stat: { "platform": "TikTok", "views": 45000, "engagement": 8.5, "title": "..." }

Only set has_data=true if there is concrete, specific data (numbers, names, amounts). Generic chit-chat should be has_data=false.`,
            },
            { role: "user", content },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_data",
                description: "Extract structured data from a bot message",
                parameters: {
                  type: "object",
                  properties: {
                    has_data: { type: "boolean" },
                    category: {
                      type: "string",
                      enum: [
                        "property_deal", "trade", "prospect", "revenue",
                        "alert", "content_stat", "product", "research",
                        "task", "general",
                      ],
                    },
                    data: { type: "object" },
                  },
                  required: ["has_data", "category", "data"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "extract_data" } },
        }),
      }
    );

    if (!aiResponse.ok) {
      console.error("AI extraction error:", aiResponse.status);
      return;
    }

    const aiResult = await aiResponse.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) return;

    const extracted = JSON.parse(toolCall.function.arguments);
    if (!extracted.has_data) return;

    const { error } = await supabase.from("bot_data_entries").insert({
      user_id: userId,
      bot_id: botId,
      category: extracted.category,
      data: extracted.data,
      source_message_id: messageId,
    });

    if (error) console.error("Bot data insert error:", error);
  } catch (err) {
    console.error("Data extraction error:", err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    buildChatIdMap();
    const update = await req.json();
    const message = update.message;
    if (!message?.chat?.id) {
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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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

    // Determine message type and content
    let messageType = "text";
    let content = message.text || "";
    let fileUrl: string | null = null;
    let fileName: string | null = null;

    const botToken = Deno.env.get(BOT_TOKEN_KEYS[botId]);

    if (message.photo && botToken) {
      messageType = "photo";
      const photo = message.photo[message.photo.length - 1]; // highest res
      const result = await downloadTelegramFile(botToken, photo.file_id, supabase);
      if (result) {
        fileUrl = result.url;
        fileName = result.fileName;
      }
      content = message.caption || "[Photo]";
    } else if (message.document && botToken) {
      messageType = "document";
      const result = await downloadTelegramFile(botToken, message.document.file_id, supabase);
      if (result) {
        fileUrl = result.url;
        fileName = message.document.file_name || result.fileName;
      }
      content = message.caption || `[Document: ${fileName || "file"}]`;
    } else if (message.voice && botToken) {
      messageType = "voice";
      const result = await downloadTelegramFile(botToken, message.voice.file_id, supabase);
      if (result) {
        fileUrl = result.url;
        fileName = result.fileName;
      }
      content = "[Voice message]";
    }

    if (!content && !fileUrl) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: inserted, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: adminRole.user_id,
        bot_id: botId,
        direction: "incoming",
        content,
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName,
        telegram_message_id: message.message_id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
    }

    // Extract structured data in background (don't block response)
    if (inserted && content && messageType === "text") {
      extractBotData(supabase, inserted.id, botId, adminRole.user_id, content);
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
