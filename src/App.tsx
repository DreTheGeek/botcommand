import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RonnieRealty from "./pages/bots/RonnieRealty";
import AnaSales from "./pages/bots/AnaSales";
import TradingBot from "./pages/bots/TradingBot";
import RhiannaResearch from "./pages/bots/RhiannaResearch";
import DeondreDropshipping from "./pages/bots/DeondreDropshipping";
import CarterContent from "./pages/bots/CarterContent";
import RevenueHub from "./pages/RevenueHub";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsHub from "./pages/AnalyticsHub";
import SearchPage from "./pages/SearchPage";
import RawData from "./pages/RawData";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/revenue" element={<RevenueHub />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/analytics" element={<AnalyticsHub />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/data" element={<RawData />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/bots/ronnie" element={<RonnieRealty />} />
              <Route path="/bots/ana" element={<AnaSales />} />
              <Route path="/bots/trading" element={<TradingBot />} />
              <Route path="/bots/rhianna" element={<RhiannaResearch />} />
              <Route path="/bots/deondre" element={<DeondreDropshipping />} />
              <Route path="/bots/carter" element={<CarterContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
