// ============================================================
// Appwrite REST API Client (no SDK - direct fetch)
// Client functions: browser-side with credentials
// Server functions: backend with API key
// ============================================================

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69cc168e00183ee74608';
const DATABASE_ID = 'kota-bunny-db';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
};

// --- Core fetch helpers ---

async function appwriteFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${ENDPOINT}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Appwrite error ${res.status}`);
  }
  return res.json();
}

function serverHeaders(apiKey: string) {
  return { ...headers, 'X-Appwrite-Key': apiKey };
}

// --- Client: Auth ---

export async function ping() {
  return appwriteFetch('/ping');
}

export async function createAccount(email: string, password: string, name: string) {
  return appwriteFetch('/account', {
    method: 'POST',
    body: JSON.stringify({ userId: 'unique()', email, password, name }),
  });
}

export async function createSession(email: string, password: string) {
  return appwriteFetch('/account/sessions/email', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
}

export async function createOAuth2Session(provider: 'google', successUrl: string, failureUrl: string) {
  // Returns the URL to redirect the user to
  const url = `${ENDPOINT}/account/sessions/oauth2/${provider}?project=${PROJECT_ID}&success=${encodeURIComponent(successUrl)}&failure=${encodeURIComponent(failureUrl)}`;
  return url;
}

export async function createPhoneSession(phone: string) {
  return appwriteFetch('/account/sessions/phone', {
    method: 'POST',
    body: JSON.stringify({ userId: 'unique()', phone }),
  });
}

export async function updatePhoneSession(userId: string, secret: string) {
  return appwriteFetch('/account/sessions/phone', {
    method: 'PUT',
    body: JSON.stringify({ userId, secret }),
    credentials: 'include',
  });
}

export async function getAccount() {
  return appwriteFetch('/account', { credentials: 'include' });
}

export async function deleteSession(sessionId = 'current') {
  return appwriteFetch(`/account/sessions/${sessionId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

// --- Client: Documents ---

export async function listDocuments(databaseId: string, collectionId: string, queries: Record<string, unknown>[] = []) {
  const params = queries.length
    ? '?' + queries.map((q) => `queries[]=${encodeURIComponent(JSON.stringify(q))}`).join('&')
    : '';
  return appwriteFetch(`/databases/${databaseId}/collections/${collectionId}/documents${params}`);
}

export async function getDocument(databaseId: string, collectionId: string, documentId: string) {
  return appwriteFetch(`/databases/${databaseId}/collections/${collectionId}/documents/${documentId}`, {
    credentials: 'include',
  });
}

export async function createDocument(databaseId: string, collectionId: string, data: Record<string, unknown>, documentId = 'unique()') {
  return appwriteFetch(`/databases/${databaseId}/collections/${collectionId}/documents`, {
    method: 'POST',
    body: JSON.stringify({ documentId, data }),
    credentials: 'include',
  });
}

export async function updateDocument(databaseId: string, collectionId: string, documentId: string, data: Record<string, unknown>) {
  return appwriteFetch(`/databases/${databaseId}/collections/${collectionId}/documents/${documentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ data }),
    credentials: 'include',
  });
}

// --- Server: Admin functions (API key required) ---

export async function serverListDocuments(apiKey: string, collectionId: string, queries: Record<string, unknown>[] = []) {
  const params = queries.length
    ? '?' + queries.map((q) => `queries[]=${encodeURIComponent(JSON.stringify(q))}`).join('&')
    : '';
  const res = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents${params}`, {
    headers: serverHeaders(apiKey),
  });
  return res.json();
}

export async function serverCreateDocument(apiKey: string, collectionId: string, data: Record<string, unknown>, documentId = 'unique()') {
  const res = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents`, {
    method: 'POST',
    headers: serverHeaders(apiKey),
    body: JSON.stringify({ documentId, data }),
  });
  return res.json();
}

export async function serverUpdateDocument(apiKey: string, collectionId: string, documentId: string, data: Record<string, unknown>) {
  const res = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents/${documentId}`, {
    method: 'PATCH',
    headers: serverHeaders(apiKey),
    body: JSON.stringify({ data }),
  });
  return res.json();
}

// --- Query helpers (Appwrite REST API needs JSON objects) ---

export const Query = {
  equal: (attribute: string, value: unknown) => ({ method: 'equal', attribute, values: Array.isArray(value) ? value : [value] }),
  greaterThanEqual: (attribute: string, value: unknown) => ({ method: 'greaterThanEqual', attribute, values: [value] }),
  orderDesc: (attribute: string) => ({ method: 'orderDesc', attribute }),
  orderAsc: (attribute: string) => ({ method: 'orderAsc', attribute }),
  limit: (value: number) => ({ method: 'limit', values: [value] }),
};

// --- Constants ---

export { ENDPOINT, PROJECT_ID, DATABASE_ID };
