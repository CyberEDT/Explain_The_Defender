import { DetectionObject } from '../../types';

// =============================================
// ETD Detection Intelligence Knowledge Base
// Windows Event Log Definitions (Relational)
// =============================================

export const windowsEventKB: DetectionObject[] = [
  {
    id: 'DET-WIN-4624',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    telemetrySource: 'Windows Security Log',
    signatureId: '4624',
    name: 'Successful Logon',
    defenderInterest: 'Logon events are critical for establishing user activity baselines. Anomalous logons (unusual times, geolocation, logon type) are key lateral movement indicators.',
    baseSeverity: 'informational',
    mitreMappings: [
      { tacticId: 'TA0001', tacticName: 'Initial Access', techniqueId: 'T1078', techniqueName: 'Valid Accounts' },
      { tacticId: 'TA0008', tacticName: 'Lateral Movement', techniqueId: 'T1021', techniqueName: 'Remote Services' }
    ],
    defenseChainMapping: {
      detect: 'Alert triggers when logon is from an unusual source IP or outside business hours.',
      triage: 'Enrich with asset criticality and account role. Admin accounts elevate priority.',
      investigate: 'Cross-reference with VPN logs, geolocation, and preceding 4625 events.',
      contain: 'If malicious: revoke active sessions, force MFA re-authentication.',
      eradicate: 'Rotate compromised credentials. Audit all logons from same source.',
      recover: 'Re-enable account after password reset. Monitor for 72h hyper-care.',
      improve: 'Implement conditional access policies. Alert on impossible travel.',
    },
    investigationIds: ['INV-Q-002'],
    responseIds: ['RES-USR-02', 'RES-IMP-01']
  },
  {
    id: 'DET-WIN-4625',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    telemetrySource: 'Windows Security Log',
    signatureId: '4625',
    name: 'Failed Logon',
    defenderInterest: 'Volume-based analysis of 4625 events reveals brute force and password spraying attacks. High frequency against multiple accounts from one IP = spray. High frequency against one account = brute force.',
    baseSeverity: 'low',
    mitreMappings: [
      { tacticId: 'TA0006', tacticName: 'Credential Access', techniqueId: 'T1110', techniqueName: 'Brute Force' },
      { tacticId: 'TA0006', tacticName: 'Credential Access', techniqueId: 'T1110.003', techniqueName: 'Password Spraying' }
    ],
    defenseChainMapping: {
      detect: 'Threshold alert: >10 failures in 5 minutes from same source.',
      triage: 'Differentiate spray vs brute. Admin accounts auto-escalate to High.',
      investigate: 'Correlate with 4624 to confirm if any attempt succeeded. Check source IP reputation.',
      contain: 'Block source IP at firewall. Temporarily disable targeted account if privileged.',
      eradicate: 'Force password reset for any account with successful logon after failures.',
      recover: 'Re-enable accounts. Add source IP to block list.',
      improve: 'Implement account lockout policies. Deploy MFA. Create spray detection rule.',
    },
    investigationIds: ['INV-Q-001', 'INV-Q-002', 'INV-Q-003'],
    responseIds: ['RES-USR-01', 'RES-IMP-01']
  },
  {
    id: 'DET-WIN-4688',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    telemetrySource: 'Windows Security Log',
    signatureId: '4688',
    name: 'Process Creation',
    defenderInterest: 'Process creation logs with command-line arguments reveal the exact execution context. Parent-child process anomalies (e.g., Word spawning PowerShell) are the strongest execution-based detection signal.',
    baseSeverity: 'informational',
    mitreMappings: [
      { tacticId: 'TA0002', tacticName: 'Execution', techniqueId: 'T1059', techniqueName: 'Command and Scripting Interpreter' },
      { tacticId: 'TA0002', tacticName: 'Execution', techniqueId: 'T1059.001', techniqueName: 'PowerShell' }
    ],
    defenseChainMapping: {
      detect: 'Alert on suspicious parent-child pairs and encoded command-line arguments.',
      triage: 'Determine if parent process is legitimate for this activity.',
      investigate: 'Decode Base64 payload. Map full process tree. Examine network connections.',
      contain: 'Kill malicious process. Isolate host via EDR.',
      eradicate: 'Delete dropped files. Remove persistence mechanisms created by the process.',
      recover: 'Restore from clean image if system is compromised. Monitor re-imaging.',
      improve: 'Create detection rule for specific LOLBIN usage. Block parent-child pair.',
    },
    investigationIds: ['INV-Q-004', 'INV-Q-005'],
    responseIds: ['RES-ISO-01', 'RES-REC-01']
  },
  {
    id: 'DET-WIN-7045',
    metadata: { version: '1.0.0', lastUpdated: '2023-10-01', author: 'ETD Intel Team', status: 'active' },
    telemetrySource: 'Windows System Log',
    signatureId: '7045',
    name: 'New Service Installed',
    defenderInterest: 'Service installation is a persistent execution mechanism. PsExec and Cobalt Strike commonly install temporary services. Unusual service names, binary paths, and SYSTEM-context execution are critical indicators.',
    baseSeverity: 'high',
    mitreMappings: [
      { tacticId: 'TA0003', tacticName: 'Persistence', techniqueId: 'T1543.003', techniqueName: 'Windows Service' }
    ],
    defenseChainMapping: {
      detect: 'Alert on services installed from non-standard paths (Temp, AppData, etc.).',
      triage: 'Verify binary path reputation. Check if signed by a trusted publisher.',
      investigate: 'Correlate with 4688 to confirm execution. Extract and analyze the binary.',
      contain: 'Stop and disable the service. Isolate the host.',
      eradicate: 'Delete the malicious service binary. Remove service registry keys.',
      recover: 'Restore from clean image or reimport registry hive. Verify no other services were created.',
      improve: 'Implement application whitelisting. Alert on service creation from temp directories.',
    },
    investigationIds: ['INV-Q-006'],
    responseIds: ['RES-SRV-01', 'RES-ISO-01']
  }
];
