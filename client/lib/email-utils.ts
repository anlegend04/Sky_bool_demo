import { CandidateData } from "@/data/hardcoded-data";

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: string;
  stage?: string;
  variables: string[];
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
  [key: string]: string | undefined;
}

export function generateEmailContent(
  template: EmailTemplate,
  candidate: CandidateData,
  additionalData?: Partial<EmailData>
): { subject: string; content: string } {
  const defaultData: EmailData = {
    candidateName: candidate.name,
    jobTitle: candidate.position || "the position",
    companyName: "TechCorp Inc.",
    stage: candidate.stage || "application",
    interviewerName: "Sarah Johnson",
    interviewDate: "March 15, 2024",
    interviewTime: "2:00 PM EST",
    salaryRange: "$80,000 - $120,000",
    applicationDate: new Date().toLocaleDateString(),
    ...additionalData,
  };

  let subject = template.subject;
  let content = template.content;

  // Replace all placeholders
  Object.entries(defaultData).forEach(([key, value]) => {
    if (value) {
      const placeholder = `{{${key.replace(/([A-Z])/g, '_$1').toLowerCase()}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      content = content.replace(new RegExp(placeholder, 'g'), value);
    }
  });

  // Handle additional common variables
  const commonReplacements = {
    '{{position_department}}': candidate.department || 'Engineering',
    '{{duration}}': candidate.duration || '5',
    '{{recruiter_name}}': candidate.recruiter || 'HR Team',
  };

  Object.entries(commonReplacements).forEach(([placeholder, value]) => {
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });

  return { subject, content };
}

export function getTemplatesForStage(stage: string): EmailTemplate[] {
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
      content: "Dear {{candidate_name}},\n\nWe are pleased to inform you that your application for the {{job_title}} position has passed our initial review. We would like to invite you for a screening call.\n\nOur recruiter {{interviewer_name}} will be conducting this call. Please reply with your availability for the next week.\n\nBest regards,\n{{company_name}} Team",
      type: "screening",
      stage: "screening",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interviewer_name}}"],
    },
    {
      id: 3,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}} at {{company_name}}",
      content: "Dear {{candidate_name}},\n\nWe are impressed with your qualifications and would like to invite you for an interview for the {{job_title}} position.\n\nInterview Details:\nDate: {{interview_date}}\nTime: {{interview_time}}\nInterviewer: {{interviewer_name}}\n\nPlease confirm your attendance by replying to this email.\n\nBest regards,\n{{company_name}} Team",
      type: "interview",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interviewer_name}}", "{{interview_date}}", "{{interview_time}}"],
    },
    {
      id: 4,
      name: "Job Offer",
      subject: "Job Offer - {{job_title}} at {{company_name}}",
      content: "Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}.\n\nSalary: {{salary_range}}\n\nPlease review the attached offer letter and let us know your decision within 5 business days.\n\nWe look forward to welcoming you to our team!\n\nBest regards,\n{{company_name}} HR Team",
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

  return emailTemplates.filter(template => template.stage === stage.toLowerCase());
}

export function getAllEmailTemplates(): EmailTemplate[] {
  return [
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
      content: "Dear {{candidate_name}},\n\nWe are pleased to inform you that your application for the {{job_title}} position has passed our initial review. We would like to invite you for a screening call.\n\nOur recruiter {{interviewer_name}} will be conducting this call. Please reply with your availability for the next week.\n\nBest regards,\n{{company_name}} Team",
      type: "screening",
      stage: "screening",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interviewer_name}}"],
    },
    {
      id: 3,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}} at {{company_name}}",
      content: "Dear {{candidate_name}},\n\nWe are impressed with your qualifications and would like to invite you for an interview for the {{job_title}} position.\n\nInterview Details:\nDate: {{interview_date}}\nTime: {{interview_time}}\nInterviewer: {{interviewer_name}}\n\nPlease confirm your attendance by replying to this email.\n\nBest regards,\n{{company_name}} Team",
      type: "interview",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interviewer_name}}", "{{interview_date}}", "{{interview_time}}"],
    },
    {
      id: 4,
      name: "Job Offer",
      subject: "Job Offer - {{job_title}} at {{company_name}}",
      content: "Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}.\n\nSalary: {{salary_range}}\n\nPlease review the attached offer letter and let us know your decision within 5 business days.\n\nWe look forward to welcoming you to our team!\n\nBest regards,\n{{company_name}} HR Team",
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
    {
      id: 6,
      name: "Interview Reminder",
      subject: "Reminder: Interview Tomorrow - {{job_title}}",
      content: "Dear {{candidate_name}},\n\nThis is a friendly reminder about your interview scheduled for tomorrow at {{interview_time}} for the {{job_title}} position.\n\nInterview Details:\nDate: {{interview_date}}\nTime: {{interview_time}}\nInterviewer: {{interviewer_name}}\n\nPlease let us know if you have any questions.\n\nBest regards,\n{{company_name}} Team",
      type: "reminder",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}", "{{interviewer_name}}", "{{interview_date}}", "{{interview_time}}"],
    },
    {
      id: 7,
      name: "Follow-up after Interview",
      subject: "Thank you for interviewing - {{job_title}}",
      content: "Dear {{candidate_name}},\n\nThank you for taking the time to interview for the {{job_title}} position at {{company_name}}. We enjoyed learning more about your background and experience.\n\nWe will be in touch within the next few days with an update on next steps.\n\nBest regards,\n{{company_name}} Team",
      type: "follow-up",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
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
];
