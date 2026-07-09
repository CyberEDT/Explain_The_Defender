import { AssetCriticality, UserPrivilege } from '../types';

export const ASSET_MULTIPLIERS: Record<AssetCriticality, number> = {
  Standard: 1.0,
  Server: 1.3,
  PublicFacing: 1.5,
  AdminSystem: 1.8,
  CrownJewel: 2.0,
};

export const USER_RISK_ADDER: Record<UserPrivilege, number> = {
  Standard: 0,
  Privileged: 15,
  ServiceAccount: 25,
  Administrator: 35,
  DomainAdmin: 50,
};

export const EVENT_BASE_RISK: Record<string, number> = {
  'WEL-4624': 10, // Logon
  'WEL-4625': 20, // Failed Logon
  'WEL-4688': 30, // Process Create
  'WEL-4720': 40, // Account Create
  'WEL-4728': 50, // Group Add
  'WEL-7045': 60, // Service Install
};

/**
 * Utility to guess asset criticality based on hostname conventions.
 * In a real system, this would come from a CMDB lookup.
 */
export function inferAssetCriticality(hostname: string): AssetCriticality {
  const upper = hostname.toUpperCase();
  if (upper.includes('DC-')) return 'CrownJewel';
  if (upper.includes('EXCHANGE') || upper.includes('SQL')) return 'CrownJewel';
  if (upper.includes('WEB') || upper.includes('DMZ')) return 'PublicFacing';
  if (upper.includes('JUMP') || upper.includes('ADMIN')) return 'AdminSystem';
  if (upper.includes('SRV-') || upper.includes('SERVER')) return 'Server';
  return 'Standard';
}

/**
 * Utility to guess user privilege based on username conventions.
 * In a real system, this would come from AD/LDAP lookup.
 */
export function inferUserPrivilege(username: string): UserPrivilege {
  const lower = username.toLowerCase();
  if (lower.includes('admin')) return 'Administrator';
  if (lower.includes('svc_') || lower.includes('service')) return 'ServiceAccount';
  if (lower === 'system' || lower === 'root') return 'DomainAdmin';
  // Example specific accounts mapped manually for our mock scenarios
  if (lower === 'svc_backup01') return 'DomainAdmin'; // It was added to domain admins
  return 'Standard';
}
