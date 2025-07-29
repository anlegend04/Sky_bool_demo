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
  DialogFooter,
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
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useState, useMemo } from "react";
import { getAllEmailTemplates, EmailTemplate, generateEmailContent } from "@/lib/email-utils";

interface EmailTemplateExtended extends EmailTemplate {
  status: "active" | "inactive";
  usage: number;
  openRate: number;
  lastModified: string;
}

interface EmailPreviewData {
  template: EmailTemplateExtended;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  stage: string;
  interviewerName?: string;
  interviewDate?: string;
  interviewTime?: string;
}

export default function EmailAutomation() {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null,
  );
  const [previewData, setPreviewData] = useState<EmailPreviewData | null>(null);
  const [isManualSendOpen, setIsManualSendOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
    type: "",
    stage: "",
  });

  // Generate extended templates with usage statistics
  const emailTemplates: EmailTemplateExtended[] = useMemo(() => {
    const baseTemplates = getAllEmailTemplates();
    return baseTemplates.map((template, index) => ({
      ...template,
      status: "active" as const,
      usage: Math.floor(Math.random() * 200) + 20, // Random usage for demo
      openRate: Math.floor(Math.random() * 30) + 70, // Random open rate 70-100%
      lastModified: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Staggered dates
    }));
  }, []);

  const emailTemplatesOld: EmailTemplateExtended[] = [
    {
      id: 1,
      name: "Application Received",
      subject: "Thank you for your application - {{job_title}}",
      type: "auto-response",
      stage: "application",
      status: "active",
      usage: 156,
      openRate: 85,
      lastModified: "2024-01-15",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      content:
        "Dear {{candidate_name}},\n\nThank you for applying to the {{job_title}} position at {{company_name}}. We have received your application and will review it shortly.\n\nWe will contact you within the next 5-7 business days to update you on the status of your application.\n\nBest regards,\n{{company_name}} Recruitment Team",
    },
    {
      id: 2,
      name: "Screening Invitation",
      subject: "Next Steps - {{job_title}} at {{company_name}}",
      type: "screening",
      stage: "screening",
      status: "active",
      usage: 89,
      openRate: 92,
      lastModified: "2024-01-12",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
      ],
      content:
        "Dear {{candidate_name}},\n\nWe are pleased to inform you that your application for the {{job_title}} position has passed our initial review. We would like to invite you for a screening call.\n\nOur recruiter {{interviewer_name}} will be conducting this call. Please reply with your availability for the next week.\n\nBest regards,\n{{company_name}} Team",
    },
    {
      id: 3,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}} at {{company_name}}",
      type: "interview",
      stage: "interview",
      status: "active",
      usage: 67,
      openRate: 94,
      lastModified: "2024-01-10",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{interview_time}}",
      ],
      content:
        "Dear {{candidate_name}},\n\nWe are impressed with your qualifications and would like to invite you for an interview for the {{job_title}} position.\n\nInterview Details:\nDate: {{interview_date}}\nTime: {{interview_time}}\nInterviewer: {{interviewer_name}}\n\nPlease confirm your attendance by replying to this email.\n\nBest regards,\n{{company_name}} Team",
    },
    {
      id: 4,
      name: "Job Offer",
      subject: "Job Offer - {{job_title}} at {{company_name}}",
      type: "offer",
      stage: "offer",
      status: "active",
      usage: 23,
      openRate: 98,
      lastModified: "2024-01-08",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{salary_range}}",
      ],
      content:
        "Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}.\n\nSalary: {{salary_range}}\n\nPlease review the attached offer letter and let us know your decision within 5 business days.\n\nWe look forward to welcoming you to our team!\n\nBest regards,\n{{company_name}} HR Team",
    },
    {
      id: 5,
      name: "Application Rejected",
      subject: "Update on your application - {{job_title}}",
      type: "rejection",
      stage: "rejected",
      status: "active",
      usage: 134,
      openRate: 76,
      lastModified: "2024-01-05",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      content:
        "Dear {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position at {{company_name}}. After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe appreciate the time you invested in the application process and encourage you to apply for future opportunities that match your skills and experience.\n\nBest regards,\n{{company_name}} Team",
    },
  ];

  const stages = [
    { value: "applied", label: "Applied" },
    { value: "screening", label: "Screening" },
    { value: "interview", label: "Interview" },
    { value: "technical", label: "Technical" },
    { value: "offer", label: "Offer" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
  ];

  const templateTypes = [
    { value: "auto-response", label: "Auto Response" },
    { value: "confirmation", label: "Confirmation" },
    { value: "screening", label: "Screening" },
    { value: "interview", label: "Interview" },
    { value: "technical", label: "Technical" },
    { value: "offer", label: "Job Offer" },
    { value: "welcome", label: "Welcome" },
    { value: "onboarding", label: "Onboarding" },
    { value: "rejection", label: "Rejection" },
    { value: "follow-up", label: "Follow-up" },
    { value: "reminder", label: "Reminder" },
    { value: "future-opportunity", label: "Future Opportunity" },
  ];

  const variables = [
    "{{candidate_name}}",
    "{{job_title}}",
    "{{company_name}}",
    "{{interviewer_name}}",
    "{{interview_date}}",
    "{{interview_time}}",
    "{{position_department}}",
    "{{salary_range}}",
    "{{stage}}",
    "{{application_date}}",
  ];

  const stats = [
    {
      title: "Active Templates",
      value: emailTemplates
        .filter((t) => t.status === "active")
        .length.toString(),
      change: "+2",
      color: "blue",
    },
    {
      title: "Templates Used (30d)",
      value: emailTemplates.reduce((sum, t) => sum + t.usage, 0).toString(),
      change: "+18%",
      color: "green",
    },
    {
      title: "Avg. Open Rate",
      value: `${Math.round(emailTemplates.reduce((sum, t) => sum + t.openRate, 0) / emailTemplates.length)}%`,
      change: "+5%",
      color: "orange",
    },
  ];

  const generateEmailPreview = (
    template: EmailTemplate,
    candidateData?: Partial<EmailPreviewData>,
  ) => {
    const data = {
      candidateName: candidateData?.candidateName || "John Doe",
      jobTitle: candidateData?.jobTitle || "Software Engineer",
      companyName: candidateData?.companyName || "TechCorp Inc.",
      stage: candidateData?.stage || template.stage || "application",
      interviewerName: candidateData?.interviewerName || "Sarah Johnson",
      interviewDate: candidateData?.interviewDate || "March 15, 2024",
      interviewTime: candidateData?.interviewTime || "2:00 PM EST",
    };

    let subject = template.subject;
    let content = template.content;

    // Replace placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key.replace(/([A-Z])/g, "_$1").toLowerCase()}}}`;
      subject = subject.replace(new RegExp(placeholder, "g"), value);
      content = content.replace(new RegExp(placeholder, "g"), value);
    });

    // Additional common replacements
    subject = subject.replace(/{{salary_range}}/g, "$80,000 - $120,000");
    content = content.replace(/{{salary_range}}/g, "$80,000 - $120,000");
    content = content.replace(/{{application_date}}/g, "March 1, 2024");

    return { subject, content, data };
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    const preview = generateEmailPreview(template);
    setPreviewData({
      template,
      ...preview.data,
    });
    setIsPreviewDialogOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      subject: template.subject,
      content: template.content,
      type: template.type,
      stage: template.stage || "",
    });
    setIsEditingTemplate(true);
    setIsTemplateDialogOpen(true);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setNewTemplate({
      name: "",
      subject: "",
      content: "",
      type: "",
      stage: "",
    });
    setIsEditingTemplate(false);
    setIsTemplateDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    // In a real app, this would save to backend
    console.log("Saving template:", newTemplate);
    setIsTemplateDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleManualSend = (template: EmailTemplate) => {
    const preview = generateEmailPreview(template);
    setPreviewData({
      template,
      ...preview.data,
    });
    setIsManualSendOpen(true);
  };

  const handleSendEmail = () => {
    // In a real app, this would send the email
    console.log("Sending email:", previewData);
    setIsManualSendOpen(false);
    setPreviewData(null);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById(
      "email-content",
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = newTemplate.content;
      const newContent =
        current.substring(0, start) + variable + current.substring(end);
      setNewTemplate((prev) => ({ ...prev, content: newContent }));

      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + variable.length,
          start + variable.length,
        );
      }, 0);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Email Templates & Manual Triggers
          </h1>
          <p className="text-slate-600 mt-1">
            Create and manage email templates with manual sending controls
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleCreateTemplate} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600">
                    {stat.change} vs last month
                  </p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Email Templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {emailTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                        {template.subject}
                      </p>
                      {template.stage && (
                        <Badge variant="outline" className="mt-2">
                          {
                            stages.find((s) => s.value === template.stage)
                              ?.label
                          }
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        template.status === "active" ? "default" : "secondary"
                      }
                    >
                      {template.status}
                    </Badge>
                    <Badge variant="outline">
                      {
                        templateTypes.find((t) => t.value === template.type)
                          ?.label
                      }
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
                      <span className="text-slate-600">Last Modified:</span>
                      <span className="font-medium">
                        {template.lastModified}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleManualSend(template)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
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
                <CardTitle>Template Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emailTemplates.slice(0, 5).map((template) => (
                    <div
                      key={template.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {template.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {template.usage} sent
                        </p>
                      </div>
                      <Badge variant="outline">{template.openRate}% open</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage by Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stages.map((stage) => {
                    const stageTemplates = emailTemplates.filter(
                      (t) => t.stage === stage.value,
                    );
                    const totalUsage = stageTemplates.reduce(
                      (sum, t) => sum + t.usage,
                      0,
                    );
                    return (
                      <div
                        key={stage.value}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{stage.label}</span>
                        <div className="text-right">
                          <div className="font-semibold">{totalUsage}</div>
                          <div className="text-sm text-slate-600">
                            {stageTemplates.length} templates
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <Input
                    defaultValue="noreply@talentflow.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Reply-to Email</Label>
                  <Input defaultValue="hr@talentflow.com" className="mt-1" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require confirmation before sending</Label>
                    <p className="text-sm text-slate-600">
                      Always show preview modal before sending emails
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-populate candidate data</Label>
                    <p className="text-sm text-slate-600">
                      Automatically fill template variables from candidate
                      profile
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Creation/Edit Dialog */}
      <Dialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditingTemplate
                ? "Edit Email Template"
                : "Create Email Template"}
            </DialogTitle>
            <DialogDescription>
              {isEditingTemplate
                ? "Update your email template content and settings."
                : "Create a new email template for candidate communication."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    placeholder="e.g. Interview Confirmation"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Template Type</Label>
                  <Select
                    value={newTemplate.type}
                    onValueChange={(value) =>
                      setNewTemplate((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Associated Stage (Optional)</Label>
                <Select
                  value={newTemplate.stage}
                  onValueChange={(value) =>
                    setNewTemplate((prev) => ({ ...prev, stage: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject Line</Label>
                <Input
                  placeholder="e.g. Interview scheduled for {{job_title}} position"
                  value={newTemplate.subject}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email Content</Label>
                <Textarea
                  id="email-content"
                  placeholder="Dear {{candidate_name}},&#10;&#10;Your email content here...&#10;&#10;Best regards,&#10;{{company_name}} Team"
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[300px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Available Variables</Label>
                <p className="text-sm text-slate-600 mb-2">
                  Click to insert into content
                </p>
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {variables.map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => insertVariable(variable)}
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {isEditingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Email Preview - {previewData?.template.name}
            </DialogTitle>
            <DialogDescription>
              Preview of how the email will appear to candidates
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">To:</Label>
                    <p className="text-sm">
                      {previewData.candidateName} &lt;candidate@email.com&gt;
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Subject:</Label>
                    <p className="text-sm font-medium">
                      {
                        generateEmailPreview(previewData.template, previewData)
                          .subject
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {
                      generateEmailPreview(previewData.template, previewData)
                        .content
                    }
                  </pre>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Send Confirmation Dialog */}
      <Dialog open={isManualSendOpen} onOpenChange={setIsManualSendOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Send Email - {previewData?.template.name}</DialogTitle>
            <DialogDescription>
              Review and edit the email before sending
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Recipient</Label>
                  <Input
                    defaultValue={previewData.candidateName}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input defaultValue="candidate@email.com" className="mt-1" />
                </div>
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  defaultValue={
                    generateEmailPreview(previewData.template, previewData)
                      .subject
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email Content</Label>
                <Textarea
                  defaultValue={
                    generateEmailPreview(previewData.template, previewData)
                      .content
                  }
                  className="mt-1 min-h-[300px]"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Manual Sending Required
                    </p>
                    <p className="text-sm text-amber-700">
                      This email will only be sent after you click the "Send
                      Email" button. You can make any final edits before
                      sending.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsManualSendOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
