import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useBotData } from '@/hooks/useBotData';
import { useOpportunities } from '@/hooks/useExternalData';
import { Lightbulb, Target, AlertTriangle, Pencil, CheckCircle2 } from 'lucide-react';
import { dailyBrief, opportunities as mockOpportunities, competitors, trends, contentIdeas, fmt as mockFmt } from '@/data/mockData';

function TodaysBriefTab() {
  const b = dailyBrief;
  const sections = [
    { key: 'insights', title: 'Top Insights', items: b.topInsights, icon: <Lightbulb className="h-4 w-4 text-primary" /> },
    { key: 'opps', title: 'Opportunities', items: b.opportunities, icon: <Target className="h-4 w-4 text-[hsl(var(--nexus-success))]" /> },
    { key: 'threats', title: 'Threats', items: b.threats, icon: <AlertTriangle className="h-4 w-4 text-[hsl(var(--nexus-urgent))]" /> },
    { key: 'content', title: 'Content Opportunities', items: b.contentOpportunities, icon: <Pencil className="h-4 w-4 text-[hsl(var(--nexus-info))]" /> },
    { key: 'actions', title: 'Recommended Actions', items: b.recommendedActions, icon: <CheckCircle2 className="h-4 w-4 text-[hsl(var(--nexus-warning))]" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Intelligence Brief — {mockFmt.date(b.date)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['insights', 'opps', 'actions']} className="space-y-1">
          {sections.map((s) => (
            <AccordionItem key={s.key} value={s.key} className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  {s.icon}
                  <span className="font-medium">{s.title} ({s.items.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 pl-6">
                  {s.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function OpportunitiesTab() {
  const { data: extOpps } = useOpportunities();
  const opps = (extOpps || []).length > 0 ? (extOpps as any[]) : mockOpportunities;

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
                <TableCell>{o.businessType || o.business_type || o.type || ''}</TableCell>
                <TableCell>{o.dealSize || o.deal_size || ''}</TableCell>
                <TableCell><Badge variant="outline" className={tierColor(o.tier || '')}>{o.tier || '—'}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CompetitorsTab() {
  const threatColor = (level: number) => {
    if (level >= 8) return 'bg-[hsl(var(--nexus-urgent))]';
    if (level >= 6) return 'bg-[hsl(var(--nexus-warning))]';
    return 'bg-[hsl(var(--nexus-success))]';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitors.map((c) => (
        <Card key={c.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{c.name}</CardTitle>
              <Badge variant="outline">{c.industry}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Threat Level</span>
                <span className="font-medium">{c.threatLevel}/10</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${threatColor(c.threatLevel)}`} style={{ width: `${c.threatLevel * 10}%` }} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{c.lastActivity}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-[hsl(var(--nexus-success))] mb-1">Strengths</p>
                <ul className="space-y-0.5">
                  {c.strengths.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-[hsl(var(--nexus-urgent))] mb-1">Weaknesses</p>
                <ul className="space-y-0.5">
                  {c.weaknesses.map((w, i) => <li key={i} className="text-xs text-muted-foreground">• {w}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrendsTab() {
  const stageColor = (stage: string) => {
    switch (stage) {
      case 'Growing': return 'bg-[hsl(var(--nexus-success))]/10 text-[hsl(var(--nexus-success))] border-[hsl(var(--nexus-success))]/30';
      case 'Emerging': return 'bg-primary/10 text-primary border-primary/30';
      case 'Mainstream': return '';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trends.map((t) => (
        <Card key={t.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{t.name}</CardTitle>
              <Badge variant="outline" className={stageColor(t.stage)}>{t.stage}</Badge>
            </div>
            <Badge variant="outline" className="w-fit text-[10px]">{t.category}</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Score</span>
              <span className="font-bold text-primary">{t.score}</span>
            </div>
            <p className="text-xs text-muted-foreground">Potential: {t.monetizationPotential}</p>
            <div>
              <p className="text-xs font-medium mb-1">Signals</p>
              <ul className="space-y-0.5">
                {t.signals.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContentIdeasTab() {
  const urgencyColor = (u: string) => {
    switch (u) {
      case 'High': return 'bg-[hsl(var(--nexus-urgent))]/10 text-[hsl(var(--nexus-urgent))] border-[hsl(var(--nexus-urgent))]/30';
      case 'Medium': return 'bg-[hsl(var(--nexus-warning))]/10 text-[hsl(var(--nexus-warning))] border-[hsl(var(--nexus-warning))]/30';
      default: return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Why It Will Perform Well</TableHead>
              <TableHead>Urgency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentIdeas.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.topic}</TableCell>
                <TableCell><Badge variant="outline">{c.platform}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[300px]">{c.whyPerformWell}</TableCell>
                <TableCell><Badge variant="outline" className={urgencyColor(c.urgency)}>{c.urgency}</Badge></TableCell>
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
