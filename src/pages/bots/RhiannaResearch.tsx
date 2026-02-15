import { useState } from 'react';
import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { dailyBrief, opportunities, competitors, trends, contentIdeas, fmt } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Send, Lightbulb, Shield, TrendingUp, BookOpen } from 'lucide-react';

const tierColors: Record<string, string> = { Gold: 'destructive', Silver: 'default', Bronze: 'secondary' };
const stageColors: Record<string, string> = { Emerging: 'secondary', Growing: 'default', Mainstream: 'outline' };

function BriefTab() {
  const sections = [
    { title: 'Top Insights', icon: Lightbulb, items: dailyBrief.topInsights },
    { title: 'Opportunities', icon: TrendingUp, items: dailyBrief.opportunities },
    { title: 'Threats', icon: Shield, items: dailyBrief.threats },
    { title: 'Content Opportunities', icon: BookOpen, items: dailyBrief.contentOpportunities },
    { title: 'Recommended Actions', icon: Send, items: dailyBrief.recommendedActions },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Daily Intelligence Brief — {fmt.date(dailyBrief.date)}</CardTitle></CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['Top Insights', 'Recommended Actions']}>
          {sections.map((s) => (
            <AccordionItem key={s.title} value={s.title}>
              <AccordionTrigger className="text-sm"><div className="flex items-center gap-2"><s.icon className="h-4 w-4 text-primary" />{s.title} ({s.items.length})</div></AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {s.items.map((item, i) => <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-primary">{item}</li>)}
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
  const { toast } = useToast();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {opportunities.map((o) => (
        <Card key={o.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant={tierColors[o.tier] as any}>{o.tier}</Badge>
              <span className="text-xs text-muted-foreground">{o.source}</span>
            </div>
            <p className="text-sm font-medium">{o.problem}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{o.businessType}</span><span className="font-medium text-foreground">{o.dealSize}</span>
            </div>
            <Button size="sm" variant="outline" className="w-full" onClick={() => toast({ title: 'Sent to Ana Sales Analyst', description: o.problem })}>
              <Send className="h-3 w-3 mr-1" />Send to Ana
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CompetitorsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitors.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{c.name}</h3>
              <Badge variant="outline">{c.industry}</Badge>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Threat Level</span><span>{c.threatLevel}/10</span></div>
              <Progress value={c.threatLevel * 10} className={c.threatLevel >= 7 ? '[&>div]:bg-[hsl(var(--nexus-urgent))]' : c.threatLevel >= 5 ? '[&>div]:bg-[hsl(var(--nexus-warning))]' : ''} />
            </div>
            <p className="text-xs text-muted-foreground">{c.lastActivity}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><p className="font-medium text-[hsl(var(--nexus-success))]">Strengths</p>{c.strengths.map((s, i) => <p key={i} className="text-muted-foreground">• {s}</p>)}</div>
              <div><p className="font-medium text-[hsl(var(--nexus-urgent))]">Weaknesses</p>{c.weaknesses.map((w, i) => <p key={i} className="text-muted-foreground">• {w}</p>)}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrendsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trends.map((t) => (
        <Card key={t.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm">{t.name}</h3>
              <Badge variant={stageColors[t.stage] as any}>{t.stage}</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t.category}</span>
              <span className="font-bold text-primary">Score: {t.score}</span>
            </div>
            <p className="text-xs text-muted-foreground">Monetization: {t.monetizationPotential}</p>
            <div className="text-xs space-y-1">
              {t.signals.map((s, i) => <p key={i} className="text-muted-foreground">📡 {s}</p>)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContentIdeasTab() {
  const { toast } = useToast();
  const urgencyColor: Record<string, string> = { High: 'destructive', Medium: 'default', Low: 'secondary' };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contentIdeas.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm">{c.topic}</h3>
              <Badge variant={urgencyColor[c.urgency] as any}>{c.urgency}</Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Platform: {c.platform}</span>
            </div>
            <p className="text-xs text-muted-foreground">{c.whyPerformWell}</p>
            <Button size="sm" variant="outline" className="w-full" onClick={() => toast({ title: 'Sent to Carter Content', description: c.topic })}>
              <Send className="h-3 w-3 mr-1" />Send to Carter
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SettingsTab() {
  const [active, setActive] = useState(true);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Monitoring Sources</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Reddit Subreddits</span><span>12 monitored</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Twitter Keywords</span><span>24 tracked</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Google Trends</span><span>8 queries</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Scan Frequency</span><span>Every 2 hours</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Rhianna Active</p><p className="text-xs text-muted-foreground">Scanning for trends and opportunities</p></div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RhiannaResearch() {
  return (
    <BotPageLayout botId="rhianna" tabs={[
      { value: 'brief', label: "Today's Brief", content: <BriefTab /> },
      { value: 'opportunities', label: 'Opportunities', content: <OpportunitiesTab /> },
      { value: 'competitors', label: 'Competitors', content: <CompetitorsTab /> },
      { value: 'trends', label: 'Trends', content: <TrendsTab /> },
      { value: 'ideas', label: 'Content Ideas', content: <ContentIdeasTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
