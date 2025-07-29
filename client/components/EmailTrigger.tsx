import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, AlertCircle, FileText, X } from "lucide-react";
import { CandidateData } from "@/data/hardcoded-data";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: string;
  stage?: string;
  variables: string[];
}

interface EmailTriggerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateData;
  newStage: string;
  jobTitle?: string;
  onEmailSent?: (emailData: any) => void;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Application Received",
    subject: "Thank you for your application - {{job_title}}",
    content: "Dear {{candidate_name}},\n\nThank you for applying to the {{job_title}} position at {{company_name}}. We have received your application and will review it shortly.\n\nWe will contact you within the next 5-7 business days to update you on the status of your application.\n\nBest regards,\n{{company_name}} Recruitment Team",
    type: "auto-response",
    stage: "application",
    variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
  },
  {
    id: 2,
    name: "Screening Invitation",
    subject: "Next Steps - {{job_title}} at {{company_name}}",
    content: "Dear {{candidate_name}},\n\nWe are pleased to inform you that your application for the {{job_title}} position has passed our initial review. We would like to invite you for a screening call.\n\nOur recruiter will be conducting this call. Please reply with your availability for the next week.\n\nBest regards,\n{{company_name}} Team",
    type: "screening",
    stage: "screening",
    variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
  },
  {
    id: 3,
    name: "Interview Invitation",
    subject: "Interview Invitation - {{job_title}} at {{company_name}}",
    content: "Dear {{candidate_name}},\n\nWe are impressed with your qualifications and would like to invite you for an interview for the {{job_title}} position.\n\nInterview Details:\nDate: [To be scheduled]\nTime: [To be scheduled]\nInterviewer: [To be assigned]\n\nPlease confirm your attendance by replying to this email.\n\nBest regards,\n{{company_name}} Team",
    type: "interview",
    stage: "interview",
    variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interview_date}}", "{{interview_time}}", "{{interviewer_name}}"],
  },
  {
    id: 4,
    name: "Job Offer",
    subject: "Job Offer - {{job_title}} at {{company_name}}",
    content: "Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}.\n\nPlease review the attached offer letter and let us know your decision within 5 business days.\n\nWe look forward to welcoming you to our team!\n\nBest regards,\n{{company_name}} HR Team",
    type: "offer",
    stage: "offer",
    variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{salary_range}}"],
  },
  {
    id: 5,
    name: "Application Rejected",
    subject: "Update on your application - {{job_title}}",
    content: "Dear {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position at {{company_name}}. After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe appreciate the time you invested in the application process and encourage you to apply for future opportunities that match your skills and experience.\n\nBest regards,\n{{company_name}} Team",
    type: "rejection",
    stage: "rejected",
    variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
  },
];

const stages = [
  { value: "application", label: "Application" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export function EmailTrigger({ 
  isOpen, 
  onClose, 
  candidate, 
  newStage, 
  jobTitle,
  onEmailSent 
}: EmailTriggerProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [isEmailOptional, setIsEmailOptional] = useState(false);

  // Get templates for the new stage
  const stageTemplates = emailTemplates.filter(template => template.stage === newStage);
  const selectedTemplate = emailTemplates.find(t => t.id === selectedTemplateId);

  // Auto-select template if only one is available for the stage
  useEffect(() => {
    if (stageTemplates.length === 1) {
      setSelectedTemplateId(stageTemplates[0].id);
    } else if (stageTemplates.length === 0) {
      setIsEmailOptional(true);
    }
  }, [newStage, stageTemplates.length]);

  // Generate email content when template is selected
  useEffect(() => {
    if (selectedTemplate && candidate) {
      const generatedEmail = generateEmailContent(selectedTemplate, candidate, jobTitle);
      setEmailSubject(generatedEmail.subject);
      setEmailContent(generatedEmail.content);
      setRecipientEmail(candidate.email || "");
    }
  }, [selectedTemplate, candidate, jobTitle]);

  const generateEmailContent = (template: EmailTemplate, candidateData: CandidateData, job?: string) => {
    const replacements = {
      "{{candidate_name}}": candidateData.name,
      "{{job_title}}": job || "the position",
      "{{company_name}}": "TechCorp Inc.",
      "{{stage}}": stages.find(s => s.value === newStage)?.label || newStage,
      "{{interviewer_name}}": "Sarah Johnson",
      "{{interview_date}}": "March 15, 2024",
      "{{interview_time}}": "2:00 PM EST",
      "{{salary_range}}": "$80,000 - $120,000",
      "{{application_date}}": new Date().toLocaleDateString(),
    };

    let subject = template.subject;
    let content = template.content;

    Object.entries(replacements).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return { subject, content };
  };

  const handleSendEmail = () => {
    const emailData = {
      templateId: selectedTemplateId,
      templateName: selectedTemplate?.name,
      recipientEmail,
      recipientName: candidate.name,
      subject: emailSubject,
      content: emailContent,
      candidateId: candidate.id,
      stage: newStage,
      sentAt: new Date().toISOString(),
    };

    // In a real app, this would send the email via API
    console.log("Sending email:", emailData);
    
    if (onEmailSent) {
      onEmailSent(emailData);
    }
    
    onClose();
  };

  const handleSkipEmail = () => {
    onClose();
  };

  const stageName = stages.find(s => s.value === newStage)?.label || newStage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Stage Update Email - {stageName}</span>
          </DialogTitle>
          <DialogDescription>
            {stageTemplates.length > 0 ? (
              `A template is available for the ${stageName} stage. Review and send the email to ${candidate.name}.`
            ) : (
              `No template available for the ${stageName} stage. You can skip sending an email or manually compose one.`
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          {stageTemplates.length > 1 && (
            <div>
              <Label>Select Email Template</Label>
              <Select 
                value={selectedTemplateId?.toString() || ""} 
                onValueChange={(value) => setSelectedTemplateId(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {stageTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show selected template info */}
          {selectedTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">{selectedTemplate.name}</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Template for {stageName} stage communications
                  </p>
                </div>
                <Badge variant="outline">{selectedTemplate.type}</Badge>
              </div>
            </div>
          )}

          {/* No template available */}
          {stageTemplates.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">No Template Available</p>
                  <p className="text-sm text-amber-700">
                    No email template is configured for the {stageName} stage. 
                    You can skip sending an email or create a custom message below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Composition */}
          {(selectedTemplate || isEmailOptional) && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Recipient</Label>
                  <Input 
                    value={candidate.name}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input 
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="candidate@email.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Subject Line</Label>
                <Input 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email Content</Label>
                <Textarea 
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Email content..."
                  className="mt-1 min-h-[300px]"
                />
              </div>

              {isPreviewMode && selectedTemplate && (
                <div className="bg-slate-50 border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-medium">Email Preview</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsPreviewMode(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">To:</span> {candidate.name} &lt;{recipientEmail}&gt;
                    </div>
                    <div>
                      <span className="font-medium">Subject:</span> {emailSubject}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {emailContent}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Important notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Manual Sending Required</p>
                <p className="text-sm text-green-700">
                  The email will only be sent when you click "Send Email". 
                  The candidate's stage will be updated regardless of your email decision.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={handleSkipEmail}>
            Skip Email
          </Button>
          {(selectedTemplate || emailContent.trim()) && (
            <Button 
              onClick={handleSendEmail}
              disabled={!recipientEmail.trim() || !emailSubject.trim() || !emailContent.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
