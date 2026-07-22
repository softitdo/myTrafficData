const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    throw new Error('UNAUTHORIZED');
  }

  let data = {};
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}
