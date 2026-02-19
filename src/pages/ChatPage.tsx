import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageCircle, Users, Plus, X, Bot, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceRecordButton } from '@/components/chat/VoiceRecordButton';
import { FileUploadButton } from '@/components/chat/FileUploadButton';
import { ChatMediaMessage } from '@/components/chat/ChatMediaMessage';

// ─── Bot definitions ────────────────────────────────────────────────────────
const TELEGRAM_BOTS = [
  { id: 'ronnie', name: 'Ronnie Realty', color: 'hsl(var(--nexus-success))', telegram: true },
  { id: 'ana', name: 'Ana Sales', color: 'hsl(var(--nexus-info))', telegram: true },
  { id: 'tammy', name: 'Tammy Trader', color: 'hsl(var(--nexus-warning))', telegram: true },
  { id: 'rhianna', name: 'Rhianna Research', color: 'hsl(var(--nexus-purple))', telegram: true },
  { id: 'deondre', name: 'Deondre Dropshipping', color: 'hsl(var(--primary))', telegram: true },
  { id: 'carter', name: 'Carter Content', color: 'hsl(var(--nexus-urgent))', telegram: true },
];

const AI_BOTS = [
  { id: 'optimus', name: 'Optimus Prime', color: 'hsl(var(--nexus-teal))', telegram: false },
  { id: 'cleah', name: 'Cleah Coding', color: '#7c3aed', telegram: false },
  { id: 'benny', name: 'Benny Business Maker', color: '#0ea5e9', telegram: false },
];

const ALL_BOTS = [...TELEGRAM_BOTS, ...AI_BOTS];

// ─── Types ───────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  bot_id: string;
  direction: string;
  content: string;
  created_at: string;
  message_type: string | null;
  file_url: string | null;
  file_name: string | null;
  group_chat_id?: string | null;
}

interface GroupChat {
  id: string;
  name: string;
  bot_ids: string[];
  created_at: string;
}

