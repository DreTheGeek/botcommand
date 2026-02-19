-- Group chats table: allows grouping multiple bots into a shared conversation thread
CREATE TABLE public.group_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bot_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Row-level security
ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own group chats"
  ON public.group_chats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime on group_chats
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chats;

-- Add group_chat_id column to chat_messages (nullable foreign key)
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS group_chat_id UUID REFERENCES public.group_chats(id) ON DELETE SET NULL;

-- Index for efficient group chat message lookup
CREATE INDEX idx_chat_messages_group_chat
  ON public.chat_messages (group_chat_id, created_at DESC)
  WHERE group_chat_id IS NOT NULL;
