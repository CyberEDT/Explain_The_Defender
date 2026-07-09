import { ResponseObject } from '../../types';

export const responseKB: ResponseObject[] = [
  {
    id: 'RES-ISO-01',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    phase: 'contain',
    action: 'Isolate Host from Network',
    technicalProcedure: 'Use EDR console to initiate Network Isolation. Allow only traffic to EDR management servers.',
    impactLevel: 'high'
  },
  {
    id: 'RES-USR-01',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    phase: 'contain',
    action: 'Disable Compromised User Account',
    technicalProcedure: 'Disable-ADAccount -Identity <Username> in Active Directory.',
    impactLevel: 'medium'
  },
  {
    id: 'RES-USR-02',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    phase: 'contain',
    action: 'Force Password Reset and Revoke Tokens',
    technicalProcedure: 'Reset user password in AD and revoke all active sessions in Azure AD / IdP.',
    impactLevel: 'low'
  },
  {
    id: 'RES-SRV-01',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    phase: 'eradicate',
    action: 'Remove Malicious Service',
    technicalProcedure: 'sc.exe stop <ServiceName> followed by sc.exe delete <ServiceName>. Ensure binary is deleted from disk.',
    impactLevel: 'medium'
  },
  {
    id: 'RES-REC-01',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    phase: 'recover',
    action: 'Re-image Compromised Host',
    technicalProcedure: 'Deploy clean OS image via SCCM/Intune. Do not trust existing OS state.',
    impactLevel: 'high'
  },
  {
    id: 'RES-IMP-01',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    phase: 'improve',
    action: 'Implement MFA for Remote Access',
    technicalProcedure: 'Enforce conditional access policies requiring MFA for all external RDP or VPN access.',
    impactLevel: 'high'
  }
];