type ActiveView =
  | { type: 'bot'; botId: string }
  | { type: 'group'; groupId: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getBotInfo(botId: string) {
  return ALL_BOTS.find((b) => b.id === botId) ?? ALL_BOTS[0];
}

function MessageBubble({ msg, showBotLabel }: { msg: ChatMessage; showBotLabel?: boolean }) {
  const bot = getBotInfo(msg.bot_id);
  const isOutgoing = msg.direction === 'outgoing';
  return (
    <div className={cn('flex', isOutgoing ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-xl px-4 py-2.5 text-sm',
          isOutgoing
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted/60 border border-border/50 rounded-bl-sm'
        )}
      >
        {!isOutgoing && showBotLabel && (
          <div className="flex items-center gap-1.5 mb-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: bot.color }} />
            <span className="text-[10px] font-semibold opacity-80">{bot.name}</span>
          </div>
        )}
        <ChatMediaMessage
          messageType={msg.message_type || 'text'}
          content={msg.content}
          fileUrl={msg.file_url}
          fileName={msg.file_name}
        />
        <p className={cn('text-[10px] mt-1 opacity-50', isOutgoing ? 'text-right' : 'text-left')}>
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// ─── Create Group Dialog ──────────────────────────────────────────────────────
function CreateGroupDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, botIds: string[]) => void;
}) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleCreate = () => {
    if (!name.trim() || selected.size === 0) return;
    onCreate(name.trim(), Array.from(selected));
    setName('');
    setSelected(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> New Group Chat
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Group name (e.g. Revenue Team)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <p className="text-sm font-medium mb-2">Select Bots ({selected.size} selected)</p>
            <div className="space-y-1">
              {TELEGRAM_BOTS.map((bot) => (
                <label
                  key={bot.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={selected.has(bot.id)}
                    onCheckedChange={() => toggle(bot.id)}
                  />
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: bot.color }} />
                  <span className="text-sm">{bot.name}</span>
                  <Badge variant="outline" className="text-[10px] ml-auto">Telegram</Badge>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 mb-1">AI Assistants (no Telegram)</p>
            <div className="space-y-1">
              {AI_BOTS.map((bot) => (
                <label
                  key={bot.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer opacity-50 cursor-not-allowed"
                >
                  <Checkbox checked={false} disabled />
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: bot.color }} />
                  <span className="text-sm">{bot.name}</span>
                  <Badge variant="outline" className="text-[10px] ml-auto">AI Only</Badge>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim() || selected.size === 0}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState<ActiveView>({ type: 'bot', botId: 'ronnie' });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [unreadBots, setUnreadBots] = useState<Set<string>>(new Set());
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [botsExpanded, setBotsExpanded] = useState(true);
  const [groupsExpanded, setGroupsExpanded] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeViewRef = useRef(activeView);
  useEffect(() => { activeViewRef.current = activeView; }, [activeView]);

  // ── Load group chats from Supabase ──
  useEffect(() => {
    if (!user) return;
    supabase
      .from('group_chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setGroupChats(data as GroupChat[]);
      });
  }, [user]);

  // ── Load messages for current view ──
  const loadMessages = useCallback(async () => {
    if (!user) return;
    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(200);

    if (activeView.type === 'bot') {
      query = query.eq('bot_id', activeView.botId).is('group_chat_id', null);
    } else {
      query = query.eq('group_chat_id', activeView.groupId);
    }

    const { data, error } = await query;
    if (!error && data) {
      setMessages(data as unknown as ChatMessage[]);
    }
  }, [user, activeView]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // ── Realtime subscription ──
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('chat-nexus-global')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        const view = activeViewRef.current;

        const isForCurrentView =
          (view.type === 'bot' && newMsg.bot_id === view.botId && !newMsg.group_chat_id) ||
          (view.type === 'group' && newMsg.group_chat_id === view.groupId);

        if (isForCurrentView) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        } else if (newMsg.direction === 'incoming') {
          setUnreadBots((prev) => new Set(prev).add(newMsg.bot_id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // ── Auto-scroll ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Send message ──
  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      if (activeView.type === 'bot') {
        const bot = getBotInfo(activeView.botId);
        if (!bot.telegram) {
          toast({
            title: 'AI Bot — Chat via Telegram',
            description: `${bot.name} is only available via the Telegram app. Open Telegram to chat with them directly.`,
            variant: 'default',
          });
          setSending(false);
          return;
        }
        const { error } = await supabase.functions.invoke('send-telegram', {
          body: { bot_id: activeView.botId, message: input.trim() },
        });
        if (error) throw error;
      } else {
        // Group chat — send to all Telegram bots in the group
        const group = groupChats.find((g) => g.id === activeView.groupId);
        if (!group) throw new Error('Group not found');
        const { error } = await supabase.functions.invoke('send-telegram', {
          body: {
            bot_ids: group.bot_ids,
            message: input.trim(),
            group_chat_id: group.id,
          },
        });
        if (error) throw error;
      }
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

  const handleSelectBot = (botId: string) => {
    setActiveView({ type: 'bot', botId });
    setUnreadBots((prev) => { const n = new Set(prev); n.delete(botId); return n; });
  };

  const handleSelectGroup = (groupId: string) => {
    setActiveView({ type: 'group', groupId });
  };

  const handleCreateGroup = async (name: string, botIds: string[]) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('group_chats')
      .insert({ user_id: user.id, name, bot_ids: botIds })
      .select()
      .single();

    if (error) {
      toast({ title: 'Failed to create group', description: error.message, variant: 'destructive' });
      return;
    }
    const newGroup = data as GroupChat;
    setGroupChats((prev) => [newGroup, ...prev]);
    setActiveView({ type: 'group', groupId: newGroup.id });
    toast({ title: 'Group created!', description: `"${name}" with ${botIds.length} bots` });
  };

  const handleDeleteGroup = async (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('group_chats').delete().eq('id', groupId);
    setGroupChats((prev) => prev.filter((g) => g.id !== groupId));
    if (activeView.type === 'group' && activeView.groupId === groupId) {
      setActiveView({ type: 'bot', botId: 'ronnie' });
    }
  };

  // ── Header info for current view ──
  const currentGroupChat = activeView.type === 'group'
    ? groupChats.find((g) => g.id === activeView.groupId)
    : null;

  const currentBotInfo = activeView.type === 'bot' ? getBotInfo(activeView.botId) : null;

  const headerColor = currentBotInfo?.color ?? 'hsl(var(--primary))';
  const headerTitle = currentBotInfo?.name ?? currentGroupChat?.name ?? 'Chat';
  const headerSubtitle = activeView.type === 'group' && currentGroupChat
    ? `${currentGroupChat.bot_ids.length} bots: ${currentGroupChat.bot_ids.map((id) => getBotInfo(id).name).join(', ')}`
    : currentBotInfo?.telegram === false
      ? 'AI Assistant — chat via Telegram app'
      : undefined;

  const isAiOnlyBot = activeView.type === 'bot' && currentBotInfo?.telegram === false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 h-[calc(100vh-4rem)] flex flex-col max-w-[1600px] mx-auto gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" /> Bot Chat
        </h1>
        <Badge variant="outline" className="text-xs">
          {ALL_BOTS.length} bots · {groupChats.length} groups
        </Badge>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* ── Sidebar ── */}
        <div className="w-52 shrink-0 flex flex-col gap-1 overflow-y-auto">
          {/* Individual Bots */}
          <button
            onClick={() => setBotsExpanded((v) => !v)}
            className="flex items-center gap-1 px-1 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            {botsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Telegram Bots
          </button>
          <AnimatePresence initial={false}>
            {botsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-0.5"
              >
                {TELEGRAM_BOTS.map((bot) => {
                  const isActive = activeView.type === 'bot' && activeView.botId === bot.id;
                  return (
                    <button
                      key={bot.id}
                      onClick={() => handleSelectBot(bot.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                        isActive
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'hover:bg-muted/50 text-muted-foreground'
                      )}
                    >
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: bot.color }} />
                      <span className="flex-1 truncate">{bot.name}</span>
                      {unreadBots.has(bot.id) && (
                        <span className="h-2 w-2 rounded-full bg-[hsl(var(--nexus-urgent))] animate-pulse shrink-0" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Bots */}
          <div className="mt-2">
            <p className="px-1 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Bot className="h-3 w-3" /> AI Assistants
            </p>
            <div className="space-y-0.5">
              {AI_BOTS.map((bot) => {
                const isActive = activeView.type === 'bot' && activeView.botId === bot.id;
                return (
                  <button
                    key={bot.id}
                    onClick={() => handleSelectBot(bot.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                      isActive
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'hover:bg-muted/50 text-muted-foreground'
                    )}
                  >
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: bot.color }} />
                    <span className="flex-1 truncate">{bot.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Chats */}
          <div className="mt-3 border-t border-border/50 pt-2">
            <div className="flex items-center justify-between px-1 mb-1">
              <button
                onClick={() => setGroupsExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              >
                {groupsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <Users className="h-3 w-3" /> Groups
              </button>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                title="New group chat"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <AnimatePresence initial={false}>
              {groupsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-0.5"
                >
                  {groupChats.length === 0 && (
                    <p className="text-xs text-muted-foreground px-3 py-2">No groups yet</p>
                  )}
                  {groupChats.map((group) => {
                    const isActive = activeView.type === 'group' && activeView.groupId === group.id;
                    return (
                      <div key={group.id} className="group relative">
                        <button
                          onClick={() => handleSelectGroup(group.id)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 pr-8',
                            isActive
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'hover:bg-muted/50 text-muted-foreground'
                          )}
                        >
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          <span className="flex-1 truncate">{group.name}</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteGroup(group.id, e)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Chat Area ── */}
        <Card className="flex-1 flex flex-col min-h-0">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2 shrink-0">
            {activeView.type === 'group' ? (
              <Users className="h-4 w-4 text-primary" />
            ) : (
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: headerColor }} />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold">{headerTitle}</span>
              {headerSubtitle && (
                <p className="text-[10px] text-muted-foreground truncate">{headerSubtitle}</p>
              )}
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0">
              {messages.length} messages
            </Badge>
          </div>

          {/* AI-only bot notice */}
          {isAiOnlyBot && (
            <div className="px-4 py-2 bg-muted/30 border-b border-border/30 text-xs text-muted-foreground flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 shrink-0" />
              {currentBotInfo?.name} is an AI assistant on Railway — open Telegram to chat with them directly. Message history shown below.
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-16">
                  {isAiOnlyBot
                    ? 'No message history yet. Chat with this bot on Telegram.'
                    : 'No messages yet. Start the conversation!'}
                </div>
              )}
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  showBotLabel={activeView.type === 'group'}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border/50 flex gap-2 shrink-0">
            {!isAiOnlyBot && (
              <FileUploadButton
                botId={activeView.type === 'bot' ? activeView.botId : (currentGroupChat?.bot_ids[0] ?? 'ronnie')}
                onSent={loadMessages}
              />
            )}
            <Textarea
              placeholder={
                isAiOnlyBot
                  ? `${currentBotInfo?.name} — chat via Telegram app`
                  : activeView.type === 'group' && currentGroupChat
                    ? `Message all ${currentGroupChat.bot_ids.length} bots in ${currentGroupChat.name}...`
                    : `Message ${currentBotInfo?.name ?? 'bot'}...`
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              disabled={isAiOnlyBot}
            />
            {!isAiOnlyBot && (
              <VoiceRecordButton onTranscript={(text) => setInput((prev) => prev + text)} />
            )}
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || sending || isAiOnlyBot}
              size="icon"
              className="shrink-0 h-11 w-11"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      <CreateGroupDialog
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={handleCreateGroup}
      />
    </motion.div>
  );
}
