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
  additionalData?: Partial<EmailData>,
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
      const placeholder = `{{${key.replace(/([A-Z])/g, "_$1").toLowerCase()}}}`;
      subject = subject.replace(new RegExp(placeholder, "g"), value);
      content = content.replace(new RegExp(placeholder, "g"), value);
    }
  });

  // Handle additional common variables
  const commonReplacements = {
    "{{position_department}}": candidate.department || "Engineering",
    "{{duration}}": candidate.duration || "5",
    "{{recruiter_name}}": candidate.recruiter || "HR Team",
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
    // Applied Stage Templates
    {
      id: 1,
      name: "Application Received",
      subject: "Thank you for your application - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for applying to the {{job_title}} position at {{company_name}}. We have received your application and will review it shortly.\n\nWe will contact you within the next 5-7 business days to update you on the status of your application.\n\nIf you have any questions in the meantime, please don't hesitate to reach out.\n\nBest regards,\n{{company_name}} Recruitment Team",
      type: "auto-response",
      stage: "applied",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
    },
    {
      id: 2,
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
    },

    // Screening Stage Templates
    {
      id: 3,
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
    },
    {
      id: 4,
      name: "Phone Screening Scheduled",
      subject: "Phone Screening Confirmed - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nYour phone screening for the {{job_title}} position has been scheduled.\n\nScreening Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Duration: 30 minutes\n- Interviewer: {{interviewer_name}}\n\nWe'll call you at the number you provided. Please ensure you're available and in a quiet environment.\n\nLooking forward to speaking with you!\n\nBest regards,\n{{company_name}} Recruitment Team",
      type: "confirmation",
      stage: "screening",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{interview_time}}",
      ],
    },

    // Interview Stage Templates
    {
      id: 5,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nWe are impressed with your qualifications and would like to invite you for an interview for the {{job_title}} position.\n\nInterview Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Interviewer: {{interviewer_name}}\n- Location: {{company_name}} Headquarters\n\nPlease confirm your attendance by replying to this email. If you need to reschedule, please let us know as soon as possible.\n\nWe look forward to meeting you!\n\nBest regards,\n{{company_name}} Team",
      type: "interview",
      stage: "interview",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{interview_time}}",
      ],
    },
    {
      id: 6,
      name: "Interview Reminder",
      subject: "Reminder: Interview Tomorrow - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThis is a friendly reminder about your interview scheduled for tomorrow at {{interview_time}} for the {{job_title}} position.\n\nInterview Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Interviewer: {{interviewer_name}}\n- Location: {{company_name}} Headquarters\n\nPlease arrive 10 minutes early and bring a copy of your resume. If you have any questions or need directions, please don't hesitate to contact us.\n\nBest regards,\n{{company_name}} Team",
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
    },
    {
      id: 7,
      name: "Follow-up after Interview",
      subject: "Thank you for interviewing - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for taking the time to interview for the {{job_title}} position at {{company_name}}. We enjoyed learning more about your background and experience.\n\nWe were impressed by your knowledge and enthusiasm for the role. We will be in touch within the next few days with an update on next steps.\n\nIf you have any additional questions, please feel free to reach out.\n\nBest regards,\n{{company_name}} Team",
      type: "follow-up",
      stage: "interview",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
    },

    // Technical Stage Templates
    {
      id: 8,
      name: "Technical Assessment Invitation",
      subject: "Technical Assessment - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nCongratulations on progressing to the technical assessment stage for the {{job_title}} position at {{company_name}}!\n\nTechnical Assessment Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Duration: 2 hours\n- Format: Coding challenge and system design discussion\n- Interviewer: {{interviewer_name}}\n\nPlease bring your laptop and be prepared to code in your preferred programming language. We'll provide all necessary development tools.\n\nIf you have any questions about the assessment format, please let us know.\n\nBest regards,\n{{company_name}} Technical Team",
      type: "technical",
      stage: "technical",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{interview_time}}",
      ],
    },
    {
      id: 9,
      name: "Technical Round Scheduled",
      subject: "Technical Interview Confirmed - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nYour technical interview for the {{job_title}} position has been scheduled.\n\nTechnical Interview Details:\n- Date: {{interview_date}}\n- Time: {{interview_time}}\n- Duration: 90 minutes\n- Interviewer: {{interviewer_name}} (Senior Engineer)\n- Format: Live coding and technical discussion\n\nTopics covered will include:\n- Problem-solving and algorithms\n- System design concepts\n- Best practices and code quality\n- Technical questions related to {{job_title}}\n\nPlease confirm your attendance. Good luck!\n\nBest regards,\n{{company_name}} Engineering Team",
      type: "confirmation",
      stage: "technical",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
        "{{interview_time}}",
      ],
    },
    {
      id: 10,
      name: "Technical Assessment Results",
      subject: "Technical Assessment Follow-up - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for completing the technical assessment for the {{job_title}} position at {{company_name}}.\n\nWe were impressed with your technical skills and problem-solving approach during the assessment. Our technical team will review your performance and we'll get back to you within 2-3 business days with the next steps.\n\nIf you have any questions about the assessment or the role, please don't hesitate to reach out.\n\nBest regards,\n{{company_name}} Technical Team",
      type: "follow-up",
      stage: "technical",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
    },

    // Offer Stage Templates
    {
      id: 11,
      name: "Job Offer",
      subject: "Job Offer - {{job_title}} at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}!\n\nOffer Details:\n- Position: {{job_title}}\n- Department: {{position_department}}\n- Salary: {{salary_range}}\n- Start Date: Flexible, based on your availability\n\nPlease review the attached offer letter for complete details including benefits, vacation policy, and other terms.\n\nWe would like to hear your decision within 5 business days. If you have any questions or would like to discuss the offer, please don't hesitate to contact us.\n\nWe look forward to welcoming you to our team!\n\nBest regards,\n{{company_name}} HR Team",
      type: "offer",
      stage: "offer",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{salary_range}}",
        "{{position_department}}",
      ],
    },
    {
      id: 12,
      name: "Offer Letter Follow-up",
      subject: "Following up on your job offer - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nI hope this email finds you well. I wanted to follow up on the job offer we extended for the {{job_title}} position at {{company_name}}.\n\nWe're excited about the possibility of you joining our team and would love to answer any questions you might have about the role, the company, or the offer details.\n\nPlease let us know if you need any additional information to help with your decision. We're here to support you through this process.\n\nLooking forward to hearing from you soon!\n\nBest regards,\n{{company_name}} HR Team",
      type: "follow-up",
      stage: "offer",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
    },

    // Hired Stage Templates
    {
      id: 13,
      name: "Welcome to the Team",
      subject: "Welcome to {{company_name}} - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nWelcome to {{company_name}}! We are thrilled to have you join our team as {{job_title}}.\n\nYour first day is scheduled for {{interview_date}}. Here's what you can expect:\n\n- 9:00 AM: Arrival and welcome\n- 9:30 AM: HR orientation and paperwork\n- 11:00 AM: IT setup and access\n- 1:00 PM: Team lunch\n- 2:00 PM: Department introduction\n- 4:00 PM: First team meeting\n\nPlease bring:\n- Valid ID for I-9 verification\n- Banking information for direct deposit\n- Emergency contact information\n\nYour manager {{interviewer_name}} will be your primary point of contact and will help you get settled in.\n\nWe're excited to see the great things you'll accomplish with us!\n\nBest regards,\n{{company_name}} HR Team",
      type: "welcome",
      stage: "hired",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
      ],
    },
    {
      id: 14,
      name: "Onboarding Instructions",
      subject: "Onboarding Instructions - First Day at {{company_name}}",
      content:
        "Dear {{candidate_name}},\n\nWe're just a few days away from your start date as {{job_title}} at {{company_name}}! Here are some important details for your first day:\n\nFirst Day Details:\n- Date: {{interview_date}}\n- Time: 9:00 AM\n- Location: {{company_name}} Main Office\n- Contact: {{interviewer_name}} (your manager)\n\nWhat to expect:\n- Welcome orientation session\n- IT equipment setup\n- Benefits enrollment\n- Team introductions\n- Initial training schedule\n\nDress code: Business casual\n\nIf you have any questions before your start date, please don't hesitate to reach out.\n\nSee you soon!\n\nBest regards,\n{{company_name}} HR Team",
      type: "onboarding",
      stage: "hired",
      variables: [
        "{{candidate_name}}",
        "{{job_title}}",
        "{{company_name}}",
        "{{interviewer_name}}",
        "{{interview_date}}",
      ],
    },

    // Rejected Stage Templates
    {
      id: 15,
      name: "Application Not Selected",
      subject: "Update on your application - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position at {{company_name}} and for the time you invested in our interview process.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs for this specific role.\n\nThis decision was not easy, as we were impressed by your background and experience. We encourage you to apply for future opportunities that match your skills and experience.\n\nWe will keep your resume on file and will reach out if a suitable position becomes available.\n\nThank you again for your interest in {{company_name}}.\n\nBest regards,\n{{company_name}} Recruitment Team",
      type: "rejection",
      stage: "rejected",
      variables: ["{{candidate_name}}", "{{job_title}}", "{{company_name}}"],
    },
    {
      id: 16,
      name: "Thank You and Future Opportunities",
      subject: "Thank you for your application - {{job_title}}",
      content:
        "Dear {{candidate_name}},\n\nThank you for taking the time to apply for the {{job_title}} position at {{company_name}}. We appreciate your interest in our company and the effort you put into your application.\n\nWhile we've decided to pursue other candidates for this particular role, we were impressed by your qualifications and would like to keep in touch for future opportunities.\n\nWe have added your profile to our talent pool and will notify you of relevant openings that match your skills and experience.\n\nWe wish you the best in your career search and hope to have the opportunity to work together in the future.\n\nBest regards,\n{{company_name}} Talent Acquisition Team",
      type: "future-opportunity",
      stage: "rejected",
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
