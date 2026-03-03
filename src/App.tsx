import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import OptimusPrime from "./pages/bots/OptimusPrime";
import AvaAnalyst from "./pages/bots/AvaAnalyst";
import SarahSales from "./pages/bots/SarahSales";
import RhiannaResearch from "./pages/bots/RhiannaResearch";
import BennyBuilder from "./pages/bots/BennyBuilder";
import RandyRealty from "./pages/bots/RandyRealty";
import CarterContent from "./pages/bots/CarterContent";
import CleahCoding from "./pages/bots/CleahCoding";
import TammyTrader from "./pages/bots/TammyTrader";
import DeondreDropshipping from "./pages/bots/DeondreDropshipping";
import RevenueHub from "./pages/RevenueHub";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsHub from "./pages/AnalyticsHub";
import SearchPage from "./pages/SearchPage";
import RawData from "./pages/RawData";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/revenue" element={<RevenueHub />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/analytics" element={<AnalyticsHub />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/data" element={<RawData />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/bots/optimus" element={<OptimusPrime />} />
                      <Route path="/bots/ava" element={<AvaAnalyst />} />
                      <Route path="/bots/sarah" element={<SarahSales />} />
                      <Route path="/bots/rhianna" element={<RhiannaResearch />} />
                      <Route path="/bots/benny" element={<BennyBuilder />} />
                      <Route path="/bots/randy" element={<RandyRealty />} />
                      <Route path="/bots/carter" element={<CarterContent />} />
                      <Route path="/bots/cleah" element={<CleahCoding />} />
                      <Route path="/bots/tammy" element={<TammyTrader />} />
                      <Route path="/bots/deondre" element={<DeondreDropshipping />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
