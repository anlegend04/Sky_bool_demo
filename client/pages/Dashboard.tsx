import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    {
      title: "Active Jobs",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: Briefcase,
      color: "blue"
    },
    {
      title: "Total Candidates",
      value: "1,847",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "green"
    },
    {
      title: "Interviews This Week",
      value: "67",
      change: "-5%",
      changeType: "negative" as const,
      icon: Clock,
      color: "orange"
    },
    {
      title: "Avg. Time to Hire",
      value: "18 days",
      change: "-2 days",
      changeType: "positive" as const,
      icon: Target,
      color: "purple"
    }
  ];

  const recentJobs = [
    { id: 1, title: "Senior Frontend Developer", department: "Engineering", applicants: 45, status: "Active", priority: "High" },
    { id: 2, title: "Product Manager", department: "Product", applicants: 32, status: "Active", priority: "Medium" },
    { id: 3, title: "UX Designer", department: "Design", applicants: 28, status: "Draft", priority: "Low" },
    { id: 4, title: "Data Scientist", department: "Analytics", applicants: 19, status: "Active", priority: "High" },
  ];

  const pipeline = [
    { stage: "Applied", count: 145, percentage: 100 },
    { stage: "Screening", count: 67, percentage: 46 },
    { stage: "Interview", count: 23, percentage: 16 },
    { stage: "Offer", count: 8, percentage: 6 },
    { stage: "Hired", count: 5, percentage: 3 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your recruitment.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" asChild>
            <Link to="/jobs/create">
              <Plus className="w-4 h-4 mr-2" />
              New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="flex items-center mt-1">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-slate-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recruitment Pipeline
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-slate-700">{stage.stage}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stage.count}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 w-32">
                    <Progress value={stage.percentage} className="h-2" />
                    <span className="text-sm text-slate-500 w-10">{stage.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Cost per Hire</span>
              <span className="font-semibold">$3,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Hiring Success Rate</span>
              <span className="font-semibold text-green-600">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Source Effectiveness</span>
              <span className="font-semibold">LinkedIn: 45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Pending Interviews</span>
              <span className="font-semibold text-orange-600">12</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Job Postings
            <Button variant="ghost" size="sm" asChild>
              <Link to="/jobs">View All</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Job Title</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Department</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Applicants</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Priority</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3">
                      <Link to={`/jobs/${job.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600">{job.department}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{job.applicants}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge 
                        variant={
                          job.priority === "High" ? "destructive" : 
                          job.priority === "Medium" ? "default" : "secondary"
                        }
                      >
                        {job.priority}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
