import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useOpportunities } from '@/hooks/useExternalData';

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

function TodaysBriefTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Intelligence Brief</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState message="No brief data available yet" />
      </CardContent>
    </Card>
  );
}

function OpportunitiesTab() {
  const { data: extOpps } = useOpportunities();
  const opps = (extOpps || []) as any[];

  const tierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'bg-[hsl(var(--nexus-warning))]/10 text-[hsl(var(--nexus-warning))] border-[hsl(var(--nexus-warning))]/30';
      case 'Silver': return 'bg-muted text-muted-foreground';
      case 'Bronze': return 'bg-[hsl(var(--nexus-warning))]/5 text-[hsl(var(--nexus-warning))]/70 border-[hsl(var(--nexus-warning))]/20';
      default: return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {opps.length === 0 ? <EmptyState message="No opportunities found yet" /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Deal Size</TableHead>
                <TableHead>Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opps.map((o: any) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium max-w-[300px]">{o.problem || o.title || o.description || ''}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.source || ''}</TableCell>
                  <TableCell>{o.business_type || o.type || ''}</TableCell>
                  <TableCell>{o.deal_size || ''}</TableCell>
                  <TableCell><Badge variant="outline" className={tierColor(o.tier || '')}>{o.tier || '—'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function CompetitorsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EmptyState message="No competitor data yet" />
    </div>
  );
}

function TrendsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <EmptyState message="No trends detected yet" />
    </div>
  );
}

function ContentIdeasTab() {
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <EmptyState message="No content ideas yet" />
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Research Parameters</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Scan Frequency', value: 'Every 4 hours' },
            { label: 'Sources Monitored', value: '14' },
            { label: 'Min Opportunity Score', value: '60' },
            { label: 'Competitor Watch List', value: '4 companies' },
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
            <span className="text-sm text-muted-foreground">Auto-Brief</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Competitor Alerts</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RhiannaResearch() {
  return (
    <BotPageLayout botId="rhianna" tabs={[
      { value: 'brief', label: "Today's Brief", content: <TodaysBriefTab /> },
      { value: 'opportunities', label: 'Opportunities', content: <OpportunitiesTab /> },
      { value: 'competitors', label: 'Competitors', content: <CompetitorsTab /> },
      { value: 'trends', label: 'Trends', content: <TrendsTab /> },
      { value: 'content', label: 'Content Ideas', content: <ContentIdeasTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
