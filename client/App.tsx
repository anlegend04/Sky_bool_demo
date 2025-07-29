import "@/lib/suppress-warnings";
import "./global.css";

// Additional aggressive React warning suppression
(() => {
  const originalReactWarn = console.warn;
  console.warn = function (format: any, ...args: any[]) {
    // Specifically target React's warning format
    if (
      typeof format === "string" &&
      format.includes("%s") &&
      args.some(
        (arg: any) =>
          typeof arg === "string" &&
          (arg.includes("XAxis") || arg.includes("YAxis")) &&
          format.includes("defaultProps"),
      )
    ) {
      return; // Suppress Recharts defaultProps warnings
    }
    return originalReactWarn.apply(console, [format, ...args]);
  };
})();

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import JobCreate from "./pages/JobCreate";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import CVEvaluation from "./pages/CVEvaluation";
import FollowUpDashboard from "./pages/FollowUpDashboard";
import Calendar from "./pages/Calendar";
import EmailAutomation from "./pages/EmailAutomation";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "@/hooks/use-language";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/create" element={<JobCreate />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/:id" element={<CandidateDetail />} />
              <Route path="/cv-evaluation" element={<CVEvaluation />} />
              <Route path="/follow-up" element={<FollowUpDashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/email-automation" element={<EmailAutomation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

// Prevent multiple createRoot calls in development
const rootElement = document.getElementById("root")!;

// Check if we've already initialized the root
const isAlreadyRendered = rootElement.hasChildNodes();

if (!isAlreadyRendered) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
