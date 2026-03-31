'use client';

import { useState, useEffect } from 'react';
import { createAccount, createSession, getAccount, deleteSession } from '../../lib/appwrite';

interface User {
  name: string;
  email: string;
}

export default function AuthPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccount()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login() {
    setError('');
    try {
      await createSession(email, password);
      setUser(await getAccount());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    }
  }

  async function register() {
    setError('');
    try {
      await createAccount(email, password, name);
      await login();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    }
  }

  async function logout() {
    setError('');
    try {
      await deleteSession();
      setUser(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Logout failed');
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Kota &amp; Bunny Explorer
        </h1>

        {user ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium text-lg">
              Logged in as <span className="font-bold">{user.name || user.email}</span>
            </p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name (for registration)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={login}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition"
              >
                Login
              </button>
              <button
                onClick={register}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
