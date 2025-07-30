import * as React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function HelpTooltip({ 
  content, 
  className, 
  side = "right", 
  align = "center" 
}: HelpTooltipProps) {
  const [showContent, setShowContent] = React.useState(false);

  return (                      
    <div className="inline-block">
      <button
        type="button"
        onClick={() => setShowContent(!showContent)}
        className={cn( 
          "inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          className
        )}
        aria-label="Help"
      >
        <HelpCircle className="w-3 h-3" /> 
      </button>
      
      {showContent && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-sm">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900 leading-relaxed">{content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Predefined help content for common fields
export const helpContent = {
  emailAlias: "The email address that will receive applications for this job (e.g., jobs@company.com)",
  employmentType: "The type of employment contract - Full-time (40hrs/week), Part-time (<40hrs/week), or Contract (fixed duration)",
  domain: "The industry or business domain this role operates in (e.g., Technology, Finance, Healthcare)",
  priority: "The urgency level for filling this position - High (urgent), Medium (normal), Low (can wait)",
  headcount: "The number of people you plan to hire for this position",
  budget: "The total amount allocated for recruiting this position including job boards, agencies, and other costs",
  estimatedBudget: "Your initial budget estimate for filling this position",
  actualBudget: "The actual amount spent so far on recruiting for this position",
  expectedOutcome: "What you hope to achieve with this expense (e.g., 'Attract 20 qualified candidates')",
  effectiveness: "How well this expense performed based on results (0-100%)",
  stage: "The current step in your recruitment process (Applied, Screening, Interview, etc.)",
  source: "Where this candidate found your job posting (LinkedIn, Indeed, Referral, etc.)",
  applicationDate: "The date when the candidate submitted their application",
  template: "Pre-written email content that you can customize and reuse for similar situations",
  draft: "An unsent email that's saved for later editing and sending",
  trigger: "An automated action that happens when certain conditions are met (e.g., send email when stage changes)",
  forwarding: "Sending a copy of an email conversation to another person",
  effortTime: "How long the candidate has been in their current recruitment stage",
  stageStatus: "The current state of the candidate: Progressing (green), Blocked (red), or In Review (gray)",
  pipelineSummary: "A quick overview showing how many candidates are in each stage of your recruitment process",
  performanceIndicator: "A score showing how well this job posting is performing based on applications, conversions, and time to hire",
};
