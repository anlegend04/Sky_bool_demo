// Helper functions for CV Evaluation data
import { HARDCODED_CANDIDATES, CVEvaluationData } from "./hardcoded-data";

// Get CV evaluations for a specific candidate
export const getCandidateCVEvaluations = (
  candidateId: string,
): CVEvaluationData[] => {
  const candidate = HARDCODED_CANDIDATES.find((c) => c.id === candidateId);
  return candidate?.cvEvaluations || [];
};

// Get a specific CV evaluation by ID
export const getCVEvaluation = (
  evaluationId: string,
): CVEvaluationData | null => {
  for (const candidate of HARDCODED_CANDIDATES) {
    if (candidate.cvEvaluations) {
      const evaluation = candidate.cvEvaluations.find(
        (e) => e.id === evaluationId,
      );
      if (evaluation) return evaluation;
    }
  }
  return null;
};

// Get all CV evaluations for a job
export const getJobCVEvaluations = (jobId: string): CVEvaluationData[] => {
  const evaluations: CVEvaluationData[] = [];
  for (const candidate of HARDCODED_CANDIDATES) {
    if (candidate.cvEvaluations) {
      evaluations.push(
        ...candidate.cvEvaluations.filter((e) => e.jobId === jobId),
      );
    }
  }
  return evaluations;
};

// Get recent CV evaluations (last 30 days)
export const getRecentCVEvaluations = (): CVEvaluationData[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const evaluations: CVEvaluationData[] = [];
  for (const candidate of HARDCODED_CANDIDATES) {
    if (candidate.cvEvaluations) {
      evaluations.push(
        ...candidate.cvEvaluations.filter(
          (e) => new Date(e.savedAt) >= thirtyDaysAgo,
        ),
      );
    }
  }

  return evaluations.sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
};

// Get CV evaluations by verdict
export const getCVEvaluationsByVerdict = (
  verdict: "Good Fit" | "Needs Improvement" | "Not Suitable",
): CVEvaluationData[] => {
  const evaluations: CVEvaluationData[] = [];
  for (const candidate of HARDCODED_CANDIDATES) {
    if (candidate.cvEvaluations) {
      evaluations.push(
        ...candidate.cvEvaluations.filter((e) => e.finalVerdict === verdict),
      );
    }
  }
  return evaluations;
};

// Get shared CV evaluations
export const getSharedCVEvaluations = (): CVEvaluationData[] => {
  const evaluations: CVEvaluationData[] = [];
  for (const candidate of HARDCODED_CANDIDATES) {
    if (candidate.cvEvaluations) {
      evaluations.push(...candidate.cvEvaluations.filter((e) => e.isShared));
    }
  }
  return evaluations;
};

// Search CV evaluations by candidate name or job title
export const searchCVEvaluations = (searchTerm: string): CVEvaluationData[] => {
  const term = searchTerm.toLowerCase();
  const evaluations: CVEvaluationData[] = [];

  for (const candidate of HARDCODED_CANDIDATES) {
    if (candidate.cvEvaluations) {
      for (const evaluation of candidate.cvEvaluations) {
        if (
          evaluation.extractedData.name.toLowerCase().includes(term) ||
          candidate.position.toLowerCase().includes(term) ||
          evaluation.summary.toLowerCase().includes(term)
        ) {
          evaluations.push(evaluation);
        }
      }
    }
  }

  return evaluations;
};
