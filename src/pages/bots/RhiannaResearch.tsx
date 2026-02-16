import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBotData } from '@/hooks/useBotData';
import { useOpportunities } from '@/hooks/useExternalData';

function ResearchTab() {
  const { data: entries } = useBotData({ botId: 'rhianna', category: 'research' });
  const { data: extOpps } = useOpportunities();
  const internalItems = entries || [];
  const items = (extOpps || []).length > 0 ? (extOpps as any[]) : internalItems;

  return (
    <div className="space-y-4">
      {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No research data yet.</p>}
      {items.map((item: any) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[10px]">{item.category || item.type || 'opportunity'}</Badge>
              <span className="text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm">{item.title || item.description || ''}</p>
            {item.data && <pre className="text-xs whitespace-pre-wrap text-muted-foreground mt-2">{JSON.stringify(item.data, null, 2)}</pre>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AllDataTab() {
  const { data: entries } = useBotData({ botId: 'rhianna' });
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">All Rhianna Data</CardTitle></CardHeader>
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

export default function RhiannaResearch() {
  return (
    <BotPageLayout botId="rhianna" tabs={[
      { value: 'research', label: 'Research', content: <ResearchTab /> },
      { value: 'all', label: 'All Data', content: <AllDataTab /> },
    ]} />
  );
}
