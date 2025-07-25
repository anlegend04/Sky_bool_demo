import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Target,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function Reports() {
  const overviewStats = [
    {
      title: "Time to Hire",
      value: "18 days",
      change: "-2 days",
      changeType: "positive" as const,
      icon: Clock,
      trend: "improving",
    },
    {
      title: "Cost per Hire",
      value: "$3,200",
      change: "-$150",
      changeType: "positive" as const,
      icon: DollarSign,
      trend: "improving",
    },
    {
      title: "Offer Acceptance Rate",
      value: "85%",
      change: "+5%",
      changeType: "positive" as const,
      icon: Target,
      trend: "improving",
    },
    {
      title: "Quality of Hire Score",
      value: "4.2/5",
      change: "+0.3",
      changeType: "positive" as const,
      icon: TrendingUp,
      trend: "improving",
    },
  ];

  const hiringMetrics = [
    {
      metric: "Total Applications",
      thisMonth: 2847,
      lastMonth: 2341,
      change: 22,
    },
    {
      metric: "Interviews Conducted",
      thisMonth: 245,
      lastMonth: 198,
      change: 24,
    },
    { metric: "Offers Extended", thisMonth: 56, lastMonth: 42, change: 33 },
    { metric: "Successful Hires", thisMonth: 48, lastMonth: 38, change: 26 },
    { metric: "Rejection Rate", thisMonth: 78, lastMonth: 82, change: -5 },
  ];

  const sourcePerformance = [
    {
      source: "LinkedIn",
      applications: 1245,
      hires: 28,
      cost: 2800,
      quality: 4.3,
    },
    {
      source: "Company Website",
      applications: 856,
      hires: 12,
      cost: 1200,
      quality: 4.1,
    },
    { source: "Indeed", applications: 432, hires: 5, cost: 800, quality: 3.8 },
    {
      source: "Referrals",
      applications: 234,
      hires: 8,
      cost: 400,
      quality: 4.6,
    },
    {
      source: "Glassdoor",
      applications: 156,
      hires: 3,
      cost: 600,
      quality: 3.9,
    },
  ];

  const departmentStats = [
    {
      department: "Engineering",
      positions: 12,
      filled: 8,
      avgTime: 22,
      budget: 180000,
      spent: 142000,
    },
    {
      department: "Product",
      positions: 5,
      filled: 4,
      avgTime: 19,
      budget: 75000,
      spent: 62000,
    },
    {
      department: "Design",
      positions: 3,
      filled: 2,
      avgTime: 16,
      budget: 35000,
      spent: 28000,
    },
    {
      department: "Marketing",
      positions: 4,
      filled: 3,
      avgTime: 14,
      budget: 45000,
      spent: 38000,
    },
    {
      department: "Sales",
      positions: 6,
      filled: 5,
      avgTime: 12,
      budget: 65000,
      spent: 58000,
    },
  ];

  const diversityData = [
    { category: "Gender", male: 58, female: 42, other: 0.5 },
    {
      category: "Ethnicity",
      white: 52,
      asian: 28,
      hispanic: 12,
      black: 6,
      other: 2,
    },
    { category: "Age", under30: 35, between30and50: 55, over50: 10 },
  ];

  const pipelineData = [
    { stage: "Application", count: 2847, conversionRate: 100 },
    { stage: "Initial Screen", count: 1423, conversionRate: 50 },
    { stage: "Phone Interview", count: 712, conversionRate: 25 },
    { stage: "Technical Interview", count: 285, conversionRate: 10 },
    { stage: "Final Interview", count: 142, conversionRate: 5 },
    { stage: "Offer", count: 56, conversionRate: 2 },
    { stage: "Hired", count: 48, conversionRate: 1.7 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-slate-600 mt-1">
            Comprehensive recruitment analytics, performance metrics, and data
            insights.
          </p>
        </div>
        <div className="flex space-x-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-1">
                    {stat.changeType === "positive" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-500 ml-2">
                      vs last period
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
          <TabsTrigger value="sources">Source Performance</TabsTrigger>
          <TabsTrigger value="departments">Department Metrics</TabsTrigger>
          <TabsTrigger value="diversity">Diversity Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Hiring Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Hiring Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 text-sm font-medium text-slate-600">
                        Metric
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        This Month
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Last Month
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hiringMetrics.map((metric, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 font-medium text-slate-900">
                          {metric.metric}
                        </td>
                        <td className="text-right py-3 text-slate-900">
                          {metric.thisMonth.toLocaleString()}
                        </td>
                        <td className="text-right py-3 text-slate-600">
                          {metric.lastMonth.toLocaleString()}
                        </td>
                        <td className="text-right py-3">
                          <div className="flex items-center justify-end">
                            {metric.change > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span
                              className={`font-medium ${
                                metric.change > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {metric.change > 0 ? "+" : ""}
                              {metric.change}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Hiring Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">
                    Interactive chart showing hiring trends over time
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Chart visualization would be implemented here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineData.map((stage, index) => (
                  <div
                    key={stage.stage}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-32 text-sm font-medium text-slate-700">
                      {stage.stage}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600">
                          {stage.count.toLocaleString()} candidates
                        </span>
                        <span className="text-sm font-medium">
                          {stage.conversionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stage.conversionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Bottlenecks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">
                      High Drop-off: Initial Screen → Phone Interview
                    </p>
                    <p className="text-sm text-red-700">
                      50% drop rate - Review screening criteria
                    </p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-900">
                      Slow Stage: Technical Interview
                    </p>
                    <p className="text-sm text-yellow-700">
                      Average 8 days - Consider process optimization
                    </p>
                  </div>
                  <Badge variant="outline">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 text-sm font-medium text-slate-600">
                        Source
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Applications
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Hires
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Cost per Hire
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Quality Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourcePerformance.map((source, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 font-medium text-slate-900">
                          {source.source}
                        </td>
                        <td className="text-right py-3 text-slate-900">
                          {source.applications.toLocaleString()}
                        </td>
                        <td className="text-right py-3 text-slate-900">
                          {source.hires}
                        </td>
                        <td className="text-right py-3 text-slate-900">
                          ${source.cost.toLocaleString()}
                        </td>
                        <td className="text-right py-3">
                          <div className="flex items-center justify-end">
                            <span className="font-medium">
                              {source.quality}
                            </span>
                            <div className="ml-2 flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full mr-1 ${
                                    i < Math.floor(source.quality)
                                      ? "bg-yellow-400"
                                      : "bg-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 text-sm font-medium text-slate-600">
                        Department
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Positions
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Filled
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Avg. Time
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-slate-600">
                        Budget Usage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentStats.map((dept, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 font-medium text-slate-900">
                          {dept.department}
                        </td>
                        <td className="text-right py-3 text-slate-900">
                          {dept.positions}
                        </td>
                        <td className="text-right py-3 text-slate-900">
                          {dept.filled}
                        </td>
                        <td className="text-right py-3 text-slate-900">
                          {dept.avgTime} days
                        </td>
                        <td className="text-right py-3">
                          <div className="text-right">
                            <span className="text-slate-900">
                              ${dept.spent.toLocaleString()}
                            </span>
                            <span className="text-slate-600">
                              /${dept.budget.toLocaleString()}
                            </span>
                            <div className="w-16 bg-slate-200 rounded-full h-1 mt-1 ml-auto">
                              <div
                                className="bg-blue-600 h-1 rounded-full"
                                style={{
                                  width: `${(dept.spent / dept.budget) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {diversityData.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.category} Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(category)
                      .filter(([key]) => key !== "category")
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-900 mr-2">
                              {value}%
                            </span>
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Diversity Goals & Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">
                      Gender Diversity Goal
                    </p>
                    <p className="text-sm text-green-700">
                      Target: 50/50 split | Current: 58/42
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-700 border-green-700"
                  >
                    84% Progress
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">
                      Leadership Diversity
                    </p>
                    <p className="text-sm text-blue-700">
                      Target: 40% diverse leadership | Current: 35%
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-blue-700 border-blue-700"
                  >
                    88% Progress
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
