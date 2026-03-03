import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scheduledContent, platformStats, contentLibrary, fmt } from '@/data/mockData';

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

function ScheduledTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Scheduled Content</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Platform</th>
                <th className="pb-2 font-medium">Scheduled Time</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Content</th>
              </tr>
            </thead>
            <tbody>
              {scheduledContent.map((item) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{item.title}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-xs">{item.platform}</Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{item.scheduledTime}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={item.status === 'Published' ? 'outline' : item.status === 'Draft' ? 'outline' : 'outline'}
                      className={`text-xs ${
                        item.status === 'Published'
                          ? 'border-green-500 text-green-500'
                          : item.status === 'Draft'
                          ? 'border-yellow-500 text-yellow-500'
                          : ''
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{item.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformStatsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platformStats.map((ps) => (
        <Card key={ps.platform}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{ps.platform}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Followers</span>
              <span className="font-mono font-bold">{fmt.num(ps.followers)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Views</span>
              <span className="font-mono font-bold">{fmt.num(ps.views)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className="font-mono font-bold">{fmt.pct(ps.engagementRate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trend</span>
              <span className={`font-mono font-bold ${ps.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {ps.trend >= 0 ? '\u2191' : '\u2193'} {Math.abs(ps.trend)}%
              </span>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Top Post</p>
              <p className="text-sm font-medium">{ps.topPost}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContentLibraryTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Content Library</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Platform</th>
                <th className="pb-2 font-medium">Post Date</th>
                <th className="pb-2 font-medium text-right">Views</th>
                <th className="pb-2 font-medium text-right">Engagement %</th>
              </tr>
            </thead>
            <tbody>
              {contentLibrary.map((item) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{item.title}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-xs">{item.platform}</Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{fmt.date(item.postDate)}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.num(item.views)}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.pct(item.engagement)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CarterContent() {
  const tabs = [
    { value: 'scheduled', label: 'Scheduled', content: <ScheduledTab /> },
    { value: 'platforms', label: 'Platform Stats', content: <PlatformStatsTab /> },
    { value: 'library', label: 'Content Library', content: <ContentLibraryTab /> },
  ];

  return <BotPageLayout botId="carter" tabs={tabs} defaultTab="scheduled" />;
}
