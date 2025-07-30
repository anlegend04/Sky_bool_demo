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
    // Applied Stage Templates - Thank you email with 3-5 days promise
    {
      id: 1,
      name: "Application Received - Thank You",
      subject: "Thank you for your application - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position at {{company_name}}. We have received your application and are excited to review your qualifications.\n\nOur recruitment team will carefully review your application and we will contact you within 3-5 business days to inform you about the next steps in our process.\n\nIf you have any questions in the meantime, please don't hesitate to reach out to our HR team.\n\nBest regards,\n{{company_name}} Recruitment Team",
      type: "auto-response",
      stage: "applied",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      requiresConfirmation: false,
      confirmationDeadline: 5,
      autoRejectOnOverdue: false,
    },
    {
      id: 7,
      name: "application_received",
      subject: "Application Received - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nWe have received your application for the {{job_title}} position at {{company_name}}. Thank you for your interest in joining our team.\n\nOur team will review your application and get back to you within 3-5 business days.\n\nBest regards,\n{{company_name}} Team",
      type: "auto-response",
      stage: "applied",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      requiresConfirmation: false,
      confirmationDeadline: 5,
      autoRejectOnOverdue: false,
    },

    // Interview Stage Templates - Interview invitation with confirmation required
    {
      id: 2,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nWe are pleased to invite you for an interview for the {{job_title}} position at {{company_name}}.\n\nInterview Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Interviewer: {{interviewer_name}}\n- Location: {{company_name}} Headquarters\n\nIMPORTANT: Please confirm your attendance by replying to this email by {{confirmation_deadline}}. If you do not confirm by this deadline, we will assume you are no longer interested in the position.\n\nIf you need to reschedule, please let us know as soon as possible.\n\nWe look forward to meeting you!\n\nBest regards,\n{{company_name}} Team",
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
    {
      id: 8,
      name: "screening_invitation",
      subject: "Screening Invitation - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nCongratulations! Your application for the {{job_title}} position at {{company_name}} has been selected for the screening phase.\n\nWe would like to schedule a brief phone call to discuss your background and answer any questions you may have about the role.\n\nPlease reply to this email with your availability for the next week.\n\nBest regards,\n{{company_name}} Team",
      type: "screening",
      stage: "screening",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      requiresConfirmation: true,
      confirmationDeadline: 3,
      autoRejectOnOverdue: true,
    },
    {
      id: 9,
      name: "interview_scheduling",
      subject: "Interview Scheduling - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nWe are excited to invite you for an interview for the {{job_title}} position at {{company_name}}.\n\nPlease confirm your availability for the following time slots:\n- Option 1: {{interview_date}} at {{interview_time}}\n- Option 2: Alternative time (please specify)\n\nIMPORTANT: Please confirm your attendance by replying to this email within 3 days.\n\nBest regards,\n{{company_name}} Team",
      type: "interview",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interview_date}}", "{{interview_time}}"],
      requiresConfirmation: true,
      confirmationDeadline: 3,
      autoRejectOnOverdue: true,
    },
    {
      id: 3,
      name: "Post-Interview Thank You",
      subject: "Thank you for your interview - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for taking the time to interview for the {{job_title}} position at {{company_name}}. We enjoyed learning more about your background and experience.\n\nWe were impressed by your knowledge and enthusiasm for the role. Our team will review your interview performance and we will contact you within 5-7 business days with an update on next steps.\n\nIf you have any additional questions, please feel free to reach out.\n\nBest regards,\n{{company_name}} Team",
      type: "follow-up",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      requiresConfirmation: false,
      confirmationDeadline: 7,
      autoRejectOnOverdue: false,
    },

    // Technical Stage Templates - Test assignment with deadline
    {
      id: 4,
      name: "Technical Test Assignment",
      subject: "Technical Assessment - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nCongratulations on progressing to the technical assessment stage for the {{job_title}} position at {{company_name}}!\n\nTechnical Assessment Details:\n- Test Type: Coding challenge and system design\n- Duration: 2 hours\n- Deadline: {{test_deadline}}\n- Format: Online coding platform\n\nIMPORTANT: Please complete the technical assessment by {{test_deadline}}. If we do not receive your submission by this deadline, we will consider you as no longer interested in the position.\n\nYou will receive an email with login credentials and test instructions shortly.\n\nGood luck!\n\nBest regards,\n{{company_name}} Technical Team",
      type: "technical",
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
    {
      id: 10,
      name: "technical_assessment",
      subject: "Technical Assessment - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nYou have been selected for the technical assessment phase for the {{job_title}} position at {{company_name}}.\n\nAssessment Details:\n- Type: Coding challenge\n- Duration: 2 hours\n- Deadline: {{test_deadline}}\n\nPlease complete the assessment by the deadline. You will receive login credentials shortly.\n\nBest regards,\n{{company_name}} Technical Team",
      type: "technical",
      stage: "technical",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{test_deadline}}"],
      requiresConfirmation: false,
      confirmationDeadline: 7,
      autoRejectOnOverdue: true,
    },

    // Offer Stage Templates - Offer letter with acceptance confirmation
    {
      id: 5,
      name: "Job Offer",
      subject: "Job Offer - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}!\n\nOffer Details:\n- Position: {{job_title}}\n- Department: {{position_department}}\n- Salary: {{salary_range}}\n- Start Date: Flexible, based on your availability\n\nPlease review the attached offer letter for complete details including benefits, vacation policy, and other terms.\n\nIMPORTANT: Please confirm your acceptance or rejection of this offer by {{offer_deadline}}. If we do not receive your confirmation by this deadline, we will assume you are declining the offer.\n\nWe would love to have you join our team and look forward to hearing from you!\n\nBest regards,\n{{company_name}} HR Team",
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
    {
      id: 11,
      name: "offer_letter",
      subject: "Job Offer - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nCongratulations! We are pleased to offer you the {{job_title}} position at {{company_name}}.\n\nOffer Details:\n- Salary: {{salary_range}}\n- Start Date: To be discussed\n\nPlease review the attached offer letter and confirm your acceptance by {{offer_deadline}}.\n\nBest regards,\n{{company_name}} HR Team",
      type: "offer",
      stage: "offer",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{salary_range}}", "{{offer_deadline}}"],
      requiresConfirmation: true,
      confirmationDeadline: 5,
      autoRejectOnOverdue: true,
    },

    // Onboard Stage Templates - First day instructions
    {
      id: 6,
      name: "Onboarding Instructions",
      subject: "Welcome to {{company_name}} - First Day Instructions",
      content:
        "Dear {{candidate_name}},\n\nWelcome to {{company_name}}! We are thrilled to have you join our team as {{job_title}}.\n\nYour first day is scheduled for {{interview_date}}. Here's what you need to do:\n\nFirst Day Schedule:\n- 9:00 AM: Arrival and welcome at reception\n- 9:30 AM: HR orientation and paperwork completion\n- 11:00 AM: IT setup and system access\n- 1:00 PM: Team lunch and introductions\n- 2:00 PM: Department overview and role expectations\n- 4:00 PM: First team meeting\n\nWhat to bring:\n- Valid ID for I-9 verification\n- Banking information for direct deposit\n- Emergency contact information\n- Any questions you have about the role\n\nYour manager {{interviewer_name}} will be your primary point of contact and will help you get settled in.\n\nWe're excited to see the great things you'll accomplish with us!\n\nBest regards,\n{{company_name}} HR Team",
      type: "onboarding",
      stage: "hired",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
      ],
      requiresConfirmation: false,
      confirmationDeadline: 0,
      autoRejectOnOverdue: false,
    },
    {
      id: 12,
      name: "welcome_onboard",
      subject: "Welcome to {{company_name}} - Onboarding",
      content:
        "Dear {{candidate_name}},\n\nWelcome to {{company_name}}! We are excited to have you join our team as {{job_title}}.\n\nOnboarding Details:\n- First Day: To be confirmed\n- Location: {{company_name}} Headquarters\n- Dress Code: Business casual\n\nYou will receive additional onboarding materials shortly.\n\nBest regards,\n{{company_name}} HR Team",
      type: "onboarding",
      stage: "hired",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
      requiresConfirmation: false,
      confirmationDeadline: undefined,
      autoRejectOnOverdue: false,
    },

    // Legacy templates for backward compatibility
    {
      id: 13,
      name: "Application Confirmation",
      subject: "Application Submitted Successfully - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nYour application for the {{job_title}} position has been successfully submitted to {{company_name}}.\n\nApplication Details:\n- Position: {{job_title}}\n- Department: {{position_department}}\n- Submitted: {{application_date}}\n\nOur recruiting team will review your application and contact you if your qualifications match our requirements.\n\nThank you for your interest in joining our team!\n\nBest regards,\n{{company_name}} HR Team",
      type: "confirmation",
      stage: "applied",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{position_department}}",
        "{{application_date}}",
      ],
      requiresConfirmation: false,
      confirmationDeadline: 5,
      autoRejectOnOverdue: false,
    },
    {
      id: 14,
      name: "Screening Invitation",
      subject: "Next Steps - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nWe are pleased to inform you that your application for the {{job_title}} position has passed our initial review. We would like to invite you for a screening call.\n\nOur recruiter {{interviewer_name}} will be conducting this call to discuss your background, experience, and interest in the role.\n\nPlease reply with your availability for the next week, and we'll schedule a convenient time.\n\nBest regards,\n{{company_name}} Team",
      type: "screening",
      stage: "screening",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
      ],
      requiresConfirmation: false,
      confirmationDeadline: 5,
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
