import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  MessageCircle,
  Video,
  User,
  FileText,
  Inbox,
  Users as UsersIcon,
  Briefcase,
  Star,
  Activity,
  Paperclip,
  Clock,
  MoreHorizontal,
  Building2,
  GraduationCap,
  Share,
  Edit,
  Download,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function CandidateDetail() {
  const { id } = useParams();

  const candidate = {
    id: 1,
    name: "Marissa Mayer",
    email: "marissa.mayer@lumilabs.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco Bay Area",
    currentCompany: "Lumi Labs",
    currentPosition: "Co-Founder",
    reference: "53VWX75",
    gender: "Female",
    diploma: "MS",
    university: "Stanford University",
    birthdate: "1987-05-11",
    age: 33,
    avatar: "",
    status: "Active",
    rating: 4.5,
    appliedDate: "2024-01-15",
    source: "LinkedIn",
    resume: "marissa_mayer_resume.pdf",
    skills: [
      "Analytics",
      "Cloud Computing",
      "E-commerce",
      "Mobile Applications",
      "Mobile Devices",
      "Online Advertising",
      "Product Management",
      "Product Marketing",
      "Start-ups",
      "Strategic Partnerships",
      "Usability Testing",
      "User Experience",
      "User Experience Design",
      "Web Analytics",
    ],
    experience: "15+ years",
    expectedSalary: "$180k - $220k",
    noticePeriod: "3 months",
    linkedIn: "https://linkedin.com/in/marissa-mayer",
    github: "https://github.com/marissa-mayer",
    portfolio: "https://marissa-mayer.com",
  };

  const quickActions = [
    { icon: Calendar, label: "Schedule Meeting", color: "blue" },
    { icon: Phone, label: "Schedule Call", color: "green" },
    { icon: Video, label: "Schedule Interview", color: "purple" },
    { icon: FileText, label: "Create Test", color: "orange" },
  ];

  const recentHistory = [
    {
      id: 1,
      action: "updated the candidate",
      user: "Paige",
      candidate: "Marissa Mayer",
      date: "2020-06-18",
      avatar: "",
    },
  ];

  const socialNotifications = 5;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/candidates">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Link>
        </Button>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="text-xl">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {candidate.name}
                  </h1>
                  <Badge variant="secondary" className="text-xs font-bold">
                    T
                  </Badge>
                </div>

                <div className="flex items-center space-x-1 text-slate-600">
                  <Building2 className="w-4 h-4" />
                  <span>
                    {candidate.currentPosition}, {candidate.currentCompany}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{candidate.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-2" />
                Add to Job
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Candidate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col space-y-2 hover:bg-slate-50"
              >
                <action.icon className="w-5 h-5" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Summary</span>
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </TabsTrigger>
          <TabsTrigger value="inbox" className="flex items-center space-x-2">
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <UsersIcon className="w-4 h-4" />
            <span>Social</span>
            {socialNotifications > 0 && (
              <Badge
                variant="default"
                className="ml-1 px-1.5 py-0.5 text-xs bg-green-500"
              >
                {socialNotifications}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>Jobs</span>
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Activities</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger
            value="attachments"
            className="flex items-center space-x-2"
          >
            <Paperclip className="w-4 h-4" />
            <span>Attachments</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Candidate Details */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Candidate Name</span>
                    <p className="font-medium text-slate-900">
                      {candidate.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Candidate Reference</span>
                    <p className="font-medium text-slate-900">
                      {candidate.reference}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Gender</span>
                    <p className="font-medium text-slate-900">
                      {candidate.gender}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Diploma</span>
                    <p className="font-medium text-slate-900">
                      {candidate.diploma}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">University</span>
                    <p className="font-medium text-slate-900">
                      {candidate.university}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Current Company</span>
                    <p className="font-medium text-slate-900">
                      {candidate.currentCompany}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Current Position</span>
                    <p className="font-medium text-slate-900">
                      {candidate.currentPosition}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Candidate Location</span>
                    <p className="font-medium text-slate-900">
                      {candidate.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Birthdate</span>
                    <p className="font-medium text-slate-900">
                      {candidate.birthdate} ({candidate.age} years old)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Experience</span>
                    <p className="font-medium text-slate-900">
                      {candidate.experience}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Expected Salary</span>
                    <p className="font-medium text-slate-900">
                      {candidate.expectedSalary}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Notice Period</span>
                    <p className="font-medium text-slate-900">
                      {candidate.noticePeriod}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-green-50 text-green-800 border-green-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <CardTitle>Resume & Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{candidate.resume}</p>
                      <p className="text-sm text-slate-600">
                        Uploaded on {candidate.appliedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Online Profiles</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>LinkedIn Profile</span>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>GitHub Profile</span>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Portfolio Website</span>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle>Email Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Email conversation history will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Social media activity and professional network interactions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Jobs this candidate has applied for or been considered for.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Candidate activity and interaction timeline.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Private notes and comments about this candidate.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle>File Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Additional files and documents related to this candidate.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>
                        {entry.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="text-blue-600 font-medium">
                          {entry.user}
                        </span>{" "}
                        {entry.action}{" "}
                        <span className="text-blue-600 font-medium">
                          {entry.candidate}
                        </span>
                      </p>
                      <p className="text-xs text-slate-600">{entry.date}</p>
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
