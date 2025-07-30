import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  Calendar,
  User,
  Target,
  Clock,
  Star,
  MoreHorizontal,
  Briefcase,
} from "lucide-react";
import { JobApplication } from "@/types/enhanced-candidate";

interface JobSelectorProps {
  jobApplications: JobApplication[];
  selectedJobId: string;
  onJobSelect: (jobId: string) => void;
  showAllJobs?: boolean;
  onToggleShowAll?: () => void;
}

export function JobSelector({
  jobApplications,
  selectedJobId,
  onJobSelect,
  showAllJobs = false,
  onToggleShowAll,
}: JobSelectorProps) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Hired":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      case "Offer":
        return "bg-blue-500";
      case "Interview":
      case "Technical":
        return "bg-orange-500";
      case "Screening":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStageProgress = (stage: string) => {
    const stages = [
      "Applied",
      "Screening",
      "Interview",
      "Technical",
      "Offer",
      "Hired",
    ];
    const currentIndex = stages.indexOf(stage);
    return currentIndex >= 0 ? ((currentIndex + 1) / stages.length) * 100 : 0;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "On Hold":
        return "secondary";
      case "Withdrawn":
        return "destructive";
      case "Completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (showAllJobs) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              All Job Applications ({jobApplications.length})
            </CardTitle>
            {onToggleShowAll && (
              <Button variant="outline" size="sm" onClick={onToggleShowAll}>
                Select Job View
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobApplications.map((job) => (
              <div
                key={job.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedJobId === job.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  onJobSelect(job.id);
                  onToggleShowAll?.();
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {job.jobTitle}
                    </h3>
                    <Badge
                      variant={getStatusBadgeVariant(job.status)}
                      className="text-xs ml-2 flex-shrink-0"
                    >
                      {job.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      <span className="break-words">{job.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span className="break-words">{job.recruiter}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(job.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        Progress
                      </span>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getStageColor(job.currentStage)}`}
                        />
                        <span className="text-xs text-gray-600">
                          {job.currentStage}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{
                          width: `${getStageProgress(job.currentStage)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Star
                        className={`w-3 h-3 ${getPriorityColor(job.priority)}`}
                      />
                      <span
                        className={`text-xs ${getPriorityColor(job.priority)}`}
                      >
                        {job.priority}
                      </span>
                    </div>
                    {job.salary && (
                      <span className="text-xs text-gray-600">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Job Applications
          </CardTitle>
          {onToggleShowAll && jobApplications.length > 1 && (
            <Button variant="outline" size="sm" onClick={onToggleShowAll}>
              View All ({jobApplications.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedJobId}
          onValueChange={onJobSelect}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 h-auto p-1">
            {jobApplications.map((job) => (
              <TabsTrigger
                key={job.id}
                value={job.id}
                className="flex flex-col items-start p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-medium text-sm break-words pr-2">
                    {job.jobTitle}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${getStageColor(job.currentStage)}`}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <Building2 className="w-3 h-3" />
                  <span className="break-words">{job.department}</span>
                </div>
                <div className="flex items-center justify-between w-full mt-1">
                  <span className="text-xs opacity-80">{job.currentStage}</span>
                  <Badge variant="outline" className="text-xs border-current">
                    {job.priority}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}
