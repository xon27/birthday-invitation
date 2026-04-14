import { getSentJoiners, setSentJoiners } from './storage';

/** Base URL for static joiners API (e.g. /api/joiners.php). If set, we use PHP file on Hostinger. */
const STATIC_API_URL = import.meta.env.VITE_JOINERS_API_URL || '';

function useStaticApi() {
  return typeof STATIC_API_URL === 'string' && STATIC_API_URL.length > 0;
}

async function staticApiGet() {
  const res = await fetch(STATIC_API_URL, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch joiners');
  const list = await res.json();
  return Array.isArray(list) ? list : [];
}

async function staticApiPost(joiners) {
  const res = await fetch(STATIC_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(joiners),
  });
  if (!res.ok) throw new Error('Failed to add joiners');
  const data = await res.json().catch(() => ({}));
  if (data && data.ok !== true) throw new Error('API did not confirm success');
}

async function staticApiDelete(id) {
  const url = new URL(STATIC_API_URL);
  url.searchParams.set('id', id);
  const res = await fetch(url.toString(), { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove joiner');
}

/**
 * Add joiners to the list. Uses static API if VITE_JOINERS_API_URL is set, else localStorage.
 */
export async function addJoinersToList(joiners) {
  if (!joiners || joiners.length === 0) return;
  if (useStaticApi()) {
    try {
      await staticApiPost(joiners);
      return;
    } catch (e) {
      console.warn('Static API add failed, using localStorage', e);
      /* fall through to localStorage so Generate guests works locally */
    }
  }
  const existing = getSentJoiners();
  setSentJoiners(existing.concat(joiners));
}

/**
 * Get all joiners. Returns array of { id, name, lastname }.
 */
export async function fetchJoinersList() {
  if (useStaticApi()) {
    try {
      const list = await staticApiGet();
      return list.map((j) => ({
        id: j.id || '',
        name: j.name ?? '',
        lastname: j.lastname ?? '',
      }));
    } catch (e) {
      console.warn('Static API get failed, using localStorage', e);
    }
  }
  const raw = getSentJoiners();
  return raw.map((j, i) => ({ id: `local-${i}`, name: j.name, lastname: j.lastname }));
}

/**
 * Remove one joiner by id.
 */
export async function removeJoinerFromList(id) {
  if (useStaticApi() && id && !id.startsWith('local-')) {
    try {
      await staticApiDelete(id);
      return;
    } catch (e) {
      console.warn('Static API delete failed', e);
    }
  }
  const list = getSentJoiners();
  const idx = typeof id === 'string' && id.startsWith('local-') ? parseInt(id.replace('local-', ''), 10) : -1;
  if (idx >= 0 && idx < list.length) {
    list.splice(idx, 1);
    setSentJoiners(list);
  }
}
