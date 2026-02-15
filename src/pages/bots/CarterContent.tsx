import { useState } from 'react';
import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { scheduledContent, platformStats, contentLibrary, fmt } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const platformColor: Record<string, string> = {
  YouTube: 'destructive', TikTok: 'default', X: 'secondary', Instagram: 'outline', LinkedIn: 'default', Facebook: 'secondary',
};

function CalendarTab() {
  const statusColor: Record<string, string> = { Scheduled: 'default', Published: 'secondary', Draft: 'outline' };
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Platform</TableHead><TableHead>Scheduled</TableHead><TableHead>Status</TableHead><TableHead>Content</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {scheduledContent.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell><Badge variant={platformColor[c.platform] as any}>{c.platform}</Badge></TableCell>
                <TableCell className="text-sm">{c.scheduledTime}</TableCell>
                <TableCell><Badge variant={statusColor[c.status] as any}>{c.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PerformanceTab() {
  const totalViews = platformStats.reduce((s, p) => s + p.views, 0);
  const totalFollowers = platformStats.reduce((s, p) => s + p.followers, 0);
  const avgEngagement = platformStats.reduce((s, p) => s + p.engagementRate, 0) / platformStats.length;
  const chartData = platformStats.map((p) => ({ platform: p.platform, views: p.views / 1000, engagement: p.engagementRate }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: fmt.num(totalViews) },
          { label: 'Total Followers', value: fmt.num(totalFollowers) },
          { label: 'Avg Engagement', value: fmt.pct(avgEngagement) },
          { label: 'Posts This Week', value: scheduledContent.length.toString() },
        ].map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Views by Platform (K)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip /><Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function PlatformStatsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platformStats.map((p) => (
        <Card key={p.platform}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{p.platform}</h3>
              <div className={`flex items-center gap-1 text-xs ${p.trend >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>
                {p.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {p.trend >= 0 ? '+' : ''}{p.trend}%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-muted-foreground text-xs">Followers</p><p className="font-medium">{fmt.num(p.followers)}</p></div>
              <div><p className="text-muted-foreground text-xs">Views</p><p className="font-medium">{fmt.num(p.views)}</p></div>
              <div><p className="text-muted-foreground text-xs">Engagement</p><p className="font-medium">{fmt.pct(p.engagementRate)}</p></div>
              <div><p className="text-muted-foreground text-xs">Top Post</p><p className="font-medium truncate text-xs">{p.topPost}</p></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LibraryTab() {
  const [search, setSearch] = useState('');
  const filtered = contentLibrary.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.platform.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Title</TableHead><TableHead>Platform</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Views</TableHead><TableHead className="text-right">Engagement</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell><Badge variant={platformColor[c.platform] as any}>{c.platform}</Badge></TableCell>
                  <TableCell>{fmt.date(c.postDate)}</TableCell>
                  <TableCell className="text-right">{fmt.num(c.views)}</TableCell>
                  <TableCell className="text-right">{fmt.pct(c.engagement)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  const [active, setActive] = useState(true);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Content Pillars</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {['AI & Automation', 'Entrepreneurship', 'Behind the Scenes', 'Tutorials'].map((p) => (
            <div key={p} className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /><span>{p}</span></div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Carter Active</p><p className="text-xs text-muted-foreground">Creating and scheduling content</p></div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Posts This Week</span><span>{scheduledContent.filter((c) => c.status !== 'Draft').length}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CarterContent() {
  return (
    <BotPageLayout botId="carter" tabs={[
      { value: 'calendar', label: 'Calendar', content: <CalendarTab /> },
      { value: 'performance', label: 'Performance', content: <PerformanceTab /> },
      { value: 'stats', label: 'Platform Stats', content: <PlatformStatsTab /> },
      { value: 'library', label: 'Content Library', content: <LibraryTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
