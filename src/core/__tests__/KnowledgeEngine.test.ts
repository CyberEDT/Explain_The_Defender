import { describe, it, expect } from 'vitest';
import { KnowledgeEngine } from '../KnowledgeEngine';

describe('KnowledgeEngine', () => {
  it('should find detection by signature', () => {
    // 4625 is standard Windows Event ID for failed logon
    const det = KnowledgeEngine.getDetectionBySignature('4625');
    expect(det).toBeDefined();
    expect(det?.signatureId).toBe('4625');
    expect(det?.mitreMappings.length).toBeGreaterThan(0);
  });

  it('should return investigations for a valid detection', () => {
    // We get the internal ID of 4625 to find its investigations
    const det = KnowledgeEngine.getDetectionBySignature('4625');
    expect(det).toBeDefined();
    
    if (det) {
      const investigations = KnowledgeEngine.getInvestigationsForDetection(det.id);
      expect(investigations).toBeDefined();
      expect(Array.isArray(investigations)).toBe(true);
      // We expect some investigations mapped
      expect(investigations.length).toBeGreaterThan(0);
    }
  });

  it('should return responses for a valid detection', () => {
    const det = KnowledgeEngine.getDetectionBySignature('4625');
    if (det) {
      const responses = KnowledgeEngine.getResponsesForDetection(det.id);
      expect(responses).toBeDefined();
      expect(Array.isArray(responses)).toBe(true);
    }
  });

  it('should find threats by MITRE technique', () => {
    // T1078 is Valid Accounts
    const threats = KnowledgeEngine.getThreatsByTechnique('T1078');
    expect(threats).toBeDefined();
    expect(Array.isArray(threats)).toBe(true);
  });

  it('should return empty arrays for invalid or missing IDs', () => {
    const inv = KnowledgeEngine.getInvestigationsForDetection('invalid-id');
    expect(inv).toEqual([]);
    
    const res = KnowledgeEngine.getResponsesForDetection('invalid-id');
    expect(res).toEqual([]);
    
    const thr = KnowledgeEngine.getThreatsByTechnique('T9999');
    expect(thr).toEqual([]);
  });
});
