const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function timeoutFetch(url, options = {}, ms = 15000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('OFFLINE')), ms))
  ]);
}

export async function pcosPredict(data) {
  try {
    const res = await timeoutFetch(`${API_BASE}/pcos/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, 15000);
    if (!res.ok) throw new Error('OFFLINE');
    return await res.json();
  } catch (e) {
    if (e.message === 'OFFLINE' || e.name === 'TypeError') {
      const err = new Error('OFFLINE');
      err.code = 'OFFLINE';
      throw err;
    }
    throw e;
  }
}

export async function breastPredict(features) {
  try {
    const res = await timeoutFetch(`${API_BASE}/breast/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features })
    }, 15000);
    if (!res.ok) throw new Error('OFFLINE');
    return await res.json();
  } catch (e) {
    if (e.message === 'OFFLINE' || e.name === 'TypeError') {
      const err = new Error('OFFLINE');
      err.code = 'OFFLINE';
      throw err;
    }
    throw e;
  }
}

export async function breastReference() {
  try {
    const res = await timeoutFetch(`${API_BASE}/breast/reference`, { method: 'GET' }, 15000);
    if (!res.ok) throw new Error('OFFLINE');
    return await res.json();
  } catch (e) {
    if (e.message === 'OFFLINE' || e.name === 'TypeError') {
      const err = new Error('OFFLINE');
      err.code = 'OFFLINE';
      throw err;
    }
    throw e;
  }
}
