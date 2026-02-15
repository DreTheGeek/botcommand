import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ChatMediaMessageProps {
  messageType: string;
  content: string;
  fileUrl?: string | null;
  fileName?: string | null;
}

export function ChatMediaMessage({ messageType, content, fileUrl, fileName }: ChatMediaMessageProps) {
  const [imageOpen, setImageOpen] = useState(false);

  if (messageType === 'photo' && fileUrl) {
    return (
      <div className="space-y-1">
        <img
          src={fileUrl}
          alt={content || 'Photo'}
          className="max-w-[280px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setImageOpen(true)}
        />
        {content && content !== '[Photo]' && (
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        )}
        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-2">
            <img src={fileUrl} alt={content || 'Photo'} className="w-full h-full object-contain" />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (messageType === 'document' && fileUrl) {
    return (
      <div className="space-y-1">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-colors"
        >
          <FileText className="h-5 w-5 text-primary shrink-0" />
          <span className="text-sm truncate flex-1">{fileName || 'Document'}</span>
          <Download className="h-4 w-4 text-muted-foreground shrink-0" />
        </a>
        {content && !content.startsWith('[Document') && (
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        )}
      </div>
    );
  }

  if (messageType === 'voice' && fileUrl) {
    return (
      <div className="space-y-1">
        <audio controls className="max-w-[280px]" preload="metadata">
          <source src={fileUrl} />
        </audio>
      </div>
    );
  }

  return <p className="whitespace-pre-wrap">{content}</p>;
}
