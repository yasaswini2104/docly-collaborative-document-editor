/**
 * index.ts — Server entry point.
 *
 * Loads environment variables, creates the Express app, and binds to PORT.
 * This file is NOT imported by tests — tests use createApp() directly.
 */
import 'dotenv/config';
import { createApp } from './app.js';

const PORT = parseInt(process.env['PORT'] ?? '4000', 10);
const app = createApp();

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
