import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useBotData } from '@/hooks/useBotData';
import { useContentPosts, useContentPerformance } from '@/hooks/useExternalData';
import { scheduledContent, platformStats, contentLibrary, fmt as mockFmt } from '@/data/mockData';

function CalendarTab() {
  const platformColor = (platform: string) => {
    switch (platform) {
      case 'YouTube': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'TikTok': return 'bg-primary/10 text-primary border-primary/30';
      case 'X': return '';
      case 'Instagram': return 'bg-[hsl(var(--nexus-purple))]/10 text-[hsl(var(--nexus-purple))] border-[hsl(var(--nexus-purple))]/30';
      case 'LinkedIn': return 'bg-[hsl(var(--nexus-info))]/10 text-[hsl(var(--nexus-info))] border-[hsl(var(--nexus-info))]/30';
      case 'Facebook': return 'bg-[hsl(var(--nexus-info))]/10 text-[hsl(var(--nexus-info))] border-[hsl(var(--nexus-info))]/30';
      default: return '';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-primary/10 text-primary border-primary/30';
      case 'Published': return 'bg-[hsl(var(--nexus-success))]/10 text-[hsl(var(--nexus-success))] border-[hsl(var(--nexus-success))]/30';
      default: return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledContent.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell><Badge variant="outline" className={platformColor(c.platform)}>{c.platform}</Badge></TableCell>
                <TableCell className="text-sm">{new Date(c.scheduledTime).toLocaleString()}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor(c.status)}>{c.status}</Badge></TableCell>
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{mockFmt.num(totalViews)}</p><p className="text-xs text-muted-foreground">Total Views</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{mockFmt.num(totalFollowers)}</p><p className="text-xs text-muted-foreground">Total Followers</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{avgEngagement.toFixed(1)}%</p><p className="text-xs text-muted-foreground">Avg Engagement</p></CardContent></Card>
    </div>
  );
}

function PlatformStatsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platformStats.map((p) => (
        <Card key={p.platform}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{p.platform}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Followers:</span> <span className="font-medium">{mockFmt.num(p.followers)}</span></div>
              <div><span className="text-muted-foreground">Views:</span> <span className="font-medium">{mockFmt.num(p.views)}</span></div>
              <div><span className="text-muted-foreground">Engagement:</span> <span className="font-medium">{p.engagementRate}%</span></div>
              <div>
                <span className="text-muted-foreground">Trend:</span>{' '}
                <span className={`font-medium ${p.trend >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>
                  {p.trend >= 0 ? '+' : ''}{p.trend}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Top: {p.topPost}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContentLibraryTab() {
  const { data: extContent } = useContentPosts();
  const items = (extContent || []).length > 0 ? (extContent as any[]) : contentLibrary;

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Post Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Engagement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell><Badge variant="outline">{c.platform}</Badge></TableCell>
                <TableCell>{mockFmt.date(c.postDate || c.post_date || c.created_at || '')}</TableCell>
                <TableCell className="text-right">{mockFmt.num(Number(c.views || c.view_count || 0))}</TableCell>
                <TableCell className="text-right">{c.engagement || c.engagement_rate || 0}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Content Strategy</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Posts Per Day', value: '3-5' },
            { label: 'Active Platforms', value: '6' },
            { label: 'Content Mix', value: '60% short, 40% long' },
            { label: 'Best Post Time', value: '10 AM & 6 PM' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Bot Active</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Auto-Schedule</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cross-Post</span>
            <Switch defaultChecked />
          </div>
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
      { value: 'platforms', label: 'Platform Stats', content: <PlatformStatsTab /> },
      { value: 'library', label: 'Content Library', content: <ContentLibraryTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
