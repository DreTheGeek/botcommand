import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prospects, proposals, activities, fmt } from '@/data/mockData';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-lg font-mono font-bold text-primary">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

// --- Pipeline Tab ---
function PipelineTab() {
  const active = prospects.filter((p) => !['Won', 'Lost'].includes(p.stage));
  const pipelineValue = active.reduce((s, p) => s + p.dealSize, 0);
  const wonValue = prospects.filter((p) => p.stage === 'Won').reduce((s, p) => s + p.dealSize, 0);

  const stageColor: Record<string, string> = {
    Lead: 'border-blue-500 text-blue-500',
    Qualified: 'border-cyan-500 text-cyan-500',
    Proposal: 'border-yellow-500 text-yellow-500',
    Negotiating: 'border-orange-500 text-orange-500',
    Won: 'border-green-500 text-green-500',
    Lost: '',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Pipeline Value" value={fmt.money(pipelineValue)} />
        <StatCard label="Active Deals" value={`${active.length}`} />
        <StatCard label="Won Value" value={fmt.money(wonValue)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Prospect Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 font-medium">Contact</th>
                <th className="pb-2 font-medium text-right">Deal Size</th>
                <th className="pb-2 font-medium">Stage</th>
                <th className="pb-2 font-medium text-right">Days in Stage</th>
                <th className="pb-2 font-medium">Next Action</th>
              </tr></thead>
              <tbody>
                {prospects.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{p.company}</td>
                    <td className="py-2.5 text-muted-foreground">{p.contact}</td>
                    <td className="py-2.5 text-right font-mono">{fmt.money(p.dealSize)}</td>
                    <td className="py-2.5">
                      <Badge
                        variant={p.stage === 'Lost' ? 'destructive' : 'outline'}
                        className={`text-xs ${stageColor[p.stage] || ''}`}
                      >
                        {p.stage}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right">{p.daysInStage}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{p.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Proposals Tab ---
function ProposalsTab() {
  const statusColor: Record<string, string> = {
    Sent: 'border-blue-500 text-blue-500',
    Viewed: 'border-yellow-500 text-yellow-500',
    Accepted: 'border-green-500 text-green-500',
    Rejected: '',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Proposals</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Company</th>
              <th className="pb-2 font-medium">Sent Date</th>
              <th className="pb-2 font-medium text-right">Deal Size</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Views</th>
              <th className="pb-2 font-medium text-right">Engagement</th>
            </tr></thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{p.company}</td>
                  <td className="py-2.5 text-muted-foreground whitespace-nowrap">{p.sentDate}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.money(p.dealSize)}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={p.status === 'Rejected' ? 'destructive' : 'outline'}
                      className={`text-xs ${statusColor[p.status] || ''}`}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-right font-mono">{p.views}</td>
                  <td className="py-2.5 text-right font-mono">{p.engagementScore}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Activities Tab ---
function ActivitiesTab() {
  const typeColor: Record<string, string> = {
    call: 'border-green-500 text-green-500',
    email: 'border-blue-500 text-blue-500',
    meeting: 'border-purple-500 text-purple-500',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Recent Activities</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Prospect</th>
              <th className="pb-2 font-medium">Subject</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Outcome</th>
            </tr></thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b border-border/50">
                  <td className="py-2.5">
                    <Badge variant="outline" className={`text-xs ${typeColor[a.type] || ''}`}>
                      {a.type}
                    </Badge>
                  </td>
                  <td className="py-2.5 font-medium">{a.prospect}</td>
                  <td className="py-2.5 text-muted-foreground">{a.subject}</td>
                  <td className="py-2.5 text-muted-foreground whitespace-nowrap">{a.date}</td>
                  <td className="py-2.5 text-xs">{a.outcome}</td>
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
export default function SarahSales() {
  const tabs = [
    { value: 'pipeline', label: 'Pipeline', content: <PipelineTab /> },
    { value: 'proposals', label: 'Proposals', content: <ProposalsTab /> },
    { value: 'activities', label: 'Activities', content: <ActivitiesTab /> },
  ];

  return <BotPageLayout botId="sarah" tabs={tabs} defaultTab="pipeline" />;
}
