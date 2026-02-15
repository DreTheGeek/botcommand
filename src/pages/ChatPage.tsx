import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceRecordButton } from '@/components/chat/VoiceRecordButton';
import { FileUploadButton } from '@/components/chat/FileUploadButton';
import { ChatMediaMessage } from '@/components/chat/ChatMediaMessage';

const BOTS = [
  { id: 'ronnie', name: 'Ronnie Realty', color: 'hsl(var(--nexus-success))' },
  { id: 'ana', name: 'Ana Sales', color: 'hsl(var(--nexus-info))' },
  { id: 'tammy', name: 'Tammy Trader', color: 'hsl(var(--nexus-warning))' },
  { id: 'rhianna', name: 'Rhianna Research', color: 'hsl(var(--nexus-purple))' },
  { id: 'deondre', name: 'Deondre Dropshipping', color: 'hsl(var(--primary))' },
  { id: 'carter', name: 'Carter Content', color: 'hsl(var(--nexus-urgent))' },
];

interface ChatMessage {
  id: string;
  bot_id: string;
  direction: string;
  content: string;
  created_at: string;
  message_type: string;
  file_url: string | null;
  file_name: string | null;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedBot, setSelectedBot] = useState('ronnie');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages for selected bot
  useEffect(() => {
    if (!user) return;
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('bot_id', selectedBot)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Failed to load messages:', error);
        return;
      }
      setMessages((data as unknown as ChatMessage[]) || []);
    };
    loadMessages();
  }, [user, selectedBot]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`chat-${selectedBot}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (newMsg.bot_id !== selectedBot) return;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, selectedBot]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-telegram', {
        body: { bot_id: selectedBot, message: input.trim() },
      });
      if (error) throw error;
      setInput('');
    } catch (err: any) {
      toast({ title: 'Send failed', description: err.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getBotInfo = (botId: string) => BOTS.find((b) => b.id === botId) || BOTS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 h-[calc(100vh-4rem)] flex flex-col max-w-[1600px] mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" /> Bot Chat
        </h1>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Bot selector */}
        <div className="w-48 shrink-0 space-y-1">
          {BOTS.map((bot) => (
            <button
              key={bot.id}
              onClick={() => setSelectedBot(bot.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                selectedBot === bot.id
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'hover:bg-muted/50 text-muted-foreground'
              )}
            >
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: bot.color }}
              />
              {bot.name}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getBotInfo(selectedBot).color }}
            />
            <span className="text-sm font-medium">{getBotInfo(selectedBot).name}</span>
            <Badge variant="outline" className="ml-auto text-[10px]">
              {messages.length} messages
            </Badge>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-12">
                  No messages yet. Start a conversation!
                </div>
              )}
              {messages.map((msg) => {
                const bot = getBotInfo(msg.bot_id);
                const isOutgoing = msg.direction === 'outgoing';
                return (
                  <div
                    key={msg.id}
                    className={cn('flex', isOutgoing ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-xl px-4 py-2.5 text-sm',
                        isOutgoing
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted/60 border border-border/50 rounded-bl-sm'
                      )}
                    >
                      {!isOutgoing && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: bot.color }}
                          />
                          <span className="text-[10px] font-medium opacity-70">
                            {bot.name}
                          </span>
                        </div>
                      )}
                      <ChatMediaMessage
                        messageType={msg.message_type || 'text'}
                        content={msg.content}
                        fileUrl={msg.file_url}
                        fileName={msg.file_name}
                      />
                      <p className={cn(
                        'text-[10px] mt-1 opacity-50',
                        isOutgoing ? 'text-right' : 'text-left'
                      )}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border/50 flex gap-2">
            <FileUploadButton
              botId={selectedBot}
              onSent={() => {}}
            />
            <Textarea
              placeholder={`Message ${getBotInfo(selectedBot).name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
            />
            <VoiceRecordButton
              onTranscript={(text) => setInput((prev) => prev + text)}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              size="icon"
              className="shrink-0 h-11 w-11"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
