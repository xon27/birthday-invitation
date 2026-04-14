/* Storage keys match original static site for compatibility */
export const STORAGE_KEY = 'bd-invi-joiners';
export const SENT_LIST_KEY = 'bd-invi-sent-joiners';
export const LIST_AUTH_KEY = 'bd-invi-list-auth';
export const LIST_ACCESS_SECRET = 'eventhandler';

export function getJoiners() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function setJoiners(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getSentJoiners() {
  try {
    const raw = localStorage.getItem(SENT_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function setSentJoiners(list) {
  try {
    localStorage.setItem(SENT_LIST_KEY, JSON.stringify(list));
  } catch (e) {}
}
