/**
 * Vitest / @testing-library global test setup.
 *
 * - Imports jest-dom matchers so `expect(el).toBeInTheDocument()` etc. work.
 * - Clears all mocks between tests for isolation.
 *
 * Referenced by vitest.config.ts → test.setupFiles.
 */
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically unmount React trees after each test to prevent leaks
afterEach(() => {
  cleanup();
});
