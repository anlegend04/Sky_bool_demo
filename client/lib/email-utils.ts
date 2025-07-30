import { CandidateData } from "@/data/hardcoded-data";

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: string;
  stage?: string;
  variables: string[];
  requiresConfirmation?: boolean;
  confirmationDeadline?: number; // days
  autoRejectOnOverdue?: boolean;
}

export interface EmailData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  stage: string;
  interviewerName?: string;
  interviewDate?: string;
  interviewTime?: string;
  salaryRange?: string;
  applicationDate?: string;
  confirmationDeadline?: string;
  testDeadline?: string;
  offerDeadline?: string;
  [key: string]: string | undefined;
}

// New interfaces for tracking confirmation status
export interface ConfirmationStatus {
  id: string;
  type: "interview" | "test" | "offer";
  requestedDate: string;
  deadline: string;
  confirmed: boolean | null; // null = pending, true = confirmed, false = rejected
  confirmedDate?: string;
  overdue: boolean;
  autoRejected: boolean;
}

export interface StageTracking {
  stage: string;
  enteredDate: string;
  duration: number; // days
  emailSent: boolean;
  emailSentDate?: string;
  confirmationRequired: boolean;
  confirmationStatus?: ConfirmationStatus;
  completed: boolean;
  completedDate?: string;
}

export function generateEmailContent(
  template: EmailTemplate,
  candidate: CandidateData,
  additionalData?: Partial<EmailData>,
): { subject: string; content: string } {
  // Get the primary job application for email data
  const primaryJob = candidate.jobApplications[0];
  
  // Calculate deadlines based on template requirements
  const now = new Date();
  const confirmationDeadline = template.confirmationDeadline 
    ? new Date(now.getTime() + template.confirmationDeadline * 24 * 60 * 60 * 1000).toLocaleDateString()
    : undefined;
  
  const defaultData: EmailData = {
    candidateName: candidate.name,
    jobTitle: primaryJob?.jobTitle || "the position",
    companyName: "TechCorp Inc.",
    stage: primaryJob?.currentStage || "application",
    interviewerName: "Sarah Johnson",
    interviewDate: "March 15, 2024",
    interviewTime: "2:00 PM EST",
    salaryRange: primaryJob?.salary || "$80,000 - $120,000",
    applicationDate: primaryJob?.appliedDate || new Date().toLocaleDateString(),
    confirmationDeadline,
    testDeadline: template.stage === "technical" ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : undefined,
    offerDeadline: template.stage === "offer" ? new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : undefined,
    ...additionalData,
  };

  let subject = template.subject;
  let content = template.content;

  // Replace all placeholders
  Object.entries(defaultData).forEach(([key, value]) => {
    if (value) {
      const placeholder = `{{${key.replace(/([A-Z])/g, "_$1").toLowerCase()}}}`;
      subject = subject.replace(new RegExp(placeholder, "g"), value);
      content = content.replace(new RegExp(placeholder, "g"), value);
    }
  });

  // Handle additional common variables
  const commonReplacements = {
    "{{position_department}}": primaryJob?.department || "Engineering",
    "{{duration}}": primaryJob?.stageHistory?.[primaryJob.stageHistory.length - 1]?.duration?.toString() || "5",
    "{{recruiter_name}}": primaryJob?.recruiter || "HR Team",
  };

  Object.entries(commonReplacements).forEach(([placeholder, value]) => {
    subject = subject.replace(new RegExp(placeholder, "g"), value);
    content = content.replace(new RegExp(placeholder, "g"), value);
  });

  return { subject, content };
}

export function getTemplatesForStage(stage: string): EmailTemplate[] {
  const allTemplates = getAllEmailTemplates();
  return allTemplates.filter(
    (template) => template.stage === stage.toLowerCase(),
  );
}

