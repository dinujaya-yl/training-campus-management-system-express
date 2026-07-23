export function uniqueEmail(prefix = 'user') {
  return `e2e${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
}

export function buildUserPayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    email: uniqueEmail(),
    password: 'Password123!',
    confirmPassword: 'Password123!',
    name: 'Test User',
    ...overrides,
  };
}