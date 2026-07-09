import { IncidentObject, DefenseChainObject, CorrelationObject } from './index';
import { RiskObject } from './risk';
import { NarrativeObject } from './narrative';
import { ChartRiskRadar, ChartTimeline } from './visualizations';

export interface ReportObject {
  reportId: string;
  generatedAt: string;
  targetAudience: 'student' | 'analyst' | 'responder';
  incident: IncidentObject;
  defenseChain: DefenseChainObject;
  risk: RiskObject;
  narrative: NarrativeObject;
  correlations: CorrelationObject[];
  visualizations: {
    riskRadarData: ChartRiskRadar;
    timelineData: ChartTimeline;
  };
}
