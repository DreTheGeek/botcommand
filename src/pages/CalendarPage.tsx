import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { usePropertyDeals, useContentPosts, useDeals } from '@/hooks/useExternalData';

const BOTS = [
  { id: 'ronnie', name: 'Ronnie Realty' },
  { id: 'ana', name: 'Ana Sales' },
  { id: 'tammy', name: 'Tammy Trader' },
  { id: 'rhianna', name: 'Rhianna Research' },
  { id: 'deondre', name: 'Deondre Dropshipping' },
  { id: 'carter', name: 'Carter Content' },
];

const botColors: Record<string, string> = {
  ronnie: 'bg-[hsl(var(--nexus-success))]',
  ana: 'bg-[hsl(var(--nexus-info))]',
  tammy: 'bg-[hsl(var(--nexus-warning))]',
  trading: 'bg-[hsl(var(--nexus-warning))]',
  rhianna: 'bg-[hsl(var(--nexus-purple))]',
  deondre: 'bg-primary',
  carter: 'bg-[hsl(var(--nexus-urgent))]',
};

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  botId: string;
  type: string;
}

export default function CalendarPage() {
  const [filters, setFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(BOTS.map((b) => [b.id, true]))
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { data: propertyDeals = [], isLoading: loadingDeals } = usePropertyDeals(200);
  const { data: contentPosts = [], isLoading: loadingContent } = useContentPosts(100);
  const { data: anaDeals = [], isLoading: loadingAnaDeals } = useDeals(100);

  const isLoading = loadingDeals || loadingContent || loadingAnaDeals;

  // Build calendar events from real data
  const allEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];

    // Property sale dates from Ronnie
    (propertyDeals as any[]).forEach((deal) => {
      if (deal.sale_date) {
        events.push({
          id: `prop-${deal.id}`,
          title: deal.address || `Tax Sale — ${deal.county || deal.state || 'Unknown'}`,
          date: deal.sale_date.split('T')[0],
          botId: 'ronnie',
          type: 'Tax Sale',
        });
      }
    });

    // Content scheduled posts from Carter
    (contentPosts as any[]).forEach((post) => {
      const dateField = post.scheduled_at || post.publish_date || post.created_at;
      if (dateField) {
        events.push({
          id: `content-${post.id}`,
          title: post.title || `${post.platform || 'Social'} Post`,
          date: dateField.split('T')[0],
          botId: 'carter',
          type: 'Content',
        });
      }
    });

    // Ana deal close dates
    (anaDeals as any[]).forEach((deal) => {
      const dateField = deal.close_date || deal.expected_close || deal.updated_at;
      if (dateField && deal.stage && !['Won', 'Lost'].includes(deal.stage)) {
        events.push({
          id: `deal-${deal.id}`,
          title: `${deal.company || deal.name || 'Deal'} — ${deal.stage || 'Active'}`,
          date: dateField.split('T')[0],
          botId: 'ana',
          type: 'Deal',
        });
      }
    });

    return events;
  }, [propertyDeals, contentPosts, anaDeals]);

  const filtered = allEvents.filter((e) => filters[e.botId]);

  const eventDates = useMemo(
    () => filtered.map((e) => new Date(e.date + 'T12:00:00')),
    [filtered]
  );

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filtered.filter(
      (e) => new Date(e.date + 'T12:00:00').toDateString() === selectedDate.toDateString()
    );
  }, [filtered, selectedDate]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filtered
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);
  }, [filtered]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Unified Calendar</h1>
        {isLoading && <Skeleton className="h-4 w-32" />}
        {!isLoading && (
          <Badge variant="outline" className="text-xs">{allEvents.length} events total</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ event: eventDates }}
                modifiersClassNames={{ event: 'bg-primary/20 font-bold ring-1 ring-primary/40' }}
              />
            </CardContent>
          </Card>

          {selectedDate && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedEvents.length > 0
                    ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : `No events on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </CardTitle>
              </CardHeader>
              {selectedEvents.length > 0 && (
                <CardContent className="space-y-2">
                  {selectedEvents.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className={`h-3 w-3 rounded-full shrink-0 ${botColors[e.botId] || 'bg-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {BOTS.find((b) => b.id === e.botId)?.name || e.botId} · {e.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Filter by Bot</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {BOTS.map((b) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters[b.id]}
                    onCheckedChange={(v) => setFilters((f) => ({ ...f, [b.id]: !!v }))}
                  />
                  <div className={`h-2.5 w-2.5 rounded-full ${botColors[b.id] || 'bg-muted-foreground'}`} />
                  <span className="text-sm">{b.name}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {isLoading && (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              )}
              {!isLoading && upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
              )}
              {upcomingEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${botColors[e.botId] || 'bg-muted-foreground'}`} />
                  <span className="flex-1 truncate">{e.title}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
