import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  ArrowLeft,
  Share,
  Edit,
  MoreHorizontal,
  Star,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();

  const job = {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Active",
    priority: "High",
    posted: "2 days ago",
    salary: "$120k - $150k",
    experience: "5+ years",
    education: "Bachelor's degree preferred",
    remote: "Hybrid",
    timezone: "PST",
    startDate: "Immediate",
    deadline: "2024-02-15",
    hiringManager: "Sarah Johnson",
    recruiter: "Mike Chen",
    budget: "$180k",
    headcount: 2,
    jobCode: "ENG-2024-001",
    description:
      "We're looking for a Senior Frontend Developer to join our growing engineering team. You'll be working on cutting-edge web applications using React, TypeScript, and modern development tools.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern JavaScript (ES6+)",
      "Experience with state management (Redux, Zustand, etc.)",
      "Proficiency with CSS-in-JS or Tailwind CSS",
      "Experience with testing frameworks (Jest, Vitest, etc.)",
    ],
    niceToHave: [
      "Experience with Next.js or similar frameworks",
      "Knowledge of GraphQL and Apollo Client",
      "Previous experience in a fast-paced startup environment",
      "Open source contributions",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "401(k) with company matching",
      "Unlimited PTO policy",
      "Professional development budget",
    ],
    responsibilities: [
      "Develop and maintain high-quality frontend applications",
      "Collaborate with design and backend teams",
      "Participate in code reviews and technical discussions",
      "Mentor junior developers",
      "Stay up-to-date with latest frontend technologies",
    ],
  };

  const kanbanColumns = [
    {
      id: "applied",
      title: "Applied",
      count: 45,
      candidates: [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          avatar: "",
          rating: 4,
          appliedDate: "2 days ago",
        },
        {
          id: 2,
          name: "Michael Chen",
          email: "m.chen@email.com",
          avatar: "",
          rating: 5,
          appliedDate: "3 days ago",
        },
        {
          id: 3,
          name: "Emily Davis",
          email: "emily.d@email.com",
          avatar: "",
          rating: 3,
          appliedDate: "4 days ago",
        },
      ],
    },
    {
      id: "screening",
      title: "Phone Screening",
      count: 12,
      candidates: [
        {
          id: 4,
          name: "James Wilson",
          email: "james.w@email.com",
          avatar: "",
          rating: 4,
          appliedDate: "1 week ago",
        },
        {
          id: 5,
          name: "Lisa Garcia",
          email: "lisa.g@email.com",
          avatar: "",
          rating: 5,
          appliedDate: "1 week ago",
        },
      ],
    },
    {
      id: "interview",
      title: "Technical Interview",
      count: 8,
      candidates: [
        {
          id: 6,
          name: "David Kim",
          email: "david.k@email.com",
          avatar: "",
          rating: 5,
          appliedDate: "2 weeks ago",
        },
        {
          id: 7,
          name: "Anna Martinez",
          email: "anna.m@email.com",
          avatar: "",
          rating: 4,
          appliedDate: "2 weeks ago",
        },
      ],
    },
    {
      id: "final",
      title: "Final Round",
      count: 3,
      candidates: [
        {
          id: 8,
          name: "Robert Taylor",
          email: "robert.t@email.com",
          avatar: "",
          rating: 5,
          appliedDate: "3 weeks ago",
        },
      ],
    },
    {
      id: "offer",
      title: "Offer Extended",
      count: 2,
      candidates: [
        {
          id: 9,
          name: "Jessica Brown",
          email: "jessica.b@email.com",
          avatar: "",
          rating: 5,
          appliedDate: "1 month ago",
        },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-slate-600">
              <span>{job.department}</span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Posted {job.posted}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Applications</p>
                <p className="text-2xl font-bold">70</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Process</p>
                <p className="text-2xl font-bold">25</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. Rating</p>
                <p className="text-2xl font-bold">4.2</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Salary Range</p>
                <p className="text-2xl font-bold">{job.salary}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="candidates">Candidates Pipeline</TabsTrigger>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-6">
          {/* Kanban Board */}
          <div className="overflow-x-auto">
            <div className="flex space-x-6 min-w-max pb-4">
              {kanbanColumns.map((column) => (
                <div key={column.id} className="w-80 flex-shrink-0">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">
                        {column.title}
                      </h3>
                      <Badge variant="secondary">{column.count}</Badge>
                    </div>
                    <div className="space-y-3">
                      {column.candidates.map((candidate) => (
                        <Card
                          key={candidate.id}
                          className="hover:shadow-sm transition-shadow cursor-pointer"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={candidate.avatar} />
                                <AvatarFallback>
                                  {candidate.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900 truncate">
                                  {candidate.name}
                                </h4>
                                <p className="text-sm text-slate-600 truncate">
                                  {candidate.email}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < candidate.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-slate-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    {candidate.appliedDate}
                                  </span>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                  >
                                    <Mail className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                  >
                                    <FileText className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {column.candidates.length < column.count && (
                        <div className="text-center py-4">
                          <Button variant="ghost" size="sm">
                            View {column.count - column.candidates.length} more
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-slate-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-slate-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nice to Have</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.niceToHave.map((nice, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-slate-700">{nice}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge variant="default">{job.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Priority
                    </label>
                    <div className="mt-1">
                      <Badge variant="destructive">{job.priority}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Job Code
                    </label>
                    <p className="mt-1 text-slate-900">{job.jobCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Employment Type
                    </label>
                    <p className="mt-1 text-slate-900">{job.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Work Type
                    </label>
                    <p className="mt-1 text-slate-900">{job.remote}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Salary Range
                    </label>
                    <p className="mt-1 text-slate-900">{job.salary}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Location
                    </label>
                    <p className="mt-1 text-slate-900">{job.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Timezone
                    </label>
                    <p className="mt-1 text-slate-900">{job.timezone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Department
                    </label>
                    <p className="mt-1 text-slate-900">{job.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Experience Required
                    </label>
                    <p className="mt-1 text-slate-900">{job.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Education
                    </label>
                    <p className="mt-1 text-slate-900">{job.education}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Start Date
                    </label>
                    <p className="mt-1 text-slate-900">{job.startDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Application Deadline
                    </label>
                    <p className="mt-1 text-slate-900">{job.deadline}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Hiring Manager
                    </label>
                    <p className="mt-1 text-slate-900">{job.hiringManager}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Recruiter
                    </label>
                    <p className="mt-1 text-slate-900">{job.recruiter}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Budget
                    </label>
                    <p className="mt-1 text-slate-900">{job.budget}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Headcount
                    </label>
                    <p className="mt-1 text-slate-900">
                      {job.headcount} position(s)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Analytics dashboard for this job posting will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
