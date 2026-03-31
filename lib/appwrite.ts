const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69cc168e00183ee74608';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
};

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

export async function getAccount(sessionSecret?: string) {
  const extra: Record<string, string> = {};
  if (sessionSecret) extra['X-Appwrite-Session'] = sessionSecret;
  return appwriteFetch('/account', { headers: extra, credentials: 'include' });
}

export async function deleteSession(sessionId = 'current', sessionSecret?: string) {
  const extra: Record<string, string> = {};
  if (sessionSecret) extra['X-Appwrite-Session'] = sessionSecret;
  return appwriteFetch(`/account/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: extra,
    credentials: 'include',
  });
}

export async function listDocuments(databaseId: string, collectionId: string, queries: string[] = []) {
  const params = queries.length ? `?queries[]=${queries.map(encodeURIComponent).join('&queries[]=')}` : '';
  return appwriteFetch(`/databases/${databaseId}/collections/${collectionId}/documents${params}`, {
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
