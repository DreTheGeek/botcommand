import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBotData } from '@/hooks/useBotData';
import { useContentPosts } from '@/hooks/useExternalData';

function ContentTab() {
  const { data: entries } = useBotData({ botId: 'carter', category: 'content_stat' });
  const { data: extContent } = useContentPosts();
  const internalStats = (entries || []).map((e) => ({ id: e.id, ...(e.data as Record<string, any>) }));
  const stats = (extContent || []).length > 0 ? (extContent as any[]) : internalStats;
  const totalViews = stats.reduce((s: number, c: any) => s + (Number(c.views) || Number(c.view_count) || 0), 0);

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{totalViews.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Views</p></CardContent></Card>
      {stats.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No content stats yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((c: any) => (
          <Card key={c.id}>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium text-sm">{c.title || c.platform || 'Content Update'}</h3>
              <div className="flex justify-between text-xs text-muted-foreground">
                {(c.platform) && <Badge variant="outline">{c.platform}</Badge>}
                {(c.views || c.view_count) && <span>{Number(c.views || c.view_count).toLocaleString()} views</span>}
              </div>
              {c.engagement && <p className="text-xs text-muted-foreground">Engagement: {c.engagement}%</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AllDataTab() {
  const { data: entries } = useBotData({ botId: 'carter' });
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">All Carter Data</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {(entries || []).length === 0 && <p className="text-sm text-muted-foreground">No data entries yet.</p>}
        {(entries || []).map((e) => (
          <div key={e.id} className="p-3 rounded-lg bg-muted/30 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px]">{e.category}</Badge>
              <span className="text-[10px] text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
            </div>
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{JSON.stringify(e.data, null, 2)}</pre>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function CarterContent() {
  return (
    <BotPageLayout botId="carter" tabs={[
      { value: 'content', label: 'Content', content: <ContentTab /> },
      { value: 'all', label: 'All Data', content: <AllDataTab /> },
    ]} />
  );
}
