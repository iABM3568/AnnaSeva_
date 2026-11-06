// Run with: npm test
// Starts the real Express app on a dynamic port and executes HTTP integration tests.
// None of these requests touch the database, so MongoDB is not required.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../app.js';

describe('API Integration (No database required)', () => {
  let server;
  let base;

  before(async () => {
    server = http.createServer(app);
    // Bind to port 0: operating system assigns any free ephemeral port
    await new Promise((resolve) => server.listen(0, resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => {
    // Cleanly close server to release resources and allow test process to terminate
    server.close();
  });

  it('GET /api/health answers 200 with status "ok"', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  });

  it('sends security headers (helmet)', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-powered-by'), null);
  });

  it('answers an unknown route with a JSON 404', async () => {
    const res = await fetch(`${base}/api/nonexistent-route`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.match(body.message, /not found/i);
  });

  it('answers malformed JSON with 400, not 500', async () => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid-json-payload',
    });
    assert.equal(res.status, 400);
  });

  it('rejects a protected route without a token with 401', async () => {
    const res = await fetch(`${base}/api/listings/mine`);
    assert.equal(res.status, 401);
  });

  it('rejects an oversized body with 413 (> 10kb)', async () => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'x'.repeat(20000) }),
    });
    assert.equal(res.status, 413);
  });
});
