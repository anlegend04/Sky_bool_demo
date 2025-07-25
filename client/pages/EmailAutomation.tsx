import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Mail,
  Send,
  Edit,
  Copy,
  Trash2,
  Clock,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function EmailAutomation() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);

  const emailTemplates = [
    {
      id: 1,
      name: "Application Received",
      subject: "Thank you for your application - {{job_title}}",
      type: "auto-response",
      trigger: "application_received",
      status: "active",
      usage: 156,
      openRate: 85,
      content: "Dear {{candidate_name}},\n\nThank you for applying to the {{job_title}} position at {{company_name}}. We have received your application and will review it shortly..."
    },
    {
      id: 2,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}} at {{company_name}}",
      type: "interview",
      trigger: "manual",
      status: "active",
      usage: 89,
      openRate: 92,
      content: "Dear {{candidate_name}},\n\nWe are impressed with your application for the {{job_title}} position and would like to invite you for an interview..."
    },
    {
      id: 3,
      name: "Application Rejected",
      subject: "Update on your application - {{job_title}}",
      type: "rejection",
      trigger: "status_change",
      status: "active",
      usage: 234,
      openRate: 78,
      content: "Dear {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position. After careful consideration..."
    },
    {
      id: 4,
      name: "Offer Extended",
      subject: "Job Offer - {{job_title}} at {{company_name}}",
      type: "offer",
      trigger: "manual",
      status: "active",
      usage: 23,
      openRate: 95,
      content: "Dear {{candidate_name}},\n\nWe are pleased to extend an offer for the {{job_title}} position at {{company_name}}..."
    },
    {
      id: 5,
      name: "Interview Reminder",
      subject: "Reminder: Interview Tomorrow - {{job_title}}",
      type: "reminder",
      trigger: "scheduled",
      status: "active",
      usage: 67,
      openRate: 88,
      content: "Dear {{candidate_name}},\n\nThis is a friendly reminder about your interview scheduled for tomorrow..."
    }
  ];

  const workflows = [
    {
      id: 1,
      name: "New Application Workflow",
      description: "Automated sequence for new applications",
      trigger: "Application Received",
      steps: 3,
      active: true,
      candidates: 45,
      openRate: 87
    },
    {
      id: 2,
      name: "Interview Process",
      description: "Follow-up sequence for interview candidates",
      trigger: "Interview Scheduled",
      steps: 4,
      active: true,
      candidates: 23,
      openRate: 92
    },
    {
      id: 3,
      name: "Rejection Follow-up",
      description: "Nurture rejected candidates for future opportunities",
      trigger: "Application Rejected",
      steps: 2,
      active: false,
      candidates: 0,
      openRate: 0
    }
  ];

  const stats = [
    { title: "Active Templates", value: "12", change: "+2", color: "blue" },
    { title: "Emails Sent (30d)", value: "2,847", change: "+18%", color: "green" },
    { title: "Avg. Open Rate", value: "87%", change: "+5%", color: "orange" },
    { title: "Active Workflows", value: "6", change: "+1", color: "purple" }
  ];

  const variables = [
    "{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interviewer_name}}",
    "{{interview_date}}", "{{interview_time}}", "{{position_department}}", "{{salary_range}}"
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Email Automation</h1>
          <p className="text-slate-600 mt-1">Manage email templates, workflows, and automate candidate communication.</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Email Workflow</DialogTitle>
                <DialogDescription>Set up an automated email sequence for candidates.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Workflow Name</Label>
                    <Input placeholder="e.g. Interview Follow-up" className="mt-1" />
                  </div>
                  <div>
                    <Label>Trigger Event</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application">Application Received</SelectItem>
                        <SelectItem value="screening">Screening Completed</SelectItem>
                        <SelectItem value="interview">Interview Scheduled</SelectItem>
                        <SelectItem value="offer">Offer Extended</SelectItem>
                        <SelectItem value="rejection">Application Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of this workflow..." className="mt-1" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Workflow</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Email Template</DialogTitle>
                <DialogDescription>Create a new email template for candidate communication.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Template Name</Label>
                    <Input placeholder="e.g. Interview Confirmation" className="mt-1" />
                  </div>
                  <div>
                    <Label>Template Type</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto-response">Auto Response</SelectItem>
                        <SelectItem value="interview">Interview Related</SelectItem>
                        <SelectItem value="offer">Job Offer</SelectItem>
                        <SelectItem value="rejection">Rejection</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Subject Line</Label>
                  <Input placeholder="e.g. Interview scheduled for {{job_title}} position" className="mt-1" />
                </div>
                <div>
                  <Label>Email Content</Label>
                  <Textarea 
                    placeholder="Dear {{candidate_name}},&#10;&#10;Your email content here...&#10;&#10;Best regards,&#10;{{company_name}} Team"
                    className="mt-1 min-h-[200px]"
                  />
                </div>
                <div>
                  <Label>Available Variables</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="cursor-pointer hover:bg-slate-100">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} vs last month</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Mail className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="workflows">Automation Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Email Templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">{template.subject}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={template.status === "active" ? "default" : "secondary"}>
                      {template.status}
                    </Badge>
                    <Badge variant="outline">
                      {template.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Usage (30d):</span>
                      <span className="font-medium">{template.usage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Open Rate:</span>
                      <span className="font-medium">{template.openRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Trigger:</span>
                      <span className="font-medium capitalize">{template.trigger.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t border-slate-100">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Edit Email Template</DialogTitle>
                          <DialogDescription>Update your email template content and settings.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Template Name</Label>
                              <Input defaultValue={template.name} className="mt-1" />
                            </div>
                            <div>
                              <Label>Template Type</Label>
                              <Select defaultValue={template.type}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="auto-response">Auto Response</SelectItem>
                                  <SelectItem value="interview">Interview Related</SelectItem>
                                  <SelectItem value="offer">Job Offer</SelectItem>
                                  <SelectItem value="rejection">Rejection</SelectItem>
                                  <SelectItem value="reminder">Reminder</SelectItem>
                                  <SelectItem value="follow-up">Follow-up</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>Subject Line</Label>
                            <Input defaultValue={template.subject} className="mt-1" />
                          </div>
                          <div>
                            <Label>Email Content</Label>
                            <Textarea
                              defaultValue={template.content}
                              className="mt-1 min-h-[200px]"
                            />
                          </div>
                          <div>
                            <Label>Available Variables</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {variables.map((variable) => (
                                <Badge key={variable} variant="outline" className="cursor-pointer hover:bg-slate-100">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Changes</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          {/* Automation Workflows */}
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${workflow.active ? 'bg-green-100' : 'bg-slate-100'}`}>
                        {workflow.active ? (
                          <Play className={`w-5 h-5 ${workflow.active ? 'text-green-600' : 'text-slate-400'}`} />
                        ) : (
                          <Pause className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
                        <p className="text-sm text-slate-600">{workflow.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Steps</p>
                        <p className="font-semibold">{workflow.steps}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Active Candidates</p>
                        <p className="font-semibold">{workflow.candidates}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Open Rate</p>
                        <p className="font-semibold">{workflow.openRate}%</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch checked={workflow.active} />
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Emails Sent</span>
                    <span className="font-semibold">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Average Open Rate</span>
                    <span className="font-semibold text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Average Click Rate</span>
                    <span className="font-semibold text-blue-600">34%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Bounce Rate</span>
                    <span className="font-semibold text-red-600">2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailTemplates.slice(0, 4).map((template) => (
                    <div key={template.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">{template.name}</p>
                        <p className="text-sm text-slate-600">{template.usage} sent</p>
                      </div>
                      <Badge variant="outline">
                        {template.openRate}% open
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-send acknowledgments</Label>
                    <p className="text-sm text-slate-600">Automatically send confirmation emails when candidates apply</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Interview reminders</Label>
                    <p className="text-sm text-slate-600">Send reminder emails 24 hours before interviews</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Status change notifications</Label>
                    <p className="text-sm text-slate-600">Notify candidates when their application status changes</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sender Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>From Name</Label>
                  <Input defaultValue="TalentFlow Team" className="mt-1" />
                </div>
                <div>
                  <Label>From Email</Label>
                  <Input defaultValue="noreply@talentflow.com" className="mt-1" />
                </div>
                <div>
                  <Label>Reply-to Email</Label>
                  <Input defaultValue="hr@talentflow.com" className="mt-1" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
