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
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { LanguageDebug } from "@/components/LanguageDebug";

export default function Dashboard() {
  const { t, currentLanguage } = useLanguage();

  const stats = [
    {
      titleKey: "dashboard.activeJobs",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: Briefcase,
      color: "blue",
    },
    {
      titleKey: "dashboard.totalCandidates",
      value: "1,847",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "green",
    },
    {
      titleKey: "dashboard.interviewsThisWeek",
      value: "67",
      change: "-5%",
      changeType: "negative" as const,
      icon: Clock,
      color: "orange",
    },
    {
      titleKey: "dashboard.avgTimeToHire",
      value: "18 days",
      change: "-2 days",
      changeType: "positive" as const,
      icon: Target,
      color: "purple",
    },
  ];

  const getJobTitle = (titleKey: string) => {
    const jobTitles: { [key: string]: string } = {
      'senior_frontend_developer': currentLanguage === 'vi' ? 'Lập trình viên Frontend cấp cao' : 'Senior Frontend Developer',
      'product_manager': currentLanguage === 'vi' ? 'Quản lý sản phẩm' : 'Product Manager',
      'ux_designer': currentLanguage === 'vi' ? 'Nhà thiết kế UX' : 'UX Designer',
      'data_scientist': currentLanguage === 'vi' ? 'Nhà khoa học dữ liệu' : 'Data Scientist'
    };
    return jobTitles[titleKey] || titleKey;
  };

  const getDepartment = (deptKey: string) => {
    const departments: { [key: string]: string } = {
      'Engineering': currentLanguage === 'vi' ? 'Kỹ thuật' : 'Engineering',
      'Product': currentLanguage === 'vi' ? 'Sản phẩm' : 'Product',
      'Design': currentLanguage === 'vi' ? 'Thiết kế' : 'Design',
      'Analytics': currentLanguage === 'vi' ? 'Phân tích' : 'Analytics'
    };
    return departments[deptKey] || deptKey;
  };

  const getStatus = (statusKey: string) => {
    const statuses: { [key: string]: string } = {
      'Active': t('dashboard.active'),
      'Draft': t('dashboard.draft')
    };
    return statuses[statusKey] || statusKey;
  };

  const getPriority = (priorityKey: string) => {
    const priorities: { [key: string]: string } = {
      'High': t('dashboard.high'),
      'Medium': t('dashboard.medium'),
      'Low': t('dashboard.low')
    };
    return priorities[priorityKey] || priorityKey;
  };

  const recentJobs = [
    {
      id: 1,
      titleKey: "senior_frontend_developer",
      departmentKey: "Engineering",
      applicants: 45,
      statusKey: "Active",
      priorityKey: "High",
    },
    {
      id: 2,
      titleKey: "product_manager",
      departmentKey: "Product",
      applicants: 32,
      statusKey: "Active",
      priorityKey: "Medium",
    },
    {
      id: 3,
      titleKey: "ux_designer",
      departmentKey: "Design",
      applicants: 28,
      statusKey: "Draft",
      priorityKey: "Low",
    },
    {
      id: 4,
      titleKey: "data_scientist",
      departmentKey: "Analytics",
      applicants: 19,
      statusKey: "Active",
      priorityKey: "High",
    },
  ];

  const pipeline = [
    { stageKey: "dashboard.applied", count: 145, percentage: 100 },
    { stageKey: "dashboard.screening", count: 67, percentage: 46 },
    { stageKey: "dashboard.interview", count: 23, percentage: 16 },
    { stageKey: "dashboard.offer", count: 8, percentage: 6 },
    { stageKey: "dashboard.hired", count: 5, percentage: 3 },
  ];

  return (
    <div className="padding-responsive space-mobile">
      {/* Header */}
      <div className="flex-responsive justify-responsive items-responsive space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="heading-responsive text-wrap-safe">
            {t("dashboard.title")}
          </h1>
          <p className="text-responsive-base text-slate-600 mt-1 text-wrap-safe">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="btn-group-mobile">
          <Button variant="outline" size="sm" className="btn-mobile">
            <Filter className="icon-mobile mr-2" />
            {t("dashboard.filter")}
          </Button>
          {/* <Button variant="outline" size="sm" className="btn-mobile">
            <Link to="/jobs/create">
              <Plus className="icon-mobile mr-2" />
              New Job
            </Link>
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-mobile">
        {stats.map((stat) => (
          <Card
            key={stat.titleKey}
            className="relative overflow-hidden card-responsive"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                {t(stat.titleKey)}
              </CardTitle>
              <div
                className={`p-2 rounded-lg bg-${stat.color}-100 flex-shrink-0`}
              >
                <stat.icon className={`icon-mobile text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent className="card-mobile">
              <div className="text-responsive-xl font-bold text-slate-900 text-wrap-safe">
                {stat.value}
              </div>
              <div className="flex items-center mt-1">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="icon-mobile text-green-500" />
                ) : (
                  <ArrowDownRight className="icon-mobile text-red-500" />
                )}
                <span
                  className={`text-responsive-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  } text-wrap-safe`}
                >
                  {stat.change}
                </span>
                <span className="text-responsive-sm text-slate-500 ml-2 hidden sm:inline text-wrap-safe">
                  {t("dashboard.vsLastMonth")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recruitment Pipeline */}
        <Card className="lg:col-span-2">
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
                    <span className="font-medium text-slate-700 text-responsive-base truncate-mobile text-wrap-safe">
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
                $3,200
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-responsive-base text-wrap-safe">
                {t("dashboard.hiringSuccessRate")}
              </span>
              <span className="font-semibold text-green-600 text-responsive-base text-wrap-safe">
                85%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-responsive-base text-wrap-safe">
                {t("dashboard.sourceEffectiveness")}
              </span>
              <span className="font-semibold text-responsive-base text-wrap-safe">
                LinkedIn: 45%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-responsive-base text-wrap-safe">
                {t("dashboard.pendingInterviews")}
              </span>
              <span className="font-semibold text-orange-600 text-responsive-base text-wrap-safe">
                12
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-responsive-lg text-wrap-safe">
              {t("dashboard.recentJobPostings")}
            </span>
            <Button variant="ghost" size="sm" asChild className="btn-mobile">
              <Link to="/jobs">{t("dashboard.viewAll")}</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="card-mobile">
          {/* Mobile Card View */}
          <div className="table-mobile-card space-mobile">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="border border-slate-200 rounded-lg p-4 space-y-3 card-responsive"
              >
                <div className="flex justify-between items-start min-w-0">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600 text-responsive-base text-wrap-safe min-w-0 flex-1 truncate"
                  >
                    {getJobTitle(job.titleKey)}
                  </Link>
                  <Badge
                    variant={job.statusKey === "Active" ? "default" : "secondary"}
                    className="badge-mobile flex-shrink-0"
                  >
                    {getStatus(job.statusKey)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-responsive-sm text-slate-600 min-w-0">
                  <span className="text-wrap-safe truncate flex-1">
                    {getDepartment(job.departmentKey)}
                  </span>
                  <span className="text-wrap-safe flex-shrink-0 ml-2">
                    {job.applicants} {t("dashboard.applicants")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge
                    variant={
                      job.priorityKey === "High"
                        ? "destructive"
                        : job.priorityKey === "Medium"
                          ? "default"
                          : "secondary"
                    }
                    className="badge-mobile"
                  >
                    {getPriority(job.priorityKey)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="table-desktop overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    {t("dashboard.jobTitle")}
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    {t("dashboard.department")}
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    {t("dashboard.applicants")}
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    {t("dashboard.status")}
                  </th>
                  <th className="text-left py-3 text-responsive-sm font-medium text-slate-600 text-wrap-safe">
                    {t("dashboard.priority")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600 text-wrap-safe truncate max-w-48 block"
                      >
                        {getJobTitle(job.titleKey)}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600 text-wrap-safe truncate max-w-32">
                      {getDepartment(job.departmentKey)}
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary" className="badge-mobile">
                        {job.applicants}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          job.statusKey === "Active" ? "default" : "secondary"
                        }
                        className="badge-mobile"
                      >
                        {getStatus(job.statusKey)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          job.priorityKey === "High"
                            ? "destructive"
                            : job.priorityKey === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="badge-mobile"
                      >
                        {getPriority(job.priorityKey)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Debug component for language testing */}
      {process.env.NODE_ENV === 'development' && <LanguageDebug />}
    </div>
  );
}
