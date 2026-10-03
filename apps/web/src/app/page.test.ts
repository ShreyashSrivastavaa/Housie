import { describe, it, expect } from 'vitest';

describe('Web Application Baseline', () => {
  it('loads environment variables and exports page component', async () => {
    const pageModule = await import('./page.js');
    expect(pageModule.default).toBeDefined();
    expect(typeof pageModule.default).toBe('function');
  });
});
