import { 
  SecurityEvent, 
  StructuredNarrative, 
  RiskScoreDetails, 
  EducationalLevel,
  Priority
} from '../types';

/**
 * ============================================================================
 * ENGINE: NarrativeEngine
 * 
 * CORE RESPONSIBILITY:
 * The NarrativeEngine acts as the translation layer between raw telemetry 
 * (Security Events, Logs) and human-readable, educational incident reports. 
 * It dynamically adjusts its output tone based on the user's `EducationalLevel` 
 * (Student, Analyst, Responder).
 * 
 * ARCHITECTURE CONTEXT:
 * Called extensively by the Incident Report Generator and the Investigation 
 * Workbench to produce the "ETD Defender Narrative".
 * ============================================================================
 */
export class NarrativeEngine {
  private level: EducationalLevel = 'Analyst';

  public setEducationalLevel(level: EducationalLevel) {
    this.level = level;
  }

  /**
   * Generates a fully structured defender narrative based on the events, correlation scenario, and risk score.
   * This is the primary entry point for assembling an Incident Report's textual content.
   * 
   * @param events - Array of raw SecurityEvents that triggered the incident
   * @param scenarioName - The high-level name of the attack (e.g., "Pass-the-Hash")
   * @param baseNarrative - The default technical description of what happened
   * @param riskDetails - Object containing the calculated risk score and derived priority
   * @param affectedAssets - List of hostnames compromised
   * @param affectedUsers - List of user accounts compromised
   * @param sourceIps - List of attacker IPs
   * @returns A `StructuredNarrative` object containing all required fields for the Incident Report UI
   */
  public generate(
    events: SecurityEvent[],
    scenarioName: string,
    baseNarrative: string,
    riskDetails: RiskScoreDetails,
    affectedAssets: string[],
    affectedUsers: string[],
    sourceIps: string[]
  ): StructuredNarrative {
    
    // 1. Executive Summary
    const executiveSummary = this.generateExecutiveSummary(scenarioName, riskDetails.calculatedPriority, affectedAssets.length);

    // 2. Observed Activity (Educational context applied here)
    const observedActivity = NarrativeEngine.getEducationalNarrative(this.level, baseNarrative, scenarioName);

    // 3. Evidence List
    const evidenceList = events.map(e => `[${new Date(e.timestamp).toLocaleTimeString()}] ${e.eventId} on ${e.hostname} by ${e.user} ${e.sourceIp ? `(IP: ${e.sourceIp})` : ''}`);

    // 4. Investigation Notes
    const investigationNotes = `Analyst Note: ${events.length} correlated events match the ${scenarioName} pattern. Primary targets identified as ${affectedAssets.join(', ')}.`;

    // 5. Risk Assessment
    const riskAssessment = riskDetails.riskNarrative || 'No risk narrative available.';

    // 6. Recommended Actions
    const recommendedActions = this.generateRecommendations(scenarioName, riskDetails.calculatedPriority, affectedAssets, affectedUsers);

    // 7. Lessons Learned
    const lessonsLearned = this.generateLessonsLearned(scenarioName);

    return {
      incidentId: 'INC-TBD',
      executiveSummary,
      technicalSummary: baseNarrative,
      defenderThinking: 'Pending analyst review.',
      recommendations: [...recommendedActions.immediate, ...recommendedActions.containment],
      observedActivity,
      evidenceList,
      investigationNotes,
      riskAssessment,
      recommendedActions,
      lessonsLearned
    };
  }

  private generateExecutiveSummary(scenario: string, priority: Priority, assetCount: number): string {
    if (priority === 'P1') {
      return `CRITICAL: Confirmed ${scenario} attack in progress affecting ${assetCount} asset(s). Immediate containment required.`;
    }
    if (priority === 'P2') {
      return `HIGH: High-confidence indicator of ${scenario} detected. Tier 2 investigation required.`;
    }
    if (priority === 'P3') {
      return `MEDIUM: Suspicious activity matching ${scenario} observed. Manual triage needed to confirm intent.`;
    }
    return `LOW: Anomalous activity detected (${scenario}). Likely benign, suppressed for correlation.`;
  }

  /**
   * Adjusts the tone of a base narrative string depending on the active educational level.
   * - Student: Uses analogies (e.g., "burglar trying to break in")
   * - Analyst: Uses standard technical SOC terminology
   * - Responder: Uses Bottom Line Up Front (BLUF) formatting for rapid consumption
   */
  public static getEducationalNarrative(level: EducationalLevel, base: string, scenario: string): string {
    if (level === 'Student') {
      return `[STUDENT MODE] In cybersecurity, ${scenario} is like a burglar trying to break in. The logs show us exactly what the "burglar" did: ${base}`;
    }
    if (level === 'Responder') {
      return `[RESPONDER MODE] BLUF: ${scenario} sequence verified. Timeline follows: ${base}`;
    }
    return base; // Analyst mode defaults to the standard technical narrative
  }

  private generateRecommendations(scenario: string, priority: Priority, assets: string[], users: string[]) {
    const isCritical = priority === 'P1' || priority === 'P2';
    
    return {
      immediate: isCritical ? 
        [`Verify if ${users.join(', ')} authorized this activity.`, `Check EDR telemetry on ${assets.join(', ')} for payload execution.`] : 
        ['Review event logs to determine false positive status.'],
      investigation: [
        `Query SIEM for all activity from ${users.join(', ')} in the last 48 hours.`,
        `Review network connections originating from ${assets.join(', ')}.`
      ],
      containment: isCritical ? [
        `Isolate ${assets.join(', ')} from the domain network.`,
        `Force password reset and revoke active sessions for ${users.join(', ')}.`
      ] : ['No immediate containment required during triage phase.'],
      recovery: [
        'Restore affected systems from last known good backup if payload executed.',
        'Re-image compromised workstations.'
      ],
      improvement: [
        `Implement strict conditional access policies for ${scenario} vectors.`,
        'Ensure proper EDR coverage on all endpoints.'
      ]
    };
  }

  private generateLessonsLearned(scenario: string): string {
    if (scenario.toLowerCase().includes('credential')) {
      return 'Enforce Multi-Factor Authentication (MFA) on all external-facing portals and disable legacy authentication protocols.';
    }
    if (scenario.toLowerCase().includes('lateral')) {
      return 'Implement Network Segmentation and restrict SMB/RDP access between workstation subnets.';
    }
    return 'Regularly review security baseline configurations and ensure least-privilege access models are enforced.';
  }
}
