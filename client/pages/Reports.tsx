import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchableSelect,
  SelectOption,
} from "@/components/ui/searchable-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  Target,
  Clock,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Award,
  Zap,
  RefreshCw,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  HARDCODED_JOBS,
  HARDCODED_CANDIDATES,
  HARDCODED_INTERVIEWS,
} from "@/data/hardcoded-data";
import {
  ENHANCED_JOBS,
  ENHANCED_CANDIDATES,
  ENHANCED_INTERVIEWS,
} from "@/data/enhanced-mock-data";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { RechartsWarningSuppress } from "@/components/RechartsWarningSuppress";
import {
  suppressRechartsWarnings,
  restoreWarnings,
} from "@/lib/suppress-recharts-warnings";
import { formatCurrency, formatCurrencyForTooltip } from "@/lib/utils";

export default function Reports() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("last30");
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedRecruiter, setSelectedRecruiter] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [customSources, setCustomSources] = useState<string[]>([]);
  const [customStages, setCustomStages] = useState<string[]>([]);

  // Create dashboard stats data inline
  const dashboardStats = {
    activeJobs: ENHANCED_JOBS.filter((job) => job.status === "Open").length,
    totalCandidates: ENHANCED_CANDIDATES.length,
    interviewsThisWeek: ENHANCED_CANDIDATES.filter((c) =>
      c.jobApplications.some((app) =>
        ["Interview", "Technical"].includes(app.currentStage),
      ),
    ).length,
    avgTimeToHire: 25, // Mock average
  };

  // Calculate pipeline data from actual candidates
  const totalCandidates = ENHANCED_CANDIDATES.length;
  const appliedCount = ENHANCED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Applied"),
  ).length;
  const screeningCount = ENHANCED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Screening"),
  ).length;
  const interviewCount = ENHANCED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Interview"),
  ).length;
  const technicalCount = ENHANCED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Technical"),
  ).length;
  const offerCount = ENHANCED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Offer"),
  ).length;
  const hiredCount = ENHANCED_CANDIDATES.filter((c) =>
    c.jobApplications.some((app) => app.currentStage === "Hired"),
  ).length;

  const pipeline = [
    { stageKey: "dashboard.applied", count: totalCandidates, percentage: 100 },
    {
      stageKey: "dashboard.screening",
      count:
        screeningCount +
        interviewCount +
        technicalCount +
        offerCount +
        hiredCount,
      percentage: Math.round(
        ((screeningCount +
          interviewCount +
          technicalCount +
          offerCount +
          hiredCount) /
          totalCandidates) *
          100,
      ),
    },
    {
      stageKey: "dashboard.interview",
      count: interviewCount + technicalCount + offerCount + hiredCount,
      percentage: Math.round(
        ((interviewCount + technicalCount + offerCount + hiredCount) /
          totalCandidates) *
          100,
      ),
    },
    {
      stageKey: "dashboard.offer",
      count: offerCount + hiredCount,
      percentage: Math.round(
        ((offerCount + hiredCount) / totalCandidates) * 100,
      ),
    },
    {
      stageKey: "dashboard.hired",
      count: hiredCount,
      percentage: Math.round((hiredCount / totalCandidates) * 100),
    },
  ];

  // Get unique values for filters
  const recruiters = Array.from(
    new Set(
      ENHANCED_CANDIDATES.flatMap((c) =>
        c.jobApplications.map((app) => app.recruiter),
      ),
    ),
  );
  const sources = Array.from(
    new Set([...ENHANCED_CANDIDATES.map((c) => c.source), ...customSources]),
  );
  const stages = Array.from(
    new Set([
      ...ENHANCED_CANDIDATES.flatMap((c) =>
        c.jobApplications.map((app) => app.currentStage),
      ),
      ...customStages,
    ]),
  );

  // Prepare options for enhanced dropdowns
  const sourceOptions: SelectOption[] = [
    {
      value: "all",
      label: "All Sources",
      description: "Show data from all sources",
    },
    ...sources.map((source) => ({
      value: source,
      label: source,
      badge: customSources.includes(source) ? "Custom" : undefined,
      custom: customSources.includes(source),
      description: `Candidates from ${source}`,
    })),
  ];

  const stageOptions: SelectOption[] = [
    {
      value: "all",
      label: "All Stages",
      description: "Show candidates in all stages",
    },
    ...stages.map((stage) => ({
      value: stage,
      label: stage,
      badge: customStages.includes(stage) ? "Custom" : undefined,
      custom: customStages.includes(stage),
      description: `Candidates in ${stage} stage`,
    })),
  ];

  const handleAddCustomSource = (newSource: string) => {
    setCustomSources((prev) => [...prev, newSource]);
    toast({
      title: "Custom Source Added",
      description: `Added "${newSource}" as a custom source option.`,
    });
  };

  const handleAddCustomStage = (newStage: string) => {
    setCustomStages((prev) => [...prev, newStage]);
    toast({
      title: "Custom Stage Added",
      description: `Added "${newStage}" as a custom stage option.`,
    });
  };

  // Enhanced filtering function with loading simulation
  const applyFilters = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLastUpdated(new Date());
    setIsLoading(false);
    toast({
      title: "Filters Applied",
      description:
        "Charts and data have been updated with your selected filters.",
    });
  };

  // Suppress Recharts warnings on mount
  useEffect(() => {
    suppressRechartsWarnings();
    return () => {
      restoreWarnings();
    };
  }, []);

  // Auto-apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [
    selectedJob,
    selectedRecruiter,
    selectedSource,
    selectedStage,
    dateRange,
  ]);

  // Filtered data based on current filters
  const filteredData = useMemo(() => {
    let filtered = ENHANCED_CANDIDATES;

    if (selectedJob !== "all") {
      const job = ENHANCED_JOBS.find((j) => j.id === selectedJob);
      if (job) {
        filtered = filtered.filter((c) =>
          c.jobApplications.some((app) => app.jobTitle === job.position),
        );
      }
    }

    if (selectedRecruiter !== "all") {
      filtered = filtered.filter((c) =>
        c.jobApplications.some((app) => app.recruiter === selectedRecruiter),
      );
    }

    if (selectedSource !== "all") {
      filtered = filtered.filter((c) => c.source === selectedSource);
    }

    if (selectedStage !== "all") {
      filtered = filtered.filter((c) =>
        c.jobApplications.some((app) => app.currentStage === selectedStage),
      );
    }

    // Date filtering
    const now = new Date();
    let startDate = new Date();
    switch (dateRange) {
      case "last7":
        startDate.setDate(now.getDate() - 7);
        break;
      case "last30":
        startDate.setDate(now.getDate() - 30);
        break;
      case "last90":
        startDate.setDate(now.getDate() - 90);
        break;
      case "last365":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    filtered = filtered.filter((c) =>
      c.jobApplications.some((app) => new Date(app.appliedDate) >= startDate),
    );

    return filtered;
  }, [
    selectedJob,
    selectedRecruiter,
    selectedSource,
    selectedStage,
    dateRange,
  ]);

  // Dynamic chart data based on filtered results
  const chartData = useMemo(() => {
    const stageDistribution = stages.map((stage) => ({
      name: stage,
      value: filteredData.filter((c) =>
        c.jobApplications.some((app) => app.currentStage === stage),
      ).length,
      fill: getStageColor(stage),
    }));

    const sourceDistribution = sources.map((source) => {
      const sourceCandidates = filteredData.filter((c) => c.source === source);
      const sourceHired = sourceCandidates.filter((c) =>
        c.jobApplications.some((app) => app.currentStage === "Hired"),
      ).length;
      const effectiveness =
        sourceCandidates.length > 0
          ? Math.round((sourceHired / sourceCandidates.length) * 100)
          : 0;

      return {
        name: source,
        value: sourceCandidates.length,
        effectiveness,
        color: getSourceColor(source),
      };
    });

    const recruiterPerformance = recruiters.map((recruiter) => {
      const recruiterCandidates = filteredData.filter((c) =>
        c.jobApplications.some((app) => app.recruiter === recruiter),
      );
      const interviews = recruiterCandidates.filter((c) =>
        c.jobApplications.some((app) =>
          ["Interview", "Technical", "Offer", "Hired"].includes(
            app.currentStage,
          ),
        ),
      ).length;
      const hires = recruiterCandidates.filter((c) =>
        c.jobApplications.some((app) => app.currentStage === "Hired"),
      ).length;
      const effectiveness =
        recruiterCandidates.length > 0
          ? Math.round((hires / recruiterCandidates.length) * 100)
          : 0;

      return {
        name: recruiter,
        applications: recruiterCandidates.length,
        interviews,
        hires,
        effectiveness,
      };
    });

    return {
      stageDistribution,
      sourceDistribution,
      recruiterPerformance,
    };
  }, [filteredData, stages, sources, recruiters]);

  function getStageColor(stage: string) {
    const colors = {
      Applied: "#3b82f6",
      Screening: "#f59e0b",
      Interview: "#8b5cf6",
      Technical: "#f97316",
      Offer: "#10b981",
      Hired: "#059669",
      Rejected: "#ef4444",
    };
    return colors[stage] || "#6b7280";
  }

  function getSourceColor(source: string) {
    const colors = {
      LinkedIn: "#0077B5",
      Indeed: "#2557a7",
      "Company Website": "#00a652",
      Referral: "#ff6b35",
      Glassdoor: "#0caa41",
      AngelList: "#000000",
    };
    return colors[source] || "#8884d8";
  }

  // Custom CSV download function with filtered data
  const downloadCSV = () => {
    setIsLoading(true);
    setTimeout(() => {
      const headers = [
        "Name",
        "Position",
        "Stage",
        "Recruiter",
        "Source",
        "Applied Date",
      ];
      const csvData = filteredData.flatMap((candidate) =>
        candidate.jobApplications.map((app) => [
          candidate.name,
          app.jobTitle,
          app.currentStage,
          app.recruiter,
          candidate.source,
          app.appliedDate,
        ]),
      );

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `recruitment-report-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsLoading(false);
      toast({
        title: "Export Complete",
        description: `Downloaded report with ${csvData.length} applications.`,
      });
    }, 1000);
  };

  // Cost data - Mock data for cost per hire analysis
  const costData = useMemo(() => {
    const baseCostPerHire = 24000000; // Base cost in VND (24M VND = ~$1000 USD)
    const totalHires =
      filteredData.filter((c) =>
        c.jobApplications.some((app) => app.currentStage === "Hired"),
      ).length || 1;

    // Cost breakdown by category
    const costBreakdown = [
      {
        category: "Advertising & Marketing",
        amount: baseCostPerHire * totalHires * 0.25,
        percentage: 25,
        color: "#3b82f6",
      },
      {
        category: "Recruiter Time",
        amount: baseCostPerHire * totalHires * 0.35,
        percentage: 35,
        color: "#10b981",
      },
      {
        category: "Tools & Software",
        amount: baseCostPerHire * totalHires * 0.15,
        percentage: 15,
        color: "#f59e0b",
      },
      {
        category: "Interview & Assessment",
        amount: baseCostPerHire * totalHires * 0.15,
        percentage: 15,
        color: "#8b5cf6",
      },
      {
        category: "Onboarding",
        amount: baseCostPerHire * totalHires * 0.1,
        percentage: 10,
        color: "#ef4444",
      },
    ];

    // Cost by position
    const costByPosition = ENHANCED_JOBS.map((job) => {
      const positionHires = filteredData.filter((c) =>
        c.jobApplications.some(
          (app) =>
            app.jobTitle === job.position && app.currentStage === "Hired",
        ),
      ).length;
      const avgCost = baseCostPerHire + (Math.random() * 120000000 - 60000000); // Add variation (±60M VND = ±$2500 USD)
      return {
        position: job.position,
        hires: positionHires,
        totalCost: avgCost * positionHires,
        avgCostPerHire: avgCost,
      };
    }).filter((item) => item.hires > 0);

    // Monthly cost trend
    const monthlyCostTrend = [
      {
        month: "January",
        totalCost: baseCostPerHire * totalHires * 0.2,
        hires: Math.max(1, Math.round(totalHires * 0.2)),
        costPerHire: baseCostPerHire * 0.9,
      },
      {
        month: "February",
        totalCost: baseCostPerHire * totalHires * 0.3,
        hires: Math.max(1, Math.round(totalHires * 0.3)),
        costPerHire: baseCostPerHire * 1.1,
      },
      {
        month: "March",
        totalCost: baseCostPerHire * totalHires * 0.5,
        hires: Math.max(1, Math.round(totalHires * 0.5)),
        costPerHire: baseCostPerHire,
      },
      {
        month: "April",
        totalCost: baseCostPerHire * totalHires,
        hires: totalHires,
        costPerHire: baseCostPerHire * 0.95,
      },
    ];

    const totalCost = costBreakdown.reduce((sum, item) => sum + item.amount, 0);
    const avgCostPerHire = totalHires > 0 ? totalCost / totalHires : 0;

    return {
      costBreakdown,
      costByPosition,
      monthlyCostTrend,
      totalCost,
      avgCostPerHire,
      totalHires,
    };
  }, [filteredData]);

  // Dynamic stats based on filtered data
  const dynamicStats = [
    {
      title: "Total Candidates",
      value: filteredData.length.toString(),
      change: `${filteredData.length > 50 ? "+" : ""}${Math.round((filteredData.length / ENHANCED_CANDIDATES.length - 1) * 100)}%`,
      trend: filteredData.length > 50 ? "up" : "down",
      icon: Users,
      color: "blue",
    },
    {
      title: "Conversion Rate",
      value: `${Math.round((filteredData.filter((c) => c.jobApplications.some((app) => app.currentStage === "Hired")).length / filteredData.length) * 100) || 0}%`,
      change: "+0.8%",
      trend: "up",
      icon: Target,
      color: "green",
    },
    {
      title: "Avg Time to Hire",
      value: `${
        Math.round(
          filteredData.reduce(
            (acc, c) =>
              acc +
              c.jobApplications.reduce(
                (appAcc, app) =>
                  appAcc +
                  app.stageHistory.reduce(
                    (stageAcc, stage) => stageAcc + stage.duration,
                    0,
                  ),
                0,
              ),
            0,
          ) / Math.max(filteredData.length, 1),
        ) || 0
      } days`,
      change: "-3 days",
      trend: "up",
      icon: Clock,
      color: "purple",
    },
    {
      title: "Avg Cost per Hire",
      value: formatCurrency(costData.avgCostPerHire, 'USD'),
      change: "-5%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Total cost",
      value: formatCurrency(costData.totalCost, 'USD'),
      change: "+12%",
      trend: "up",
      icon: Briefcase,
      color: "blue",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <RechartsWarningSuppress>{null}</RechartsWarningSuppress>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Analytics & Reports
          </h1>
          <p className="text-slate-600 mt-1">
            Comprehensive insights into your recruitment performance
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" onClick={applyFilters} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Data
          </Button>
          <Button onClick={downloadCSV} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <Label>Date Range</Label>
              <Select
                value={dateRange}
                onValueChange={(value) => {
                  setDateRange(value);
                  // Auto-apply filters will be triggered by useEffect
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7">Last 7 days</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="last365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Job Position</Label>
              <Select
                value={selectedJob}
                onValueChange={(value) => {
                  setSelectedJob(value);
                  // Auto-apply filters will be triggered by useEffect
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {ENHANCED_JOBS.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Recruiter</Label>
              <Select
                value={selectedRecruiter}
                onValueChange={(value) => {
                  setSelectedRecruiter(value);
                  // Auto-apply filters will be triggered by useEffect
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recruiters</SelectItem>
                  {recruiters.map((recruiter) => (
                    <SelectItem key={recruiter} value={recruiter}>
                      {recruiter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Source</Label>
              <SearchableSelect
                value={selectedSource}
                onValueChange={(value) => {
                  setSelectedSource(value as string);
                  // Auto-apply filters will be triggered by useEffect
                }}
                options={sourceOptions}
                placeholder="Select source..."
                searchPlaceholder="Search sources..."
                emptyMessage="No sources found."
                allowCustom={true}
                onAddCustom={handleAddCustomSource}
                clearable={true}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Stage</Label>
              <SearchableSelect
                value={selectedStage}
                onValueChange={(value) => {
                  setSelectedStage(value as string);
                  // Auto-apply filters will be triggered by useEffect
                }}
                options={stageOptions}
                placeholder="Select stage..."
                searchPlaceholder="Search stages..."
                emptyMessage="No stages found."
                allowCustom={true}
                onAddCustom={handleAddCustomStage}
                clearable={true}
                className="mt-1"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  // Reset all filters
                  setDateRange("last30");
                  setSelectedJob("all");
                  setSelectedRecruiter("all");
                  setSelectedSource("all");
                  setSelectedStage("all");
                  toast({
                    title: "Filters Reset",
                    description:
                      "All filters have been reset to default values.",
                  });
                }}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedJob !== "all" && (
              <Badge variant="secondary">
                Job:{" "}
                {HARDCODED_JOBS.find((j) => j.id === selectedJob)?.position}
              </Badge>
            )}
            {selectedRecruiter !== "all" && (
              <Badge variant="secondary">Recruiter: {selectedRecruiter}</Badge>
            )}
            {selectedSource !== "all" && (
              <Badge variant="secondary">Source: {selectedSource}</Badge>
            )}
            {selectedStage !== "all" && (
              <Badge variant="secondary">Stage: {selectedStage}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {dynamicStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm flex items-center space-x-1 ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{stat.change}</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="pipeline">Pipeline</TabsTrigger> */}
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Stage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : filteredData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                      <p>No data available for selected filters</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.stageDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value, percent }) =>
                          value > 0
                            ? `${name}\n${value} (${(percent * 100).toFixed(0)}%)`
                            : ""
                        }
                        labelLine={false}
                        fontSize={12}
                      >
                        {chartData.stageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} candidates`,
                          "Count",
                        ]}
                        labelFormatter={(label) => `Stage: ${label}`}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend
                        formatter={(value, entry) =>
                          `${value} (${entry.payload.value})`
                        }
                        wrapperStyle={{ paddingTop: "20px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Recruiter Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recruiter Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : filteredData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                      <p>No data available for selected filters</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.recruiterPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip
                        formatter={(value, name) => {
                          const labels = {
                            applications: "Total Applications",
                            interviews: "Reached Interview",
                            hires: "Successfully Hired",
                          };
                          return [value, labels[name] || name];
                        }}
                        labelFormatter={(label) => `Recruiter: ${label}`}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          const labels = {
                            applications: "Total Applications",
                            interviews: "Reached Interview",
                            hires: "Successfully Hired",
                          };
                          return labels[value] || value;
                        }}
                      />
                      <Bar
                        dataKey="applications"
                        fill="#3b82f6"
                        name="applications"
                      />
                      <Bar
                        dataKey="interviews"
                        fill="#10b981"
                        name="interviews"
                      />
                      <Bar dataKey="hires" fill="#f59e0b" name="hires" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-responsive-lg text-wrap-safe">
                  {t("dashboard.quickStats")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-mobile">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-responsive-base text-wrap-safe">
                    {t("dashboard.costPerHire")}
                  </span>
                  <span className="font-semibold text-responsive-base text-wrap-safe">
                    $
                    {Math.round(
                      ENHANCED_JOBS.reduce(
                        (sum, job) => sum + (job.budget?.actual || 0),
                        0,
                      ) /
                        Math.max(
                          ENHANCED_JOBS.reduce(
                            (count, job) => count + job.hired,
                            0,
                          ),
                          1,
                        ),
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-responsive-base text-wrap-safe">
                    {t("dashboard.hiringSuccessRate")}
                  </span>
                  <span className="font-semibold text-green-600 text-responsive-base text-wrap-safe">
                    {Math.round(
                      (ENHANCED_CANDIDATES.filter((c) =>
                        c.jobApplications.some(
                          (app) => app.currentStage === "Hired",
                        ),
                      ).length /
                        Math.max(ENHANCED_CANDIDATES.length, 1)) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-responsive-base text-wrap-safe">
                    {t("dashboard.sourceEffectiveness")}
                  </span>
                  <span className="text-semibold text-responsive-base text-wrap-safe">
                    LinkedIn:{" "}
                    {Math.round(
                      (HARDCODED_CANDIDATES.filter(
                        (c) =>
                          c.source === "LinkedIn" &&
                          c.jobApplications.some(
                            (app) => app.currentStage === "Hired",
                          ),
                      ).length /
                        Math.max(
                          HARDCODED_CANDIDATES.filter(
                            (c) => c.source === "LinkedIn",
                          ).length,
                          1,
                        )) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-responsive-base text-wrap-safe">
                    {t("dashboard.pendingInterviews")}
                  </span>
                  <span className="font-semibold text-orange-600 text-responsive-base text-wrap-safe">
                    {
                      HARDCODED_INTERVIEWS.filter(
                        (i) => i.status === "Scheduled",
                      ).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recruitment Pipeline */}
            {/* <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-responsive-lg text-wrap-safe">
                    {t("dashboard.recruitmentPipeline")}
                  </span>
                  <Button variant="ghost" size="sm" className="icon-mobile">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-mobile">
                <div className="space-mobile">
                  {pipeline.map((stage) => (
                    <div
                      key={stage.stageKey}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="font-medium text-slate-700 text-responsive-base break-words text-wrap-safe">
                          {t(stage.stageKey)}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs flex-shrink-0 badge-mobile"
                        >
                          {stage.count}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 w-24 sm:w-32 flex-shrink-0">
                        <Progress
                          value={stage.percentage}
                          className="progress-mobile flex-1"
                        />
                        <span className="text-responsive-sm text-slate-500 w-8 sm:w-10 text-right text-wrap-safe">
                          {stage.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Pipeline Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Funnel
                      dataKey="value"
                      data={chartData.stageDistribution.filter(
                        (d) => d.value > 0,
                      )}
                      isAnimationActive
                    >
                      <LabelList
                        position="center"
                        fill="#fff"
                        stroke="none"
                        formatter={(value, entry) => {
                          if (!entry || !entry.name) return `${value || 0}`;
                          return `${entry.name}\n${value} candidates`;
                        }}
                      />
                    </Funnel>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} candidates`,
                        "Stage",
                      ]}
                      labelFormatter={(label, payload) =>
                        payload?.[0]?.payload?.name || label
                      }
                    />
                  </FunnelChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Time Series Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      {
                        month: "Jan",
                        applications: Math.max(
                          1,
                          Math.round(filteredData.length * 0.3),
                        ),
                        hires: Math.max(
                          0,
                          Math.round(
                            filteredData.filter((c) =>
                              c.jobApplications.some(
                                (app) => app.currentStage === "Hired",
                              ),
                            ).length * 0.2,
                          ),
                        ),
                        interviews: Math.max(
                          0,
                          Math.round(filteredData.length * 0.15),
                        ),
                      },
                      {
                        month: "Feb",
                        applications: Math.max(
                          1,
                          Math.round(filteredData.length * 0.5),
                        ),
                        hires: Math.max(
                          0,
                          Math.round(
                            filteredData.filter((c) =>
                              c.jobApplications.some(
                                (app) => app.currentStage === "Hired",
                              ),
                            ).length * 0.4,
                          ),
                        ),
                        interviews: Math.max(
                          0,
                          Math.round(filteredData.length * 0.25),
                        ),
                      },
                      {
                        month: "Mar",
                        applications: Math.max(
                          1,
                          Math.round(filteredData.length * 0.8),
                        ),
                        hires: Math.max(
                          0,
                          Math.round(
                            filteredData.filter((c) =>
                              c.jobApplications.some(
                                (app) => app.currentStage === "Hired",
                              ),
                            ).length * 0.7,
                          ),
                        ),
                        interviews: Math.max(
                          0,
                          Math.round(filteredData.length * 0.4),
                        ),
                      },
                      {
                        month: "Apr",
                        applications: Math.max(1, filteredData.length),
                        hires: filteredData.filter((c) =>
                          c.jobApplications.some(
                            (app) => app.currentStage === "Hired",
                          ),
                        ).length,
                        interviews: Math.max(
                          0,
                          Math.round(filteredData.length * 0.5),
                        ),
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip
                      formatter={(value, name) => {
                        const labels = {
                          applications: "Applications Received",
                          hires: "Candidates Hired",
                          interviews: "Candidates Interviewed",
                        };
                        return [value, labels[name] || name];
                      }}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend
                      formatter={(value) => {
                        const labels = {
                          applications: "Total Applications",
                          hires: "Successful Hires",
                          interviews: "Candidates Interviewed",
                        };
                        return labels[value] || value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="interviews"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="hires"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          {/* Source Effectiveness */}
          <Card>
            <CardHeader>
              <CardTitle>Source Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : filteredData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>No data available for selected filters</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData.sourceDistribution.filter(
                      (d) => d.value > 0,
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900 mb-2">{`Source: ${label}`}</p>
                              <div className="space-y-1">
                                <p className="text-blue-600 flex justify-between">
                                  <span>Applications:</span>
                                  <span className="font-medium">
                                    {data.value}
                                  </span>
                                </p>
                                <p className="text-green-600 flex justify-between">
                                  <span>Success Rate:</span>
                                  <span className="font-medium">
                                    {data.effectiveness}%
                                  </span>
                                </p>
                                <p className="text-purple-600 flex justify-between">
                                  <span>Hired:</span>
                                  <span className="font-medium">
                                    {
                                      filteredData.filter(
                                        (c) =>
                                          c.source === label &&
                                          c.jobApplications.some(
                                            (app) =>
                                              app.currentStage === "Hired",
                                          ),
                                      ).length
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Add Source Effectiveness Details */}
          {!isLoading && filteredData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Source Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chartData.sourceDistribution
                    .filter((source) => source.value > 0)
                    .map((source) => (
                      <div
                        key={source.name}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {source.name}
                          </h4>
                          <div
                            className="text-2xl font-bold"
                            style={{ color: source.color }}
                          >
                            {source.effectiveness}%
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Applications: {source.value}</div>
                          <div>
                            Hired:{" "}
                            {
                              filteredData.filter(
                                (c) =>
                                  c.source === source.name &&
                                  c.jobApplications.some(
                                    (app) => app.currentStage === "Hired",
                                  ),
                              ).length
                            }
                          </div>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${source.effectiveness}%`,
                              backgroundColor: source.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          {/* Cost Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avg Cost per Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(costData.avgCostPerHire, 'USD')}
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Decrease of 5% compared to last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Total cost of Recruitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(costData.totalCost, 'USD')}
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Cho {costData.totalHires} successful hires
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ROI Recruitment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">275%</div>
                <p className="text-sm text-slate-600 mt-2">
                  Effective cost management and hiring strategy
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution of Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costData.costBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="amount"
                        label={({ category, percentage }) =>
                          `${category}\n${percentage}%`
                        }
                        labelLine={false}
                        fontSize={11}
                      >
                        {costData.costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          formatCurrencyForTooltip(Number(value), 'USD'),
                          "Cost",
                        ]}
                        labelFormatter={(label) => `Loại: ${label}`}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend
                        formatter={(value, entry) => {
                          if (
                            entry &&
                            entry.payload &&
                            typeof (entry.payload as { amount?: number })
                              .amount === "number"
                          ) {
                            return `${value} (${formatCurrencyForTooltip((entry.payload as unknown as { amount: number }).amount, 'USD')})`;
                          }
                          return value;
                        }}
                        wrapperStyle={{ paddingTop: "20px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Cost by Position */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Position</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : costData.costByPosition.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                      <p>No data available</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={costData.costByPosition}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="position"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis
                        fontSize={12}
                        tickFormatter={(value) => formatCurrencyForTooltip(value, 'USD')}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "avgCostPerHire") {
                            return [
                              formatCurrencyForTooltip(Number(value), 'USD'),
                              "avgCostPerHire",
                            ];
                          }
                          return [
                            formatCurrencyForTooltip(Number(value), 'USD'),
                            "Total Cost",
                          ];
                        }}
                        labelFormatter={(label) => `Vị trí: ${label}`}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          return value === "avgCostPerHire"
                            ? "avgCostPerHire"
                            : "Total Cost";
                        }}
                      />
                      <Bar
                        dataKey="totalCost"
                        fill="#3b82f6"
                        name="totalCost"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="avgCostPerHire"
                        fill="#10b981"
                        name="avgCostPerHire"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monthly Cost Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Trend cost months</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={costData.monthlyCostTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis
                      fontSize={12}
                      tickFormatter={(value) => formatCurrencyForTooltip(value, 'USD')}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        const labels = {
                          totalCost: "Total cost",
                          costPerHire: "Cost per hire",
                          hires: "Hires",
                        };
                        if (name === "hires") {
                          return [value, labels[name]];
                        }
                        return [
                          formatCurrencyForTooltip(Number(value), 'USD'),
                          labels[name],
                        ];
                      }}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend
                      formatter={(value) => {
                        const labels = {
                          totalCost: "Total cost",
                          costPerHire: "Cost per hire",
                        };
                        return labels[value] || value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalCost"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="costPerHire"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Cost Breakdown Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costData.costBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {item.category}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.percentage}% total cost
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(item.amount, 'USD')}
                      </div>
                      <div className="text-sm text-gray-600">
                        ~{formatCurrency(item.amount / costData.totalHires, 'USD')}/hire
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
