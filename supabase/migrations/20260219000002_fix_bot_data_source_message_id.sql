-- Add source_message_id to bot_data_entries if not already present
-- (Types already reference this column; this migration ensures the DB matches)
ALTER TABLE public.bot_data_entries
  ADD COLUMN IF NOT EXISTS source_message_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL;

-- Index for joins from chat messages to bot data
CREATE INDEX IF NOT EXISTS idx_bot_data_source_message
  ON public.bot_data_entries (source_message_id)
  WHERE source_message_id IS NOT NULL;
