export interface NarrativeObject {
  incidentId: string;
  executiveSummary: string; // BLUF (Bottom Line Up Front)
  technicalSummary: string; // Chronological technical breakdown
  defenderThinking: string; // Why the SOC cared about this
  recommendations: string[];// Auto-generated from Playbooks
  lessonsLearned: string;
}

export interface StructuredNarrative extends NarrativeObject {
  observedActivity: string;
  investigationNotes: string;
  evidenceList: string[];
  riskAssessment: string;
  riskNarrative?: string;
  recommendedActions: {
    immediate: string[];
    investigation: string[];
    containment: string[];
    recovery: string[];
    improvement: string[];
  };
}
export type EducationalLevel = 'student' | 'analyst' | 'responder' | 'Student' | 'Analyst' | 'Responder';
