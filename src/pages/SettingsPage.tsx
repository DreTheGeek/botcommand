import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { bots } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, User, Bell, Monitor, Shield } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ urgent: true, action: true, win: true, info: false });
  const [emergencyStop, setEmergencyStop] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            {bots.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50" onClick={() => navigate(b.route)}>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${b.status === 'active' ? 'bg-[hsl(var(--nexus-success))]' : 'bg-[hsl(var(--nexus-warning))]'}`} />
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
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Email</span><span>lasean@nexus.ai</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><Badge>Pro</Badge></div>
            <Button variant="outline" size="sm" className="w-full mt-2">Export All Data</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
