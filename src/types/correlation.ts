import { IncidentCategory, SeverityLevel, Priority, SecurityEvent } from './index';

export interface CorrelationObject {
  id: string;
  type: 'temporal' | 'spatial' | 'behavioral' | 'identity';
  confidence: number;       // 0-100% confidence of true relation
  scenario: string;         // e.g., "Lateral Movement via Pass-the-Hash"
  narrative: string;        // Auto-generated human-readable correlation reasoning
  primaryEventId: string;   // The anchor event
  relatedEventIds: string[];// Associated events
  sharedEntities: {         // What links them?
    users?: string[];
    hosts?: string[];
    ips?: string[];
    processes?: string[];
  };
}

export interface CorrelationResult {
  matched: boolean;
  confidence: number;
  confidenceScore: 'Low' | 'Medium' | 'High' | 'Very High';
  involvedEvents: SecurityEvent[];
  narrative: string;
}

export interface CorrelationScenario {
  id: string;
  name: string;
  category: IncidentCategory;
  baseSeverity: SeverityLevel;
  basePriority: Priority;
  match: (events: SecurityEvent[]) => CorrelationResult;
}
