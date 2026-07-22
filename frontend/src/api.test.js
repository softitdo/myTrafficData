import { beforeEach, expect, it, vi } from 'vitest';
import { api, clearToken, getToken, setToken } from './api';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

it('saves and reads the token', () => {
  expect(getToken()).toBeNull();
  setToken('abc');
  expect(getToken()).toBe('abc');
});

it('clears the token', () => {
  setToken('abc');
  clearToken();
  expect(getToken()).toBeNull();
});

it('adds Authorization when we have a token', async () => {
  setToken('tok123');
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ rows: [] }),
  });

  await api('/api/traffic');

  const [, opts] = fetch.mock.calls[0];
  expect(opts.headers.Authorization).toBe('Bearer tok123');
});

it('drops the token on 401', async () => {
  setToken('expired');
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    json: async () => ({}),
  });

  await expect(api('/api/traffic')).rejects.toThrow('UNAUTHORIZED');
  expect(getToken()).toBeNull();
});

it('throws the error message from the server', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => ({ error: 'bad input' }),
  });

  await expect(api('/api/traffic', { method: 'POST' })).rejects.toThrow('bad input');
});
