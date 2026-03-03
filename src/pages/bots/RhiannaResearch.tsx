import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dailyBrief, opportunities, competitors, trends } from '@/data/mockData';

// --- Daily Brief Tab ---
function DailyBriefTab() {
  const sections = [
    { title: 'Top Insights', items: dailyBrief.topInsights },
    { title: 'Opportunities', items: dailyBrief.opportunities },
    { title: 'Threats', items: dailyBrief.threats },
    { title: 'Recommended Actions', items: dailyBrief.recommendedActions },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Daily Intelligence Brief &mdash; {dailyBrief.date}</p>
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader><CardTitle className="text-base">{section.title}</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Opportunities Tab ---
function OpportunitiesTab() {
  const tierColor: Record<string, string> = {
    Gold: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
    Silver: 'border-gray-400 text-gray-400 bg-gray-400/10',
    Bronze: 'border-orange-700 text-orange-700 bg-orange-700/10',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Detected Opportunities</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Problem</th>
              <th className="pb-2 font-medium">Source</th>
              <th className="pb-2 font-medium">Business Type</th>
              <th className="pb-2 font-medium">Deal Size</th>
              <th className="pb-2 font-medium">Tier</th>
            </tr></thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{opp.problem}</td>
                  <td className="py-2.5 text-muted-foreground text-xs">{opp.source}</td>
                  <td className="py-2.5 text-muted-foreground">{opp.businessType}</td>
                  <td className="py-2.5 font-mono">{opp.dealSize}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className={`text-xs ${tierColor[opp.tier] || ''}`}>
                      {opp.tier}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Competitors Tab ---
function CompetitorsTab() {
  const threatColor = (level: number) => {
    if (level >= 8) return 'bg-red-500';
    if (level >= 6) return 'bg-orange-500';
    if (level >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Competitor Intelligence</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Industry</th>
              <th className="pb-2 font-medium">Threat Level</th>
              <th className="pb-2 font-medium">Last Activity</th>
              <th className="pb-2 font-medium">Strengths</th>
              <th className="pb-2 font-medium">Weaknesses</th>
            </tr></thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{c.name}</td>
                  <td className="py-2.5 text-muted-foreground">{c.industry}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${threatColor(c.threatLevel)}`} style={{ width: `${c.threatLevel * 10}%` }} />
                      </div>
                      <span className="font-mono text-xs">{c.threatLevel}/10</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-muted-foreground text-xs">{c.lastActivity}</td>
                  <td className="py-2.5 text-xs">{c.strengths.join(', ')}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{c.weaknesses.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Trends Tab ---
function TrendsTab() {
  const stageColor: Record<string, string> = {
    Emerging: 'border-blue-500 text-blue-500',
    Growing: 'border-green-500 text-green-500',
    Mainstream: 'border-purple-500 text-purple-500',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Market Trends</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium text-right">Score</th>
              <th className="pb-2 font-medium">Stage</th>
              <th className="pb-2 font-medium">Monetization Potential</th>
            </tr></thead>
            <tbody>
              {trends.map((t) => (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{t.name}</td>
                  <td className="py-2.5 text-muted-foreground">{t.category}</td>
                  <td className="py-2.5 text-right font-mono">{t.score}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className={`text-xs ${stageColor[t.stage] || ''}`}>
                      {t.stage}
                    </Badge>
                  </td>
                  <td className="py-2.5 font-mono text-xs">{t.monetizationPotential}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---
export default function RhiannaResearch() {
  const tabs = [
    { value: 'brief', label: 'Daily Brief', content: <DailyBriefTab /> },
    { value: 'opportunities', label: 'Opportunities', content: <OpportunitiesTab /> },
    { value: 'competitors', label: 'Competitors', content: <CompetitorsTab /> },
    { value: 'trends', label: 'Trends', content: <TrendsTab /> },
  ];

  return <BotPageLayout botId="rhianna" tabs={tabs} defaultTab="brief" />;
}
