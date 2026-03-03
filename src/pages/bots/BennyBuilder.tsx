import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects, deployments, fmt } from '@/data/mockData';

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

// --- Projects Tab ---
function ProjectsTab() {
  const inProgress = projects.filter((p) => p.status === 'In Progress');
  const totalValue = projects.reduce((s, p) => s + p.value, 0);

  const statusColor: Record<string, string> = {
    'In Progress': 'border-blue-500 text-blue-500',
    'Completed': 'border-green-500 text-green-500',
    'Planning': 'border-yellow-500 text-yellow-500',
    'On Hold': 'border-gray-400 text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Projects" value={`${projects.length}`} />
        <StatCard label="In Progress" value={`${inProgress.length}`} />
        <StatCard label="Total Value" value={fmt.money(totalValue)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Projects</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Client</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Progress</th>
                <th className="pb-2 font-medium">Deadline</th>
                <th className="pb-2 font-medium">Tech</th>
                <th className="pb-2 font-medium text-right">Value</th>
              </tr></thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5 text-muted-foreground">{p.client}</td>
                    <td className="py-2.5">
                      <Badge variant="outline" className={`text-xs ${statusColor[p.status] || ''}`}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${p.progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-muted-foreground whitespace-nowrap">{p.deadline}</td>
                    <td className="py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {p.tech.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono">{p.value > 0 ? fmt.money(p.value) : '-'}</td>
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

// --- Deployments Tab ---
function DeploymentsTab() {
  const statusColor: Record<string, string> = {
    success: 'border-green-500 text-green-500',
    failed: '',
    deploying: 'border-yellow-500 text-yellow-500',
  };

  const envColor: Record<string, string> = {
    Production: 'border-red-500 text-red-500',
    Staging: 'border-yellow-500 text-yellow-500',
    Development: 'border-blue-500 text-blue-500',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Recent Deployments</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Project</th>
              <th className="pb-2 font-medium">Environment</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Timestamp</th>
              <th className="pb-2 font-medium">Version</th>
            </tr></thead>
            <tbody>
              {deployments.map((d) => (
                <tr key={d.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{d.project}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className={`text-xs ${envColor[d.environment] || ''}`}>
                      {d.environment}
                    </Badge>
                  </td>
                  <td className="py-2.5">
                    <Badge
                      variant={d.status === 'failed' ? 'destructive' : 'outline'}
                      className={`text-xs ${statusColor[d.status] || ''}`}
                    >
                      {d.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground whitespace-nowrap font-mono text-xs">{d.timestamp}</td>
                  <td className="py-2.5 font-mono">{d.version}</td>
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
export default function BennyBuilder() {
  const tabs = [
    { value: 'projects', label: 'Projects', content: <ProjectsTab /> },
    { value: 'deployments', label: 'Deployments', content: <DeploymentsTab /> },
  ];

  return <BotPageLayout botId="benny" tabs={tabs} defaultTab="projects" />;
}