export function getAllEmailTemplates(): EmailTemplate[] {
  return [
    // Applied → Screening: Confirmation email that company received application
    {
      id: 1,
      name: "Application Received - Confirmation",
      subject: "We received your application - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position at {{company_name}}. We have successfully received your application and our recruitment team is currently reviewing your qualifications.\n\nWhat happens next:\n- Our team will review your application within 3-5 business days\n- If your profile matches our requirements, we will contact you to schedule a screening call\n- We will keep you updated throughout the process\n\nIf you have any questions about your application, please don't hesitate to reach out to our HR team.\n\nWe appreciate your interest in joining our team!\n\nBest regards,\n{{company_name}} Recruitment Team",
      type: "confirmation",
      stage: "screening",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      requiresConfirmation: false,
      confirmationDeadline: 5,
      autoRejectOnOverdue: false,
    },

    // Screening → Interview: Interview invitation
    {
      id: 2,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nCongratulations! We are pleased to invite you for an interview for the {{job_title}} position at {{company_name}}.\n\nInterview Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Interviewer: {{interviewer_name}}\n- Location: {{company_name}} Headquarters\n- Duration: Approximately 45-60 minutes\n\nWhat to prepare:\n- Review the job description and company information\n- Prepare examples of your relevant experience\n- Have questions ready about the role and company\n\nIMPORTANT: Please confirm your attendance by replying to this email by {{confirmation_deadline}}. If you do not confirm by this deadline, we will assume you are no longer interested in the position.\n\nIf you need to reschedule, please let us know as soon as possible.\n\nWe look forward to meeting you!\n\nBest regards,\n{{company_name}} Team",
      type: "interview",
      stage: "interview",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{interview_time}}",
        "{{confirmation_deadline}}",
      ],
      requiresConfirmation: true,
      confirmationDeadline: 3,
      autoRejectOnOverdue: true,
    },

    // Interview reminder (auto-sent)
    {
      id: 3,
      name: "Interview Reminder",
      subject: "Reminder: Interview Tomorrow - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nThis is a friendly reminder that you have an interview scheduled for tomorrow.\n\nInterview Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Interviewer: {{interviewer_name}}\n- Location: {{company_name}} Headquarters\n\nPlease arrive 10 minutes early and bring a copy of your resume.\n\nIf you need to reschedule or have any questions, please contact us immediately.\n\nWe look forward to meeting you!\n\nBest regards,\n{{company_name}} Team",
      type: "reminder",
      stage: "interview",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{interview_time}}",
      ],
      requiresConfirmation: false,
      confirmationDeadline: 1,
      autoRejectOnOverdue: false,
    },

    // Interview → Technical: Interview results + technical test (if needed)
    {
      id: 4,
      name: "Interview Results - Technical Test Required",
      subject: "Interview Results & Technical Assessment - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for taking the time to interview with us for the {{job_title}} position at {{company_name}}. We enjoyed learning more about your background and experience.\n\nInterview Results:\n- Overall Assessment: Positive\n- Technical Skills: Good foundation\n- Communication: Excellent\n- Cultural Fit: Strong match\n\nNext Steps:\nWe would like to proceed to the technical assessment phase. This will help us better understand your technical capabilities.\n\nTechnical Assessment Details:\n- Test Type: Coding challenge and system design\n- Duration: 2 hours\n- Deadline: {{test_deadline}}\n- Format: Online coding platform\n\nYou will receive a separate email with login credentials and detailed instructions for the technical test.\n\nIMPORTANT: Please complete the technical assessment by {{test_deadline}}. If we do not receive your submission by this deadline, we will consider you as no longer interested in the position.\n\nGood luck with the assessment!\n\nBest regards,\n{{company_name}} Technical Team",
      type: "results",
      stage: "technical",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{test_deadline}}",
      ],
      requiresConfirmation: false,
      confirmationDeadline: 7,
      autoRejectOnOverdue: true,
    },

    // Interview → Technical: Interview results (no technical test needed)
    {
      id: 5,
      name: "Interview Results - No Technical Test",
      subject: "Interview Results - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for taking the time to interview with us for the {{job_title}} position at {{company_name}}. We enjoyed learning more about your background and experience.\n\nInterview Results:\n- Overall Assessment: Excellent\n- Technical Skills: Strong\n- Communication: Outstanding\n- Cultural Fit: Perfect match\n\nGreat news! Based on your interview performance, we would like to proceed directly to the offer stage. You have demonstrated all the skills and qualities we are looking for.\n\nNext Steps:\nOur HR team will prepare your offer package and will contact you within 2-3 business days with the details.\n\nWe are excited about the possibility of having you join our team!\n\nBest regards,\n{{company_name}} Team",
      type: "results",
      stage: "offer",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
      ],
      requiresConfirmation: false,
      confirmationDeadline: 5,
      autoRejectOnOverdue: false,
    },

    // Technical → Offer: Offer letter
    {
      id: 6,
      name: "Job Offer",
      subject: "Job Offer - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}!\n\nOffer Details:\n- Position: {{job_title}}\n- Department: {{position_department}}\n- Salary: {{salary_range}}\n- Start Date: Flexible, based on your availability\n- Benefits: Health insurance, 401(k) matching, paid time off\n\nPlease review the attached offer letter for complete details including benefits, vacation policy, and other terms.\n\nIMPORTANT: Please confirm your acceptance or rejection of this offer by {{offer_deadline}}. If we do not receive your confirmation by this deadline, we will assume you are declining the offer.\n\nWe would love to have you join our team and look forward to hearing from you!\n\nBest regards,\n{{company_name}} HR Team",
      type: "offer",
      stage: "offer",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{salary_range}}",
        "{{position_department}}",
        "{{offer_deadline}}",
      ],
      requiresConfirmation: true,
      confirmationDeadline: 5,
      autoRejectOnOverdue: true,
    },

    // Offer → Hired: Onboarding instructions
    {
      id: 7,
      name: "Onboarding Instructions",
      subject: "Welcome to {{company_name}} - First Day Instructions",
      content:
        "Dear {{candidate_name}},\n\nWelcome to {{company_name}}! We are thrilled to have you join our team as {{job_title}}.\n\nYour first day is scheduled for {{interview_date}}. Here's what you need to know:\n\nFirst Day Schedule:\n- 9:00 AM: Arrival and welcome at reception\n- 9:30 AM: HR orientation and paperwork completion\n- 11:00 AM: IT setup and system access\n- 1:00 PM: Team lunch and introductions\n- 2:00 PM: Department overview and role expectations\n- 4:00 PM: First team meeting\n\nWhat to bring:\n- Valid ID for I-9 verification\n- Banking information for direct deposit\n- Emergency contact information\n- Any questions you have about the role\n\nYour manager {{interviewer_name}} will be your primary point of contact and will help you get settled in.\n\nIMPORTANT: Please confirm that you have received these instructions and understand the first day schedule by replying to this email by {{confirmation_deadline}}.\n\nWe're excited to see the great things you'll accomplish with us!\n\nBest regards,\n{{company_name}} HR Team",
      type: "onboarding",
      stage: "hired",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{confirmation_deadline}}",
      ],
      requiresConfirmation: true,
      confirmationDeadline: 3,
      autoRejectOnOverdue: false,
    },
  ];
}

