import React, { Component, ErrorInfo, ReactNode } from "react";
import "./global.css";

// Suppress Recharts defaultProps warnings
const originalWarn = console.warn;
console.warn = (format: any, ...args: any[]) => {
  // Handle React's specific defaultProps warning format
  if (
    typeof format === "string" &&
    format.includes("Support for defaultProps will be removed")
  ) {
    // Check if any of the arguments are Recharts components
    const argsString = args.join(" ");
    if (argsString.includes("XAxis") || argsString.includes("YAxis")) {
      return; // Suppress Recharts defaultProps warnings
    }
  }

  // Pass through all other warnings
  originalWarn.call(console, format, ...args);
};

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

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
              <Route
                path="/candidates/:id/progress"
                element={<CandidateApplicationProgress />}
              />
              <Route path="/cv-evaluation" element={<CVEvaluation />} />
              <Route path="/follow-up" element={<FollowUpDashboard />} />
              <Route
                path="/follow-up-dashboard/applicant-progress/:candidateId/:jobId"
                element={<CandidateApplicationProgress />}
              />
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

// Initialize React root
const rootElement = document.getElementById("root")!;

// Check if root is already initialized (for HMR)
if (!rootElement.hasAttribute("data-root-initialized")) {
  const root = createRoot(rootElement);
  root.render(<App />);
  rootElement.setAttribute("data-root-initialized", "true");
}
