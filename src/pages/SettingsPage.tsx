import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, User, Bell, Monitor, Shield, ExternalLink, MessageCircle, Github, HardDrive, Workflow, Database, Send, Bot, Briefcase, Building2, Video, Code2, ShoppingBag, TrendingUp, Home, Search } from 'lucide-react';

const ALL_BOTS = [
  { id: 'optimus', name: 'Optimus Prime', route: '/bots/optimus', status: 'active', Icon: Bot },
  { id: 'ana', name: 'Ana Sales', route: '/bots/ana', status: 'active', Icon: Briefcase },
  { id: 'benny', name: 'Benny Business Maker', route: '/bots/benny', status: 'active', Icon: Building2 },
  { id: 'carter', name: 'Carter Content', route: '/bots/carter', status: 'active', Icon: Video },
  { id: 'cleah', name: 'Cleah Coding', route: '/bots/cleah', status: 'active', Icon: Code2 },
  { id: 'deondre', name: 'Deondre Dropshipping', route: '/bots/deondre', status: 'active', Icon: ShoppingBag },
  { id: 'rhianna', name: 'Rhianna Research', route: '/bots/rhianna', status: 'active', Icon: Search },
  { id: 'ronnie', name: 'Ronnie Realty', route: '/bots/ronnie', status: 'active', Icon: Home },
  { id: 'tammy', name: 'Tammy Trader', route: '/bots/trading', status: 'active', Icon: TrendingUp },
];

const telegramBots = [
  { id: 'ronnie', name: 'Ronnie Realty', color: 'text-[hsl(var(--nexus-success))]' },
  { id: 'ana', name: 'Ana Sales', color: 'text-[hsl(var(--nexus-info))]' },
  { id: 'tammy', name: 'Tammy Trader', color: 'text-[hsl(var(--nexus-warning))]' },
  { id: 'rhianna', name: 'Rhianna Research', color: 'text-[hsl(var(--nexus-purple))]' },
  { id: 'deondre', name: 'Deondre Dropshipping', color: 'text-primary' },
  { id: 'carter', name: 'Carter Content', color: 'text-[hsl(var(--nexus-urgent))]' },
];

const otherIntegrations = [
  { name: 'GitHub', icon: Github, status: 'connected', color: 'text-foreground', url: 'https://github.com', description: 'Code sync & deployments' },
  { name: 'Google Drive', icon: HardDrive, status: 'not_connected', color: 'text-[hsl(var(--nexus-warning))]', url: 'https://drive.google.com', description: 'Document storage & sharing' },
  { name: 'n8n Automation', icon: Workflow, status: 'not_connected', color: 'text-accent', url: 'https://n8n.io', description: 'Workflow triggers & webhooks' },
  { name: 'Database', icon: Database, status: 'connected', color: 'text-[hsl(var(--nexus-success))]', url: null, description: 'Lovable Cloud backend' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({ urgent: true, action: true, win: true, info: false });
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [sendingBot, setSendingBot] = useState<string | null>(null);

  const sendTestMessage = async (botId: string, botName: string) => {
    setSendingBot(botId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Not authenticated', description: 'Please sign in first.', variant: 'destructive' });
        return;
      }
      const res = await supabase.functions.invoke('send-telegram', {
        body: { bot_id: botId, message: `✅ Test from NEXUS: ${botName} is connected!` },
      });
      if (res.error) throw res.error;
      toast({ title: 'Sent!', description: `Test message sent via ${botName}.` });
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message || 'Could not send message.', variant: 'destructive' });
    } finally {
      setSendingBot(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Telegram Bots */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageCircle className="h-4 w-4" />Telegram Notifications</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {telegramBots.map((bot) => (
                <div key={bot.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <MessageCircle className={`h-5 w-5 ${bot.color}`} />
                    <div>
                      <p className="text-sm font-medium">{bot.name}</p>
                      <p className="text-xs text-muted-foreground">Bot notifications</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    disabled={sendingBot === bot.id}
                    onClick={() => sendTestMessage(bot.id, bot.name)}
                  >
                    <Send className="h-3 w-3" />
                    {sendingBot === bot.id ? 'Sending...' : 'Test'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Other Integrations */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Workflow className="h-4 w-4" />Other Integrations</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherIntegrations.map((intg) => (
                <div key={intg.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <intg.icon className={`h-5 w-5 ${intg.color}`} />
                    <div>
                      <p className="text-sm font-medium">{intg.name}</p>
                      <p className="text-xs text-muted-foreground">{intg.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={intg.status === 'connected' ? 'default' : 'outline'} className="text-[10px]">
                      {intg.status === 'connected' ? 'Connected' : 'Not Connected'}
                    </Badge>
                    {intg.url && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={intg.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Monitor className="h-4 w-4" />System Monitoring</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'API Usage', value: 68 },
              { label: 'Storage', value: 23 },
              { label: 'Compute', value: 45 },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-sm"><span>{m.label}</span><span>{m.value}%</span></div>
                <Progress value={m.value} />
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="default">All Systems Operational</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key} Alerts</span>
                <Switch checked={value} onCheckedChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" />Bot Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {ALL_BOTS.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50" onClick={() => navigate(b.route)}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--nexus-success))]" />
                  <span className="text-sm font-medium">{b.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">Configure →</Badge>
              </div>
            ))}
            <div className="pt-3 border-t mt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--nexus-urgent))]" />
                  <div>
                    <p className="text-sm font-medium">Emergency Stop All Bots</p>
                    <p className="text-xs text-muted-foreground">Immediately pause all bot operations</p>
                  </div>
                </div>
                <Switch checked={emergencyStop} onCheckedChange={setEmergencyStop} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />User Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span>LaSean</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Email</span><span>{user?.email ?? 'Not logged in'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><Badge>Pro</Badge></div>
            <Button variant="outline" size="sm" className="w-full mt-2">Export All Data</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
