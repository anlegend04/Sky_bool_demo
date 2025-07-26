import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30");
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedRecruiter, setSelectedRecruiter] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Load data and add demo data if needed
    let jobsData = storage.getJobs();
    let candidatesData = storage.getCandidates();
    
    if (jobsData.length < 3) {
      storage.addDemoData();
      jobsData = storage.getJobs();
      candidatesData = storage.getCandidates();
    }
    
    setJobs(jobsData);
    setCandidates(candidatesData);
  }, []);

  // Conversion Funnel Data
  const funnelData = [
    { name: 'Applications', value: 250, fill: '#8884d8' },
    { name: 'Screening', value: 120, fill: '#83a6ed' },
    { name: 'Interview', value: 65, fill: '#8dd1e1' },
    { name: 'Technical', value: 35, fill: '#82ca9d' },
    { name: 'Offer', value: 18, fill: '#a4de6c' },
    { name: 'Hired', value: 12, fill: '#ffc658' },
  ];

  // Recruiter Performance Data
  const recruiterData = [
    { name: 'Alex Chen', applications: 85, interviews: 45, hires: 8, effectiveness: 9.4 },
    { name: 'Sarah Kim', applications: 72, interviews: 38, hires: 6, effectiveness: 8.3 },
    { name: 'Mike Wilson', applications: 93, interviews: 42, hires: 4, effectiveness: 4.3 },
  ];

  // Monthly Trends Data
  const monthlyData = [
    { month: 'Jan', applications: 45, interviews: 23, hires: 5, budget: 15000 },
    { month: 'Feb', applications: 67, interviews: 35, hires: 8, budget: 18000 },
    { month: 'Mar', applications: 89, interviews: 48, hires: 12, budget: 22000 },
    { month: 'Apr', applications: 112, interviews: 62, hires: 15, budget: 25000 },
  ];

  // Source Effectiveness Data
  const sourceData = [
    { name: 'LinkedIn', value: 45, effectiveness: 85, color: '#0077B5' },
    { name: 'Indeed', value: 32, effectiveness: 72, color: '#2557a7' },
    { name: 'Website', value: 28, effectiveness: 68, color: '#00a652' },
    { name: 'Referral', value: 18, effectiveness: 95, color: '#ff6b35' },
    { name: 'Other', value: 12, effectiveness: 45, color: '#8884d8' },
  ];

  // Job Performance Radar Data
  const jobPerformanceData = [
    { subject: 'Application Volume', A: 120, B: 110, fullMark: 150 },
    { subject: 'Quality Score', A: 98, B: 130, fullMark: 150 },
    { subject: 'Time to Fill', A: 86, B: 100, fullMark: 150 },
    { subject: 'Cost Efficiency', A: 99, B: 85, fullMark: 150 },
    { subject: 'Candidate Satisfaction', A: 85, B: 90, fullMark: 150 },
  ];

  // Heatmap Data (simplified as colored grid)
  const heatmapData = [
    { day: 'Monday', hour: '9 AM', applications: 12 },
    { day: 'Monday', hour: '2 PM', applications: 18 },
    { day: 'Tuesday', hour: '9 AM', applications: 15 },
    { day: 'Tuesday', hour: '2 PM', applications: 22 },
    { day: 'Wednesday', hour: '9 AM', applications: 8 },
    { day: 'Wednesday', hour: '2 PM', applications: 14 },
    { day: 'Thursday', hour: '9 AM', applications: 19 },
    { day: 'Thursday', hour: '2 PM', applications: 25 },
    { day: 'Friday', hour: '9 AM', applications: 16 },
    { day: 'Friday', hour: '2 PM', applications: 11 },
  ];

  const stats = [
    {
      title: "Total Applications",
      value: "324",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Conversion Rate",
      value: "4.8%",
      change: "+0.8%",
      trend: "up",
      icon: Target,
      color: "green"
    },
    {
      title: "Avg. Time to Hire",
      value: "28 days",
      change: "-3 days",
      trend: "up",
      icon: Clock,
      color: "purple"
    },
    {
      title: "Cost per Hire",
      value: "$2,450",
      change: "-$150",
      trend: "up",
      icon: DollarSign,
      color: "orange"
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">
            Track recruitment performance and gain insights into your hiring process.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7">Last 7 days</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="last365">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job: any) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRecruiter} onValueChange={setSelectedRecruiter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Recruiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recruiters</SelectItem>
                  <SelectItem value="alex-chen">Alex Chen</SelectItem>
                  <SelectItem value="sarah-kim">Sarah Kim</SelectItem>
                  <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" allowDecimals={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={80} allowDuplicatedCategory={false} tickLine={false} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" allowDuplicatedCategory={false} tickLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} />
                    <Tooltip cursor={false} />
                    <Legend iconType="line" />
                    <Line type="monotone" dataKey="applications" stroke="#8884d8" name="Applications" />
                    <Line type="monotone" dataKey="interviews" stroke="#82ca9d" name="Interviews" />
                    <Line type="monotone" dataKey="hires" stroke="#ffc658" name="Hires" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recruiter Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recruiter Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recruiterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" allowDuplicatedCategory={false} tickLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} />
                    <Tooltip cursor={false} />
                    <Legend iconType="rect" />
                    <Bar dataKey="applications" fill="#8884d8" name="Applications" />
                    <Bar dataKey="interviews" fill="#82ca9d" name="Interviews" />
                    <Bar dataKey="hires" fill="#ffc658" name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Job Performance Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Job Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={jobPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Job A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Job B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recruiter Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Recruiter Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recruiterData.map((recruiter) => (
                  <div key={recruiter.name} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{recruiter.name}</h3>
                        <p className="text-sm text-slate-600">
                          {recruiter.applications} applications • {recruiter.interviews} interviews • {recruiter.hires} hires
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{recruiter.effectiveness}</div>
                      <div className="text-sm text-slate-600">Effectiveness Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Effectiveness Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Application Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Source Effectiveness Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Source Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" allowDuplicatedCategory={false} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="effectiveness" fill="#82ca9d" name="Effectiveness %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Source Details */}
          <Card>
            <CardHeader>
              <CardTitle>Source Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sourceData.map((source) => (
                  <div key={source.name} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <div>
                        <h3 className="font-medium">{source.name}</h3>
                        <p className="text-sm text-slate-600">{source.value} applications</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={source.effectiveness >= 80 ? "default" : "secondary"}>
                        {source.effectiveness}% Effective
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          {/* Application Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Application Frequency Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium mb-2">{day}</div>
                    <div className="space-y-2">
                      {['9 AM', '2 PM'].map((hour) => {
                        const data = heatmapData.find(d => d.day === day && d.hour === hour);
                        const intensity = data ? Math.min(data.applications / 25, 1) : 0;
                        return (
                          <div
                            key={hour}
                            className="h-12 w-full rounded border border-slate-200 flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: `rgba(34, 197, 94, ${intensity})`,
                              color: intensity > 0.5 ? 'white' : 'black'
                            }}
                          >
                            <div>
                              <div>{hour}</div>
                              <div>{data?.applications || 0}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Pipeline Velocity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">6.2 days</div>
                <p className="text-sm text-slate-600">Average stage duration</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Screening → Interview</span>
                    <span>2.1 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interview → Offer</span>
                    <span>4.3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">8.7/10</div>
                <p className="text-sm text-slate-600">Candidate quality rating</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Automation Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">73%</div>
                <p className="text-sm text-slate-600">Automated communications</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Email responses</span>
                    <span>89%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stage updates</span>
                    <span>57%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
