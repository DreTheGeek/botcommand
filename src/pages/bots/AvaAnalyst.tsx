import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { kpiSnapshots, analyticsReports, anomalies } from '@/data/mockData';

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

// --- KPI Dashboard Tab ---
function KpiDashboardTab() {
  const topKpis = kpiSnapshots.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {topKpis.map((kpi) => (
          <StatCard key={kpi.id} label={kpi.name} value={kpi.value} />
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">KPI Snapshots</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">KPI Name</th>
                <th className="pb-2 font-medium">Value</th>
                <th className="pb-2 font-medium">Target</th>
                <th className="pb-2 font-medium">Trend</th>
                <th className="pb-2 font-medium text-right">Change</th>
              </tr></thead>
              <tbody>
                {kpiSnapshots.map((kpi) => (
                  <tr key={kpi.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{kpi.name}</td>
                    <td className="py-2.5 font-mono">{kpi.value}</td>
                    <td className="py-2.5 font-mono text-muted-foreground">{kpi.target}</td>
                    <td className="py-2.5">
                      <span className={kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}>
                        {kpi.trend === 'up' ? '\u2191' : kpi.trend === 'down' ? '\u2193' : '\u2192'}
                      </span>
                    </td>
                    <td className={`py-2.5 text-right font-mono ${kpi.change.startsWith('+') ? 'text-green-500' : kpi.change.startsWith('-') ? 'text-red-500' : ''}`}>
                      {kpi.change}
                    </td>
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

// --- Reports Tab ---
function ReportsTab() {
  const statusColor: Record<string, string> = {
    delivered: 'border-green-500 text-green-500',
    draft: 'border-yellow-500 text-yellow-500',
    scheduled: 'border-blue-500 text-blue-500',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Analytics Reports</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Summary</th>
            </tr></thead>
            <tbody>
              {analyticsReports.map((report) => (
                <tr key={report.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{report.title}</td>
                  <td className="py-2.5"><Badge variant="outline" className="text-xs">{report.type}</Badge></td>
                  <td className="py-2.5 text-muted-foreground whitespace-nowrap">{report.date}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className={`text-xs ${statusColor[report.status] || ''}`}>
                      {report.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground text-xs max-w-xs truncate">{report.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Anomalies Tab ---
function AnomaliesTab() {
  const severityColor: Record<string, string> = {
    low: 'border-blue-500 text-blue-500',
    medium: 'border-yellow-500 text-yellow-500',
    high: 'border-orange-500 text-orange-500',
    critical: '',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Detected Anomalies</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Metric</th>
              <th className="pb-2 font-medium">Expected</th>
              <th className="pb-2 font-medium">Actual</th>
              <th className="pb-2 font-medium">Deviation</th>
              <th className="pb-2 font-medium">Severity</th>
            </tr></thead>
            <tbody>
              {anomalies.map((a) => (
                <tr key={a.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{a.metric}</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{a.expected}</td>
                  <td className="py-2.5 font-mono">{a.actual}</td>
                  <td className={`py-2.5 font-mono ${a.deviation.startsWith('+') ? 'text-red-500' : a.deviation.startsWith('-') ? 'text-green-500' : ''}`}>
                    {a.deviation}
                  </td>
                  <td className="py-2.5">
                    <Badge
                      variant={a.severity === 'critical' ? 'destructive' : 'outline'}
                      className={`text-xs ${severityColor[a.severity] || ''}`}
                    >
                      {a.severity}
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

// --- Main Page ---
export default function AvaAnalyst() {
  const tabs = [
    { value: 'kpi', label: 'KPI Dashboard', content: <KpiDashboardTab /> },
    { value: 'reports', label: 'Reports', content: <ReportsTab /> },
    { value: 'anomalies', label: 'Anomalies', content: <AnomaliesTab /> },
  ];

  return <BotPageLayout botId="ava" tabs={tabs} defaultTab="kpi" />;
}
