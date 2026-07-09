// =============================================
// ETD — Core Type Definitions
// =============================================

export type SeverityLevel = 'informational' | 'low' | 'medium' | 'high' | 'critical';
export type DefenseStage = 'detect' | 'triage' | 'investigate' | 'contain' | 'eradicate' | 'recover' | 'improve';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
import { StructuredNarrative } from './narrative';
import { RiskObject, RiskScoreDetails } from './risk';
import { CorrelationObject } from './correlation';
export * from './knowledge';
export type IncidentCategory =
  | 'Authentication'
  | 'ProcessExecution'
  | 'UserAccountChanges'
  | 'ServiceInstallation'
  | 'PrivilegeEscalation'
  | 'LateralMovement'
  | 'MalwareActivity'
  | 'PersistenceActivity'
  | 'DataExfiltration'
  | 'RansomwareActivity'
  | 'InsiderThreat';

export interface MitreMapping {
  tacticId: string;
  tacticName: string;
  techniqueId: string;
  techniqueName: string;
}

export interface SecurityEvent {
  id: string;               // UUID representing the specific occurrence
  eventId: string;          // e.g., "4624", "1", "DeviceProcessEvents"
  eventName: string;        // e.g., "Successful Logon", "Process Creation"
  category: IncidentCategory; // e.g., "Authentication", "ProcessExecution"
  timestamp: string;        // ISO-8601 string
  severity: SeverityLevel;  // informational | low | medium | high | critical
  source: string;           // Telemetry Source: "Windows Security", "Sysmon", "CrowdStrike"
  hostname: string;         // Asset where the event occurred
  user: string;             // Associated user account context
  sourceIp?: string;        // Optional network context
  description: string;      // Raw or parsed human-readable description
  mitreMapping: MitreMapping[]; // ATT&CK mapping context
  defenseChainMapping: Partial<Record<DefenseStage, string>>; // Text explaining stage relevance
  raw: Record<string, string | number | boolean>; // The original raw log payload
}

export interface DefenseChainObject {
  incidentId: string;
  currentStage: DefenseStage; // detect | triage | investigate | contain | eradicate | recover | improve
  stages: Record<DefenseStage, {
    status: 'pending' | 'active' | 'completed' | 'bypassed';
    enteredAt?: string;
    completedAt?: string;
    notes: string[];
  }>;
}

export interface IncidentObject {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: SeverityLevel;
  status: 'active' | 'investigating' | 'contained' | 'closed';
  timeline: {
    firstObserved: string;
    lastObserved: string;
    containmentTime?: string;
  };
  eventIds: string[];         // All underlying Security Events
  correlationIds: string[];   // Built correlation graphs
  recommendations: string[];  // Actionable next steps
  affectedAssets: string[];
  affectedUsers: string[];
  riskScore: number;          // Derived from Severity Engine
}

// Deprecated: Kept temporarily to prevent everything from completely breaking while refactoring
export interface Incident extends IncidentObject {
  priority: Priority;
  currentStage: DefenseStage;
  detectedAt: string;
  events: SecurityEvent[];
  sourceIp?: string;
  investigationComplexity: number;
  responseUrgency: number;
  detectionConfidence: number;
  containmentPriority: number;
  riskDetails?: RiskScoreDetails;
  narrative: StructuredNarrative;
}

export interface PlaybookStep {
  id: string;
  stage: DefenseStage;
  action: string;
  description: string;
  completed: boolean;
  priority: 'immediate' | 'standard' | 'followup';
}

export interface Playbook {
  id: string;
  name: string;
  incidentCategory: IncidentCategory;
  severity: SeverityLevel;
  overview: string;
  whyItMatters: string;
  detectionIndicators: string[];
  steps: PlaybookStep[];
  improvementRecommendations: string[];
  escalationPath: string;
}

export interface DefenseChainStageInfo {
  stage: DefenseStage;
  label: string;
  color: string;
  glowColor: string;
  borderColor: string;
  bgColor: string;
  description: string;
  icon: string;
}

export * from './correlation';
export * from './risk';
export * from './narrative';
export * from './visualizations';
export * from './report';