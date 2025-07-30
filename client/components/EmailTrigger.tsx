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
import {
  getTemplatesForStage,
  generateEmailContent,
  EmailTemplate,
} from "@/lib/email-utils";

interface EmailTriggerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateData;
  newStage: string;
  jobTitle?: string;
  onEmailSent?: (emailData: any) => void;
}

const stages = [
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "technical", label: "Technical" },
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
  onEmailSent,
}: EmailTriggerProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [isEmailOptional, setIsEmailOptional] = useState(false);

  // Get templates for the new stage based on the transition
  const getTemplatesForTransition = (currentStage: string, newStage: string) => {
    const stageTransitions = {
      "Applied": "Screening", // Applied → Screening: Send confirmation email
      "Screening": "Interview", // Screening → Interview: Send interview invitation
      "Interview": "Technical", // Interview → Technical: Send interview results + technical test
      "Technical": "Offer", // Technical → Offer: Send offer letter
      "Offer": "Hired", // Offer → Hired: Send onboarding instructions
    };
    
    // Get templates for the new stage
    const stageTemplates = getTemplatesForStage(newStage);
    
    // For Interview → Technical transition, show both technical test and no-test options
    if (currentStage === "Interview" && newStage === "Technical") {
      return stageTemplates.filter(template => 
        template.name.includes("Technical Test") || template.name.includes("No Technical Test")
      );
    }
    
    return stageTemplates;
  };
  
  // Get the stage from the candidate's job application
  const candidateStage = candidate.jobApplications?.[0]?.currentStage || "Applied";
  const stageTemplates = getTemplatesForTransition(candidateStage, newStage);
  const selectedTemplate = stageTemplates.find(
    (t) => t.id === selectedTemplateId,
  );

  // Auto-select template if only one is available for the stage
  useEffect(() => {
    if (stageTemplates.length === 1) {
      setSelectedTemplateId(stageTemplates[0].id);
    } else if (stageTemplates.length === 0) {
      setIsEmailOptional(true);
    } else if (stageTemplates.length > 1 && candidateStage === "Interview" && newStage === "Technical") {
      // For Interview → Technical, default to technical test required
      const technicalTestTemplate = stageTemplates.find(t => t.name.includes("Technical Test"));
      if (technicalTestTemplate) {
        setSelectedTemplateId(technicalTestTemplate.id);
      }
    }
  }, [newStage, stageTemplates.length, candidateStage]);

  // Generate email content when template is selected
  useEffect(() => {
    if (selectedTemplate && candidate) {
      const generatedEmail = generateEmailContent(selectedTemplate, candidate, {
        jobTitle,
      });
      setEmailSubject(generatedEmail.subject);
      setEmailContent(generatedEmail.content);
      setRecipientEmail(candidate.email || "");
    }
  }, [selectedTemplate, candidate, jobTitle]);

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

  const stageName = stages.find((s) => s.value === newStage)?.label || newStage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Stage Update Email - {stageName}</span>
          </DialogTitle>
          <DialogDescription>
            {stageTemplates.length > 0
              ? `Moving ${candidate.name} from ${candidateStage} to ${stageName}. Select the appropriate email template to send.`
              : `No template available for the ${stageName} stage. You can skip sending an email or manually compose one.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          {stageTemplates.length > 1 && (
            <div>
              <Label>Select Email Template</Label>
              <Select
                value={selectedTemplateId?.toString() || ""}
                onValueChange={(value) =>
                  setSelectedTemplateId(parseInt(value))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {stageTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
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
                  <h4 className="font-medium text-blue-900">
                    {selectedTemplate.name}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Template for {stageName} stage communications
                  </p>
                  {candidateStage === "Interview" && newStage === "Technical" && (
                    <p className="text-xs text-blue-600 mt-2">
                      💡 <strong>Recruitment Rule:</strong> After interview, choose whether candidate needs technical test or can proceed directly to offer.
                    </p>
                  )}
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
                  <p className="font-medium text-amber-800">
                    No Template Available
                  </p>
                  <p className="text-sm text-amber-700">
                    No email template is configured for the {stageName} stage.
                    You can skip sending an email or create a custom message
                    below.
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
                  <Input value={candidate.name} disabled className="mt-1" />
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
                      <span className="font-medium">To:</span> {candidate.name}{" "}
                      &lt;{recipientEmail}&gt;
                    </div>
                    <div>
                      <span className="font-medium">Subject:</span>{" "}
                      {emailSubject}
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
                <p className="font-medium text-green-800">
                  Manual Sending Required
                </p>
                <p className="text-sm text-green-700">
                  The email will only be sent when you click "Send Email". The
                  candidate's stage will be updated regardless of your email
                  decision.
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
              disabled={
                !recipientEmail.trim() ||
                !emailSubject.trim() ||
                !emailContent.trim()
              }
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
