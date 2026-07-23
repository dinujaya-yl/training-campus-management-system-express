// e2e/fixtures/api-fixture.ts
import { test as base, request, type APIRequestContext } from '@playwright/test';

type Fixtures = {
  apiContext: APIRequestContext;
  authedApiContext: APIRequestContext;
};

export const test = base.extend<Fixtures>({
  apiContext: async ({ baseURL }, use) => {
    if (!baseURL) throw new Error('baseURL is not set in playwright.config.ts');

    const context = await request.newContext({ baseURL });
    await use(context);
    await context.dispose();
  },

  authedApiContext: async ({ baseURL }, use) => {
    if (!baseURL) throw new Error('baseURL is not set in playwright.config.ts');

    const context = await request.newContext({ baseURL });

    const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;
    await context.post('/api/auth/register', {
      data: { email, password: 'Password123!', confirmPassword: 'Password123!' },
    });
    const loginRes = await context.post('/api/auth/login', {
      data: { email, password: 'Password123!' },
    });
    const { token } = await loginRes.json();

    const authedContext = await request.newContext({
      baseURL,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    });

    await use(authedContext);
    await authedContext.dispose();
    await context.dispose();
  },
});

export { expect } from '@playwright/test';