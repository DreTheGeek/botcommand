
-- Add columns to chat_messages for media support
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS message_type text NOT NULL DEFAULT 'text',
ADD COLUMN IF NOT EXISTS file_url text,
ADD COLUMN IF NOT EXISTS file_name text;

-- Create bot_data_entries table for AI-extracted structured data
CREATE TABLE public.bot_data_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  bot_id text NOT NULL,
  category text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_message_id uuid REFERENCES public.chat_messages(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on bot_data_entries
ALTER TABLE public.bot_data_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for bot_data_entries
CREATE POLICY "Users can view own bot data"
ON public.bot_data_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert bot data"
ON public.bot_data_entries FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can insert own bot data"
ON public.bot_data_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bot data"
ON public.bot_data_entries FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload chat attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view chat attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-attachments');

CREATE POLICY "Users can delete own chat attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');

-- Enable realtime for bot_data_entries
ALTER PUBLICATION supabase_realtime ADD TABLE public.bot_data_entries;
