import { SeverityLevel, DefenseStage } from './index';

export interface KnowledgeMetadata {
  version: string;
  lastUpdated: string;
  author: string;
  status: 'active' | 'deprecated' | 'draft';
}

export interface MitreMapping {
  tacticId: string;
  tacticName: string;
  techniqueId: string;
  techniqueName: string;
}

export interface DetectionObject {
  id: string; // e.g., DET-WIN-4625
  metadata: KnowledgeMetadata;
  telemetrySource: string; // e.g., 'Windows Security Log'
  signatureId: string; // e.g., '4625'
  name: string;
  defenderInterest: string;
  baseSeverity: SeverityLevel;
  mitreMappings: MitreMapping[];
  defenseChainMapping: Partial<Record<DefenseStage, string>>;
  investigationIds: string[]; // Links to InvestigationObjects
  responseIds: string[]; // Links to ResponseObjects
}

export interface InvestigationObject {
  id: string; // e.g., INV-Q-001
  metadata: KnowledgeMetadata;
  question: string;
  hint?: string;
  evidenceSources: string[];
  validationSteps: string[];
  falsePositiveGuidance: string;
  isEscalationTrigger: boolean;
}

export interface ResponseObject {
  id: string; // e.g., RES-ISO-01
  metadata: KnowledgeMetadata;
  phase: 'contain' | 'eradicate' | 'recover' | 'improve';
  action: string;
  technicalProcedure: string;
  impactLevel: 'low' | 'medium' | 'high' | 'severe';
}

export interface ThreatObject {
  id: string; // e.g., THR-APT-29
  metadata: KnowledgeMetadata;
  name: string;
  category: 'APT' | 'Ransomware' | 'Insider' | 'Commodity' | 'Broker';
  objectives: string[];
  description: string;
  commonlyUsedMitreTechniques: string[]; // e.g., ['T1059.001', 'T1078']
}

export interface PlaybookObject {
  id: string; // e.g., PB-RANSOM-01
  metadata: KnowledgeMetadata;
  name: string;
  description: string;
  triggerConditions: string[];
  investigationFlowIds: string[]; // Ordered list of INV IDs
  responseFlowIds: string[]; // Ordered list of RES IDs
}
