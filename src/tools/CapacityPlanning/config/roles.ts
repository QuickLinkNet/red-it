export const STANDARD_ROLES = [
  'Scrum Master',
  'Product Owner',
  'Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'QA Engineer',
  'UI/UX Designer',
  'Data Analyst',
  'Architect',
  'Technical Lead',
  'Business Analyst',
  'Security Engineer',
] as const;

export type StandardRole = typeof STANDARD_ROLES[number];

export const CUSTOM_ROLE_PLACEHOLDER = 'custom';

export function isStandardRole(role: string): role is StandardRole {
  return STANDARD_ROLES.includes(role as StandardRole);
}

export function getRoleDisplayName(role: string): string {
  if (isStandardRole(role)) {
    return role;
  }
  return role; // Custom role, return as-is
}

export function getAllRoles(): readonly string[] {
  return STANDARD_ROLES;
}