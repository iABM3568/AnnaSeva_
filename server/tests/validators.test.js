// Run with: npm test
// These tests execute Zod schemas in-memory without starting an HTTP server or connecting to MongoDB.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { registerSchema } from '../validators/auth.schema.js';
import { createListingSchema, nearbySchema } from '../validators/listing.schema.js';

const hoursFromNow = (hours) => new Date(Date.now() + hours * 3600 * 1000).toISOString();

describe('registerSchema', () => {
  const valid = { name: 'Asha', email: 'Asha@Example.com', password: 'longenough1', role: 'donor' };

  it('accepts a valid donor and lowercases the email', () => {
    const result = registerSchema.safeParse(valid);
    assert.equal(result.success, true);
    assert.equal(result.data.email, 'asha@example.com');
  });

  it('rejects the admin role (nobody can self-promote)', () => {
    assert.equal(registerSchema.safeParse({ ...valid, role: 'admin' }).success, false);
  });

  it('rejects a short password', () => {
    assert.equal(registerSchema.safeParse({ ...valid, password: '123' }).success, false);
  });

  it('silently drops unknown fields such as isAdmin', () => {
    const result = registerSchema.safeParse({ ...valid, isAdmin: true });
    assert.equal(result.success, true);
    assert.equal('isAdmin' in result.data, false);
  });
});

describe('createListingSchema', () => {
  const valid = () => ({
    title: 'Vegetable biryani',
    foodType: 'veg',
    quantity: 20,
    preparedAt: hoursFromNow(-1),
    expiresAt: hoursFromNow(3),
    pickupAddress: '12 FC Road, Pune',
    latitude: 18.5204,
    longitude: 73.8567,
  });
  const passes = (data) => createListingSchema.safeParse(data).success;

  it('accepts a valid listing', () => assert.equal(passes(valid()), true));
  it('converts numbers sent as text ("20" becomes 20)', () => {
    const result = createListingSchema.safeParse({ ...valid(), quantity: '20', latitude: '18.5', longitude: '73.8' });
    assert.equal(result.success, true);
    assert.equal(result.data.quantity, 20);
  });
  it('rejects an expiry time in the past', () => assert.equal(passes({ ...valid(), expiresAt: hoursFromNow(-2) }), false));
  it('rejects an expiry more than 24 hours away', () => assert.equal(passes({ ...valid(), expiresAt: hoursFromNow(30) }), false));
  it('rejects an expiry before the preparation time', () => {
    assert.equal(passes({ ...valid(), preparedAt: hoursFromNow(2), expiresAt: hoursFromNow(1) }), false);
  });
  it('rejects a latitude outside -90..90', () => assert.equal(passes({ ...valid(), latitude: 91 }), false));
  it('rejects a BLANK latitude (it must not become 0)', () => assert.equal(passes({ ...valid(), latitude: '' }), false));
  it('rejects a blank longitude', () => assert.equal(passes({ ...valid(), longitude: '' }), false));
  it('rejects a quantity of 0', () => assert.equal(passes({ ...valid(), quantity: 0 }), false));
  it('rejects an unknown food type', () => assert.equal(passes({ ...valid(), foodType: 'pizza' }), false));
});

describe('nearbySchema', () => {
  it('defaults the radius to 10 km', () => {
    const result = nearbySchema.safeParse({ lat: '18.52', lng: '73.85' });
    assert.equal(result.success, true);
    assert.equal(result.data.radiusKm, 10);
  });
  it('rejects a blank lat or lng', () => {
    assert.equal(nearbySchema.safeParse({ lat: '', lng: '73.85' }).success, false);
    assert.equal(nearbySchema.safeParse({ lat: '18.52', lng: '' }).success, false);
  });
  it('rejects a radius above 50 km', () => {
    assert.equal(nearbySchema.safeParse({ lat: '18.52', lng: '73.85', radiusKm: '500' }).success, false);
  });
});
