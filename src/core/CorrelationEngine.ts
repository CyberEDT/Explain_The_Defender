import type { SecurityEvent, Incident } from '../types';
import { correlationScenarios } from '../knowledge-base/scenarios/correlationScenarios';
import { RiskEngine } from './RiskEngine';
import { NarrativeEngine } from './NarrativeEngine';

export class CorrelationEngine {
  private events: SecurityEvent[] = [];
  private riskEngine = new RiskEngine();
  private narrativeEngine = new NarrativeEngine();

  constructor() {}

  /**
   * Ingest a raw event stream into the engine.
   */
  public ingest(eventStream: SecurityEvent[]) {
    this.events = eventStream;
  }

  /**
   * Analyze the ingested events against the ETD Scenario Library.
   * Returns an array of generated Incidents.
   */
  public analyze(): Incident[] {
    const incidents: Incident[] = [];

    // In a real engine, we'd group events by time windows, hosts, or users.
    // For this demonstration, we evaluate the entire ingested stream as one "session".

    for (const scenario of correlationScenarios) {
      const result = scenario.match(this.events);

      if (result.matched) {
        incidents.push(this.generateIncident(scenario, result));
      }
    }

    // If no specific scenario matched but we have high severity events,
    // fallback to a generic correlation.
    if (incidents.length === 0 && this.events.some(e => e.severity === 'high' || e.severity === 'critical')) {
      incidents.push(this.generateFallbackIncident());
    }

    return incidents;
  }

  /**
   * Translates a successful correlation match into a full ETD Incident.
   */
  private generateIncident(
    scenario: typeof correlationScenarios[0],
    result: ReturnType<typeof correlationScenarios[0]['match']>
  ): Incident {
    
    // Extract unique assets and users from involved events
    const affectedAssets = Array.from(new Set(result.involvedEvents.map(e => e.hostname)));
    const affectedUsers = Array.from(new Set(result.involvedEvents.map(e => e.user)));
    const sourceIps = Array.from(new Set(result.involvedEvents.map(e => e.sourceIp).filter((ip): ip is string => !!ip)));

    // Apply the Severity & Risk Intelligence Engine
    const riskAssessment = this.riskEngine.assessIncident(
      result.involvedEvents,
      result.confidence,
      scenario.baseSeverity
    );

    // Determine current stage based on the calculated priority
    let currentStage: Incident['currentStage'] = 'investigate';
    if (riskAssessment.calculatedPriority === 'P1') currentStage = 'contain';

    // Generate Structured Narrative
    const structuredNarrative = this.narrativeEngine.generate(
      result.involvedEvents,
      scenario.name,
      result.narrative,
      riskAssessment,
      affectedAssets,
      affectedUsers,
      sourceIps
    );

    return {
      id: `INC-ETD-${Math.floor(Math.random() * 9000) + 1000}`,
      title: scenario.name,
      category: scenario.category,
      severity: riskAssessment.calculatedSeverity,
      priority: riskAssessment.calculatedPriority,
      status: 'active',
      currentStage,
      detectedAt: new Date().toISOString(),
      timeline: {
        firstObserved: result.involvedEvents[0]?.timestamp || new Date().toISOString(),
        lastObserved: result.involvedEvents[result.involvedEvents.length - 1]?.timestamp || new Date().toISOString()
      },
      eventIds: result.involvedEvents.map(e => e.id),
      correlationIds: [],
      recommendations: structuredNarrative.recommendations || [],
      narrative: structuredNarrative,
      events: result.involvedEvents,
      affectedAssets,
      affectedUsers,
      sourceIp: sourceIps[0] || undefined,
      investigationComplexity: result.confidence > 80 ? 4 : 8,
      responseUrgency: riskAssessment.calculatedPriority === 'P1' ? 10 : 7,
      detectionConfidence: result.confidence,
      containmentPriority: riskAssessment.calculatedPriority === 'P1' ? 10 : 5,
      riskScore: riskAssessment.score,
      riskDetails: riskAssessment,
    };
  }

  /**
   * Fallback for events that are severe but don't match a multi-event chain.
   */
  private generateFallbackIncident(): Incident {
    const criticalEvents = this.events.filter(e => e.severity === 'critical' || e.severity === 'high');
    const primaryEvent = criticalEvents[0] || this.events[0];

    const riskAssessment = this.riskEngine.assessIncident(
      this.events,
      50, // lower confidence for generic fallbacks
      primaryEvent.severity
    );

    // Determine current stage based on the calculated priority
    let currentStage: Incident['currentStage'] = 'triage';
    if (riskAssessment.calculatedPriority === 'P1') currentStage = 'investigate';

    const affectedAssets = [primaryEvent.hostname];
    const affectedUsers = [primaryEvent.user];
    const sourceIps = primaryEvent.sourceIp ? [primaryEvent.sourceIp] : [];

    // Generate Structured Narrative
    const structuredNarrative = this.narrativeEngine.generate(
      this.events,
      `Anomalous Activity: ${primaryEvent.eventName}`,
      `An isolated high-severity event (${primaryEvent.eventId}) was detected on ${primaryEvent.hostname}. No known multi-stage attack chain was matched, but the event warrants manual triage by an analyst to determine intent.`,
      riskAssessment,
      affectedAssets,
      affectedUsers,
      sourceIps
    );

    return {
      id: `INC-ETD-${Math.floor(Math.random() * 9000) + 1000}`,
      title: `Anomalous Activity: ${primaryEvent.eventName}`,
      category: 'MalwareActivity', // Generic fallback
      severity: riskAssessment.calculatedSeverity,
      priority: riskAssessment.calculatedPriority,
      status: 'investigating',
      currentStage,
      detectedAt: primaryEvent.timestamp,
      timeline: {
        firstObserved: primaryEvent.timestamp,
        lastObserved: primaryEvent.timestamp
      },
      eventIds: this.events.map(e => e.id),
      correlationIds: [],
      recommendations: structuredNarrative.recommendations || [],
      narrative: structuredNarrative,
      events: this.events, // Attach all context
      affectedAssets,
      affectedUsers,
      sourceIp: primaryEvent.sourceIp,
      investigationComplexity: 6,
      responseUrgency: 5,
      detectionConfidence: 50,
      containmentPriority: 3,
      riskScore: riskAssessment.score,
      riskDetails: riskAssessment,
    };
  }
}
