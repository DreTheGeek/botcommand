
-- Chat messages table for all bot conversations
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bot_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('outgoing', 'incoming')),
  content TEXT NOT NULL,
  telegram_message_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/insert their own messages
CREATE POLICY "Users can view own messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Service role policy for webhook inserts (edge function uses service role)
CREATE POLICY "Service role can insert messages"
  ON public.chat_messages FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Index for fast bot-filtered queries
CREATE INDEX idx_chat_messages_user_bot ON public.chat_messages (user_id, bot_id, created_at DESC);
CREATE INDEX idx_chat_messages_created ON public.chat_messages (created_at DESC);
