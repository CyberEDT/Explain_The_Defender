import { 
  SecurityEvent, 
  RiskScoreDetails, 
  SeverityLevel, 
  Priority, 
  AssetCriticality, 
  UserPrivilege 
} from '../types';
import { 
  ASSET_MULTIPLIERS, 
  USER_RISK_ADDER, 
  EVENT_BASE_RISK, 
  inferAssetCriticality, 
  inferUserPrivilege 
} from '../knowledge-base/riskContext';

export class RiskEngine {
  
  /**
   * Assess a collection of correlated events to generate a unified risk score.
   */
  public assessIncident(
    events: SecurityEvent[],
    correlationConfidence: number, // 0-100
    baseScenarioSeverity: SeverityLevel
  ): RiskScoreDetails {
    if (!events || events.length === 0) {
      return {
        score: 0,
        calculatedSeverity: 'informational',
        calculatedPriority: 'P4',
        riskNarrative: 'No events provided for risk assessment.',
        baseSeverity: baseScenarioSeverity,
        confidenceScore: 0,
        businessImpact: 'low',
        urgency: 0,
        factors: {
          eventCriticality: 0,
          assetCriticality: 0,
          userPrivilege: 0,
          confidence: 0,
          exposure: 0,
        }
      };
    }

    // 1. Base Event Criticality (Highest in chain)
    const baseScores = events.map(e => EVENT_BASE_RISK[e.eventId] || 10);
    const maxBaseEventScore = Math.max(...baseScores);

    // 2. Identify highest risk asset involved
    const assetTypes = events.map(e => inferAssetCriticality(e.hostname));
    const assetMultipliers = assetTypes.map(type => ASSET_MULTIPLIERS[type]);
    const maxAssetMultiplier = Math.max(...assetMultipliers);
    const topAssetType = assetTypes[assetMultipliers.indexOf(maxAssetMultiplier)];

    // 3. Identify highest privileged user involved
    const userTypes = events.map(e => inferUserPrivilege(e.user));
    const userAdders = userTypes.map(type => USER_RISK_ADDER[type]);
    const maxUserAdder = Math.max(...userAdders);
    const topUserType = userTypes[userAdders.indexOf(maxUserAdder)];

    // 4. Chain Length Multiplier (Attack Progression)
    let chainMultiplier = 1.0;
    if (events.length === 2) chainMultiplier = 1.2;
    if (events.length === 3) chainMultiplier = 1.5;
    if (events.length >= 4) chainMultiplier = 2.0;

    // 5. Correlation Confidence Multiplier
    const confidenceMultiplier = (correlationConfidence / 100) + 0.5; // Scale to 0.5 - 1.5

    // --- Core Calculation ---
    // (Base Event + User Adder) * Asset Multiplier * Chain Multiplier * Confidence
    let rawScore = (maxBaseEventScore + maxUserAdder) * maxAssetMultiplier * chainMultiplier * confidenceMultiplier;
    
    // Normalize to 0-100
    const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Derive Severity & Priority from the numerical score
    const calculatedSeverity = this.deriveSeverity(finalScore, baseScenarioSeverity);
    const calculatedPriority = this.derivePriority(finalScore);

    // Generate Contextual Narrative
    const riskNarrative = this.generateRiskNarrative({
      score: finalScore,
      priority: calculatedPriority,
      topAssetType,
      topUserType,
      eventCount: events.length
    });

    return {
      score: finalScore,
      calculatedSeverity,
      calculatedPriority,
      riskNarrative,
      baseSeverity: baseScenarioSeverity,
      confidenceScore: correlationConfidence,
      businessImpact: topAssetType === 'CrownJewel' ? 'critical' : topAssetType === 'Server' || topAssetType === 'AdminSystem' ? 'high' : 'medium',
      urgency: calculatedPriority === 'P1' ? 10 : calculatedPriority === 'P2' ? 7 : 4,
      factors: {
        eventCriticality: maxBaseEventScore / 10, // Normalize to 1-10
        assetCriticality: maxAssetMultiplier, // Usually 1.0 - 2.0
        userPrivilege: maxUserAdder, // Usually 0 - 20
        confidence: correlationConfidence, // 0-100
        exposure: chainMultiplier, // Usually 1.0 - 2.0
      }
    };
  }

  private deriveSeverity(score: number, baseFallback: SeverityLevel): SeverityLevel {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    if (score > 0) return 'informational';
    return baseFallback;
  }

  private derivePriority(score: number): Priority {
    if (score >= 90) return 'P1';
    if (score >= 70) return 'P2';
    if (score >= 40) return 'P3';
    return 'P4';
  }

  private generateRiskNarrative(ctx: {
    score: number;
    priority: Priority;
    topAssetType: AssetCriticality;
    topUserType: UserPrivilege;
    eventCount: number;
  }): string {
    const priorityText = ctx.priority === 'P1' ? 'IMMEDIATE ACTION REQUIRED (P1)' :
                         ctx.priority === 'P2' ? 'HIGH Priority (P2)' :
                         ctx.priority === 'P3' ? 'MEDIUM Priority (P3)' : 'LOW Priority (P4)';

    let narrative = `This incident is classified as ${priorityText} with a calculated Risk Score of ${ctx.score}/100. `;

    const userCtx = ctx.topUserType !== 'Standard' ? `a highly privileged account (${ctx.topUserType})` : `a standard user account`;
    const assetCtx = ctx.topAssetType === 'CrownJewel' ? `a Tier-0/Crown Jewel asset` :
                     ctx.topAssetType === 'PublicFacing' ? `a publicly exposed asset` :
                     ctx.topAssetType === 'AdminSystem' ? `an administrative system` :
                     ctx.topAssetType === 'Server' ? `a server infrastructure asset` : `a standard workstation`;

    narrative += `The activity involves ${userCtx} targeting ${assetCtx}. `;

    if (ctx.eventCount > 1) {
      narrative += `The sequence of ${ctx.eventCount} correlated events represents a severe progression in the attack chain, drastically increasing the confidence and blast radius of the threat. `;
    }

    if (ctx.score >= 90) {
      narrative += `Immediate containment of the involved host and user account is strongly advised to prevent catastrophic damage.`;
    } else if (ctx.score >= 70) {
      narrative += `Manual investigation by a Tier 2 analyst should commence immediately to determine scope and intent.`;
    } else {
      narrative += `Standard triage procedures apply. Review the event chain to confirm benign intent.`;
    }

    return narrative;
  }
}
