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
import AvaChiefOfStaff from "./pages/bots/AvaChiefOfStaff";
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
                      <Route path="/bots/ava" element={<AvaChiefOfStaff />} />
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
