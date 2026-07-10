// ============================================================
// CIL Types for ETD
// Mirrors packages/cil/src/types.ts
// ============================================================

export interface CILSession {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  version: '1.0';
  asset: CILAsset;
  exposures: CILExposure[];
  attackSurface: CILAttackSurface | null;
  attackPaths: CILAttackPath[];
  threats: CILThreat[];
  mitreTechniques: CILMitreMapping[];
  securityControls: CILSecurityControl[];
  detections: CILDetection[];
  recommendations: CILRecommendation[];
  risk: CILRisk;
  metadata: CILMetadata;
}

export interface CILAsset {
  id: string;
  hostname?: string;
  ip?: string;
  os?: string;
  assetType: 'server' | 'workstation' | 'network' | 'cloud' | 'unknown';
}

export interface CILExposure {
  id: string;
  port: number;
  protocol: 'tcp' | 'udp';
  service: string;
  version?: string;
  state: 'open' | 'filtered' | 'closed';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  cveIds: string[];
  isInternetFacing: boolean;
  description?: string;
  source: 'EME';
}

export interface CILAttackSurface {
  totalPorts: number;
  openPorts: number[];
  criticalServices: string[];
  internetFacingCount: number;
  exposureScore: number;
}

export interface CILAttackStep {
  stepNumber: number;
  phase: string;
  technique: string;
  techniqueId: string;
  description: string;
}

export interface CILAttackPath {
  id: string;
  name: string;
  description: string;
  steps: CILAttackStep[];
  likelihood: 'very-likely' | 'likely' | 'possible' | 'unlikely';
  impact: 'critical' | 'high' | 'medium' | 'low';
  mitreTechniqueIds: string[];
  source: 'ETH';
}

export interface CILThreat {
  id: string;
  name: string;
  category: 'APT' | 'Ransomware' | 'Insider' | 'Commodity' | 'Unknown';
  ttps: string[];
  killChainPhases: string[];
  description?: string;
  source: 'ETH';
}

export interface CILMitreMapping {
  tacticId: string;
  tacticName: string;
  techniqueId: string;
  techniqueName: string;
}

export interface CILSecurityControl {
  id: string;
  title: string;
  phase: 'detect' | 'investigate' | 'contain' | 'eradicate' | 'recover' | 'harden';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  source: 'ETD';
}

export interface CILDetection {
  id: string;
  name: string;
  description: string;
  eventIds: string[];
  mitreTechniqueIds: string[];
  source: 'ETD';
}

export interface CILRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'patch' | 'config' | 'monitoring' | 'process' | 'hardening';
  source: 'ETD';
}

export interface CILRisk {
  overallScore: number;
  exposureScore?: number;
  threatScore?: number;
  defensiveGapScore?: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface CILMetadata {
  eme: { published: boolean; publishedAt?: string; scanLevel?: string };
  eth: { published: boolean; publishedAt?: string };
  etd: { published: boolean; publishedAt?: string };
}
