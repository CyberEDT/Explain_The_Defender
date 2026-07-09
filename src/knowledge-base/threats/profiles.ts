import { ThreatObject } from '../../types';

export const threatKB: ThreatObject[] = [
  {
    id: 'THR-RANSOM-01',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    name: 'Ransomware Cartel (General)',
    category: 'Ransomware',
    objectives: ['Data Exfiltration', 'Extortion', 'File Encryption'],
    description: 'Financially motivated threat actors who gain initial access via brute force, phishing, or brokers, escalate privileges, exfiltrate sensitive data, and deploy ransomware organization-wide.',
    commonlyUsedMitreTechniques: ['T1078', 'T1110', 'T1486', 'T1567']
  },
  {
    id: 'THR-IAB-01',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    name: 'Initial Access Broker (IAB)',
    category: 'Broker',
    objectives: ['Establish Foothold', 'Harvest Credentials', 'Sell Access'],
    description: 'Specialized actors who focus solely on compromising perimeter defenses (VPNs, RDP) and selling that access to Ransomware operators on dark web forums.',
    commonlyUsedMitreTechniques: ['T1110.001', 'T1133', 'T1059.001']
  }
];
