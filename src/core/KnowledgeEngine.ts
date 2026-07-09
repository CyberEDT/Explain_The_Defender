import { DetectionObject, InvestigationObject, ResponseObject, ThreatObject } from '../types';
import { windowsEventKB } from '../knowledge-base/event-intel/windowsEvents';
import { investigationKB } from '../knowledge-base/investigation/questions';
import { responseKB } from '../knowledge-base/response/actions';
import { threatKB } from '../knowledge-base/threats/profiles';

// Pre-compute O(1) lookup maps
const detectionBySignatureMap = new Map<string, DetectionObject>();
const detectionByIdMap = new Map<string, DetectionObject>();
for (const det of windowsEventKB) {
  detectionBySignatureMap.set(det.signatureId, det);
  detectionByIdMap.set(det.id, det);
}

const investigationByIdMap = new Map<string, InvestigationObject>();
for (const inv of investigationKB) {
  investigationByIdMap.set(inv.id, inv);
}

const responseByIdMap = new Map<string, ResponseObject>();
for (const res of responseKB) {
  responseByIdMap.set(res.id, res);
}

// For threats, map Technique ID to an array of ThreatObjects
const threatsByTechniqueMap = new Map<string, ThreatObject[]>();
for (const thr of threatKB) {
  for (const tech of thr.commonlyUsedMitreTechniques) {
    if (!threatsByTechniqueMap.has(tech)) {
      threatsByTechniqueMap.set(tech, []);
    }
    threatsByTechniqueMap.get(tech)!.push(thr);
  }
}

/**
 * ============================================================================
 * ENGINE: KnowledgeEngine
 * 
 * CORE RESPONSIBILITY:
 * The KnowledgeEngine acts as the central query interface for the ETD 
 * static intelligence graph. It connects disparate objects (Detections, 
 * Investigations, Responses, and Threats) by traversing their relational IDs.
 * 
 * ARCHITECTURE CONTEXT:
 * This engine operates exclusively on the `src/knowledge-base/` data layer.
 * It is called by UI components (like InvestigationWorkbench) to enrich 
 * raw events with actionable cyber defense context.
 * ============================================================================
 */
export class KnowledgeEngine {
  /**
   * Fetch a DetectionObject by its raw signature (e.g., '4625')
   * @param signatureId - The raw event ID (e.g., Windows Event ID, Sysmon ID)
   * @returns The structured DetectionObject containing MITRE mappings and descriptions
   */
  static getDetectionBySignature(signatureId: string): DetectionObject | undefined {
    return detectionBySignatureMap.get(signatureId);
  }

  /**
   * Traverse the graph from a Detection to get its specific Investigation Questions.
   * This joins the Detection node to Investigation nodes via `investigationIds`.
   * @param detectionId - The internal UUID of the DetectionObject
   * @returns An array of actionable InvestigationObjects for the analyst
   */
  static getInvestigationsForDetection(detectionId: string): InvestigationObject[] {
    const detection = detectionByIdMap.get(detectionId);
    if (!detection) return [];
    
    const results: InvestigationObject[] = [];
    for (const invId of detection.investigationIds) {
      const inv = investigationByIdMap.get(invId);
      if (inv) results.push(inv);
    }
    return results;
  }

  /**
   * Traverse the graph from a Detection to get its specific Response Actions.
   * Identifies automated scripts, playbooks, or manual actions to contain the threat.
   * @param detectionId - The internal UUID of the DetectionObject
   * @returns An array of ResponseObjects tailored to this detection
   */
  static getResponsesForDetection(detectionId: string): ResponseObject[] {
    const detection = detectionByIdMap.get(detectionId);
    if (!detection) return [];
    
    const results: ResponseObject[] = [];
    for (const resId of detection.responseIds) {
      const res = responseByIdMap.get(resId);
      if (res) results.push(res);
    }
    return results;
  }

  /**
   * Search for advanced persistent threats (APTs) or profiles associated with a specific MITRE technique.
   * Used in the Threat Intelligence dashboard to map tactical observations to threat actors.
   * @param techniqueId - The MITRE ATT&CK Technique ID (e.g., 'T1078')
   */
  static getThreatsByTechnique(techniqueId: string): ThreatObject[] {
    return threatsByTechniqueMap.get(techniqueId) || [];
  }
}