export const commonEmailVariables = [
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
  "{{recruiter_name}}",
  "{{duration}}",
  "{{confirmation_deadline}}",
  "{{test_deadline}}",
  "{{offer_deadline}}",
];

// Helper functions for stage tracking
export function createStageTracking(stage: string, duration: number = 5): StageTracking {
  return {
    stage,
    enteredDate: new Date().toISOString(),
    duration,
    emailSent: false,
    confirmationRequired: false,
    completed: false,
  };
}

export function createConfirmationStatus(
  type: "interview" | "test" | "offer",
  deadlineDays: number
): ConfirmationStatus {
  const now = new Date();
  const deadline = new Date(now.getTime() + deadlineDays * 24 * 60 * 60 * 1000);
  
  return {
    id: `${type}_${Date.now()}`,
    type,
    requestedDate: now.toISOString(),
    deadline: deadline.toISOString(),
    confirmed: null,
    overdue: false,
    autoRejected: false,
  };
}

export function checkOverdueStatus(confirmationStatus: ConfirmationStatus): ConfirmationStatus {
  const now = new Date();
  const deadline = new Date(confirmationStatus.deadline);
  
  return {
    ...confirmationStatus,
    overdue: now > deadline,
    autoRejected: now > deadline && confirmationStatus.confirmed === null,
  };
}
