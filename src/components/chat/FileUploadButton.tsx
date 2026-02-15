import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploadButtonProps {
  botId: string;
  disabled?: boolean;
  onSent: () => void;
}

export function FileUploadButton({ botId, disabled, onSent }: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(path);

      const isPhoto = file.type.startsWith('image/');
      const { error } = await supabase.functions.invoke('send-telegram', {
        body: {
          bot_id: botId,
          message: '',
          type: isPhoto ? 'photo' : 'document',
          file_url: urlData.publicUrl,
          file_name: file.name,
        },
      });

      if (error) throw error;
      onSent();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0 h-11 w-11"
        disabled={disabled || uploading}
        onClick={() => fileRef.current?.click()}
        title="Upload file"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
      </Button>
    </>
  );
}
