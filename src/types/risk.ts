import { SeverityLevel, Priority } from './index';

export interface RiskObject {
  incidentId?: string;
  baseSeverity: SeverityLevel; // Inherent severity from the initial event
  calculatedPriority: Priority; // P1 | P2 | P3 | P4
  confidenceScore: number;      // 0-100% (How sure are we this is malicious?)
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  urgency: number;              // Time-sensitivity multiplier
  factors: {               // Used for RiskRadar Visualization
    eventCriticality: number;
    assetCriticality: number;
    userPrivilege: number;
    confidence: number;
    exposure: number;
  };
}

export type AssetCriticality = 'CrownJewel' | 'PublicFacing' | 'AdminSystem' | 'Server' | 'Standard';
export type UserPrivilege = 'Administrator' | 'ServiceAccount' | 'DomainAdmin' | 'Standard' | 'Privileged';

export interface RiskScoreDetails extends RiskObject {
  score: number;
  calculatedSeverity: SeverityLevel;
  riskNarrative?: string;
}
