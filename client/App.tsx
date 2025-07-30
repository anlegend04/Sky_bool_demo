// MUST BE FIRST - Suppress Recharts warnings before any imports
(function () {
  const originalWarn = console.warn;
  const originalError = console.error;

  // Aggressive suppression of defaultProps warnings
  console.warn = function (...args) {
    const message = args.join(" ");

    // Multiple detection patterns for different warning formats
    const isRechartsWarning =
      // Pattern 1: Direct message check
      (message.includes("Support for defaultProps will be removed") &&
        (message.includes("XAxis") || message.includes("YAxis"))) ||
      // Pattern 2: Check individual arguments
      (args.some((arg) =>
        String(arg).includes("Support for defaultProps will be removed"),
      ) &&
        args.some((arg) =>
          String(arg).match(/\b(XAxis|YAxis|XAxis2|YAxis2)\b/),
        )) ||
      // Pattern 3: Template string format
      (args[0] &&
        typeof args[0] === "string" &&
        args[0].includes("Support for defaultProps will be removed") &&
        args.slice(1).some((arg) => String(arg).match(/\b(XAxis|YAxis)\b/)));

    if (!isRechartsWarning) {
      originalWarn.apply(console, args);
    }
  };

  console.error = function (...args) {
    const message = args.join(" ");
    const isRechartsWarning =
      message.includes("Support for defaultProps will be removed") &&
      (message.includes("XAxis") || message.includes("YAxis"));

    if (!isRechartsWarning) {
      originalError.apply(console, args);
    }
  };
})();

import "@/lib/suppress-warnings";
import "./global.css";

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
              <Route
                path="/candidates-profile/:id"
                element={<CandidateProfileEnhanced />}
              />
              <Route
                path="/candidates/:candidateId/jobs/:jobId/progress"
                element={<CandidateApplicationProgress />}
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
