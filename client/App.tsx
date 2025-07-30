import "@/lib/suppress-warnings";
import "./global.css";

// Enhanced React warning suppression
(() => {
  const originalReactWarn = console.warn;
  console.warn = function (format: any, ...args: any[]) {
    // Handle React's warning format with %s placeholders
    if (typeof format === "string") {
      // Check for defaultProps warning pattern
      if (format.includes("Support for defaultProps will be removed")) {
        // Check if any argument contains Recharts component names
        const hasRechartsComponent = args.some((arg: any) => {
          const argStr = String(arg);
          return (
            argStr.includes("XAxis") ||
            argStr.includes("YAxis") ||
            argStr.includes("XAxis2") ||
            argStr.includes("YAxis2") ||
            argStr.includes("CartesianGrid") ||
            argStr.includes("Tooltip") ||
            argStr.includes("Legend") ||
            argStr.includes("ResponsiveContainer") ||
            argStr.includes("BarChart") ||
            argStr.includes("LineChart") ||
            argStr.includes("PieChart")
          );
        });

        if (hasRechartsComponent) {
          return; // Suppress this warning
        }
      }

      // Also check the full formatted message
      const fullMessage = format.replace(/%s/g, () =>
        String(args.shift() || ""),
      );
      if (
        fullMessage.includes("Support for defaultProps will be removed") &&
        (fullMessage.includes("XAxis") ||
          fullMessage.includes("YAxis") ||
          fullMessage.includes("recharts"))
      ) {
        return; // Suppress this warning
      }
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
import CandidateDetailEnhanced from "./pages/CandidateDetailEnhanced";
import CandidateProfileEnhanced from "./pages/CandidateProfileEnhanced";
import CandidateApplicationProgress from "./pages/CandidateApplicationProgress";
import CVEvaluation from "./pages/CVEvaluation";
import FollowUpDashboard from "./pages/FollowUpDashboard";
import Calendar from "./pages/Calendar";
import Schedule from "./pages/Schedule";
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
              <Route
                path="/candidates-enhanced/:id"
                element={<CandidateDetailEnhanced />}
              />
              <Route path="/cv-evaluation" element={<CVEvaluation />} />
              <Route path="/follow-up" element={<FollowUpDashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/schedule" element={<Schedule />} />
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
