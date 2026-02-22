import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useContentPosts, useContentPerformance } from '@/hooks/useExternalData';

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

const fmtNum = (n: number) => n.toLocaleString();
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString() : '\u2014';

function getViews(p: any): number { return Number(p.impressions) || Number(p.views) || Number(p.view_count) || 0; }
function getFollowers(p: any): number { return Number(p.followers_gained) || Number(p.followers) || 0; }

function CalendarTab() {
  const { data: extContent } = useContentPosts();
  const items = (extContent || []) as any[];

  const platformColor = (platform: string) => {
    switch ((platform || '').toLowerCase()) {
      case 'youtube': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'tiktok': return 'bg-primary/10 text-primary border-primary/30';
      case 'x': case 'twitter': return '';
      case 'instagram': return 'bg-[hsl(var(--nexus-purple))]/10 text-[hsl(var(--nexus-purple))] border-[hsl(var(--nexus-purple))]/30';
      case 'linkedin': case 'facebook': return 'bg-[hsl(var(--nexus-info))]/10 text-[hsl(var(--nexus-info))] border-[hsl(var(--nexus-info))]/30';
      default: return '';
    }
  };

  const statusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'scheduled': case 'ready': return 'bg-primary/10 text-primary border-primary/30';
      case 'published': return 'bg-[hsl(var(--nexus-success))]/10 text-[hsl(var(--nexus-success))] border-[hsl(var(--nexus-success))]/30';
      default: return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {items.length === 0 ? <EmptyState message="No content scheduled yet" /> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Platform</TableHead><TableHead>Scheduled</TableHead><TableHead>Status</TableHead><TableHead>Content</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {items.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title || '\u2014'}</TableCell>
                  <TableCell><Badge variant="outline" className={platformColor(c.platform || '')}>{c.platform || '\u2014'}</Badge></TableCell>
                  <TableCell className="text-sm">{fmtDate(c.scheduled_time || c.scheduled_for || c.created_at || '')}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColor(c.status || '')}>{c.status || '\u2014'}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{c.content || c.description || c.notes || '\u2014'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function PerformanceTab() {
  const { data: extPerf } = useContentPerformance();
  const perfData = (extPerf || []) as any[];
  const totalViews = perfData.reduce((s, p: any) => s + getViews(p), 0);
  const totalFollowers = perfData.reduce((s, p: any) => s + getFollowers(p), 0);
  const avgEngagement = perfData.length > 0 ? perfData.reduce((s, p: any) => s + (Number(p.engagement_rate) || 0), 0) / perfData.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmtNum(totalViews)}</p><p className="text-xs text-muted-foreground">Total Views</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmtNum(totalFollowers)}</p><p className="text-xs text-muted-foreground">Total Followers</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{avgEngagement.toFixed(1)}%</p><p className="text-xs text-muted-foreground">Avg Engagement</p></CardContent></Card>
    </div>
  );
}

function PlatformStatsTab() {
  const { data: extPerf } = useContentPerformance();
  const perfData = (extPerf || []) as any[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {perfData.length === 0 && <EmptyState message="No platform stats yet" />}
      {perfData.map((p: any) => (
        <Card key={p.id || p.platform}>
          <CardHeader className="pb-2"><CardTitle className="text-base">{p.platform || '\u2014'}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Followers:</span> <span className="font-medium">{fmtNum(getFollowers(p))}</span></div>
              <div><span className="text-muted-foreground">Views:</span> <span className="font-medium">{fmtNum(getViews(p))}</span></div>
              <div><span className="text-muted-foreground">Engagement:</span> <span className="font-medium">{p.engagement_rate || 0}%</span></div>
              <div><span className="text-muted-foreground">Likes:</span> <span className="font-medium">{fmtNum(Number(p.likes) || 0)}</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContentLibraryTab() {
  const { data: extContent } = useContentPosts();
  const items = (extContent || []) as any[];

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {items.length === 0 ? <EmptyState message="No content in library yet" /> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Platform</TableHead><TableHead>Post Date</TableHead><TableHead className="text-right">Views</TableHead><TableHead className="text-right">Engagement</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {items.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title || '\u2014'}</TableCell>
                  <TableCell><Badge variant="outline">{c.platform || '\u2014'}</Badge></TableCell>
                  <TableCell>{fmtDate(c.post_date || c.published_at || c.created_at || '')}</TableCell>
                  <TableCell className="text-right">{fmtNum(Number(c.views) || Number(c.view_count) || 0)}</TableCell>
                  <TableCell className="text-right">{c.engagement_rate || 0}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
          <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Bot Active</span><Switch defaultChecked /></div>
          <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Auto-Schedule</span><Switch defaultChecked /></div>
          <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Cross-Post</span><Switch defaultChecked /></div>
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
