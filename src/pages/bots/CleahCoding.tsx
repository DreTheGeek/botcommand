import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { codeMetrics, pullRequests, bugReports } from '@/data/mockData';

function CodeMetricsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {codeMetrics.map((metric) => (
        <Card key={metric.name}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{metric.name}</p>
            <p className="text-2xl font-mono font-bold text-primary mt-1">{metric.value}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm ${
                metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {metric.trend === 'up' ? '\u2191' : metric.trend === 'down' ? '\u2193' : '\u2192'}
              </span>
              <span className="text-xs text-muted-foreground">{metric.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PullRequestsTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Pull Requests</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Repo</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium text-right">Files Changed</th>
                <th className="pb-2 font-medium text-right">Changes</th>
                <th className="pb-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {pullRequests.map((pr) => (
                <tr key={pr.id} className="border-b border-border/50">
                  <td className="py-2.5 font-mono text-muted-foreground">{pr.id}</td>
                  <td className="py-2.5 font-medium">{pr.title}</td>
                  <td className="py-2.5 text-muted-foreground">{pr.repo}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={pr.status === 'merged' ? 'outline' : pr.status === 'closed' ? 'destructive' : 'outline'}
                      className={`text-xs ${
                        pr.status === 'merged'
                          ? 'border-green-500 text-green-500'
                          : pr.status === 'open'
                          ? 'border-blue-500 text-blue-500'
                          : ''
                      }`}
                    >
                      {pr.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-right font-mono">{pr.filesChanged}</td>
                  <td className="py-2.5 text-right font-mono">
                    <span className="text-green-500">+{pr.additions}</span>
                    {' / '}
                    <span className="text-red-500">-{pr.deletions}</span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{pr.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function BugTrackerTab() {
  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'outline';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const severityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return '';
      case 'high': return 'border-orange-500 text-orange-500';
      case 'medium': return 'border-yellow-500 text-yellow-500';
      case 'low': return '';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Bug Tracker</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Severity</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Repo</th>
                <th className="pb-2 font-medium">Reported</th>
                <th className="pb-2 font-medium">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {bugReports.map((bug) => (
                <tr key={bug.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{bug.title}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={severityColor(bug.severity) as 'outline' | 'destructive'}
                      className={`text-xs ${severityClass(bug.severity)}`}
                    >
                      {bug.severity}
                    </Badge>
                  </td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-xs">{bug.status}</Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{bug.repo}</td>
                  <td className="py-2.5 text-muted-foreground">{bug.reported}</td>
                  <td className="py-2.5">{bug.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CleahCoding() {
  const tabs = [
    { value: 'metrics', label: 'Code Metrics', content: <CodeMetricsTab /> },
    { value: 'prs', label: 'Pull Requests', content: <PullRequestsTab /> },
    { value: 'bugs', label: 'Bug Tracker', content: <BugTrackerTab /> },
  ];

  return <BotPageLayout botId="cleah" tabs={tabs} defaultTab="metrics" />;
}
