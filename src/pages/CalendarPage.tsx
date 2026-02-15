import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { calendarEvents, bots } from '@/data/mockData';

const botColors: Record<string, string> = {
  ronnie: 'bg-[hsl(var(--nexus-success))]', ana: 'bg-[hsl(var(--nexus-info))]', trading: 'bg-[hsl(var(--nexus-warning))]',
  rhianna: 'bg-[hsl(var(--nexus-purple))]', deondre: 'bg-primary', carter: 'bg-[hsl(var(--nexus-urgent))]',
};

export default function CalendarPage() {
  const [filters, setFilters] = useState<Record<string, boolean>>(Object.fromEntries(bots.map((b) => [b.id, true])));
  const filtered = calendarEvents.filter((e) => filters[e.botId]);
  const eventDates = filtered.map((e) => new Date(e.date));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const selectedEvents = selectedDate ? filtered.filter((e) => new Date(e.date).toDateString() === selectedDate.toDateString()) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Unified Calendar</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ event: eventDates }}
                modifiersClassNames={{ event: 'bg-primary/20 font-bold' }}
              />
            </CardContent>
          </Card>
          {selectedEvents.length > 0 && (
            <Card className="mt-4">
              <CardHeader><CardTitle className="text-base">Events on {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {selectedEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <div className={`h-3 w-3 rounded-full ${botColors[e.botId]}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{bots.find((b) => b.id === e.botId)?.name} · {e.type}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">Filter by Bot</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {bots.map((b) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={filters[b.id]} onCheckedChange={(v) => setFilters((f) => ({ ...f, [b.id]: !!v }))} />
                  <div className={`h-2.5 w-2.5 rounded-full ${botColors[b.id]}`} />
                  <span className="text-sm">{b.name}</span>
                </label>
              ))}
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle className="text-base">Upcoming</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {filtered.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full ${botColors[e.botId]}`} />
                  <span className="flex-1 truncate">{e.title}</span>
                  <Badge variant="outline" className="text-[10px]">{e.date}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
