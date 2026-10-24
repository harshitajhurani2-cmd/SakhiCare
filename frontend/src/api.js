const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout));
}

export async function pcosPredict(data) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/pcos/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, 15000);
    if (!res.ok) {
      let bodyText = '';
      try { bodyText = await res.text(); } catch {}
      const err = new Error(bodyText || `HTTP ${res.status}`);
      err.code = 'SERVER';
      err.status = res.status;
      err.body = bodyText;
      throw err;
    }
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError' || e.message === 'Failed to fetch' || e.name === 'TypeError') {
      const err = new Error('OFFLINE');
      err.code = 'OFFLINE';
      throw err;
    }
    if (e.code === 'SERVER') throw e;
    const err = new Error(e.message || 'OFFLINE');
    err.code = e.code || 'OFFLINE';
    throw err;
  }
}

export async function breastPredict(features) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/breast/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features })
    }, 15000);
    if (!res.ok) {
      let bodyText = '';
      try { bodyText = await res.text(); } catch {}
      const err = new Error(bodyText || `HTTP ${res.status}`);
      err.code = 'SERVER';
      err.status = res.status;
      err.body = bodyText;
      throw err;
    }
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError' || e.message === 'Failed to fetch' || e.name === 'TypeError') {
      const err = new Error('OFFLINE');
      err.code = 'OFFLINE';
      throw err;
    }
    if (e.code === 'SERVER') throw e;
    const err = new Error(e.message || 'OFFLINE');
    err.code = e.code || 'OFFLINE';
    throw err;
  }
}

export async function breastReference() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/breast/reference`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, 15000);
    if (!res.ok) {
      let bodyText = '';
      try { bodyText = await res.text(); } catch {}
      const err = new Error(bodyText || `HTTP ${res.status}`);
      err.code = 'SERVER';
      err.status = res.status;
      err.body = bodyText;
      throw err;
    }
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError' || e.message === 'Failed to fetch' || e.name === 'TypeError') {
      const err = new Error('OFFLINE');
      err.code = 'OFFLINE';
      throw err;
    }
    if (e.code === 'SERVER') throw e;
    const err = new Error(e.message || 'OFFLINE');
    err.code = e.code || 'OFFLINE';
    throw err;
  }
}
