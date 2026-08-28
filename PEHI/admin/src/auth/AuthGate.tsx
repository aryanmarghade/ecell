import React, { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../firebase';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSigningIn(true);

    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase is not configured. Add the VITE_FIREBASE values to .env.');
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">PEHI HQ</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Admin sign in</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage patient feedback.</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </label>
        </div>

        {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={isSigningIn}
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isSigningIn ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
};

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [configError, setConfigError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setConfigError('Firebase is not configured. Add the VITE_FIREBASE values to .env.');
      setIsCheckingAuth(false);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setConfigError('Firebase Authentication could not be initialized.');
      setIsCheckingAuth(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsCheckingAuth(false);
    });
  }, []);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm text-slate-500">Checking authentication...</div>;
  }

  if (configError) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 text-center text-sm text-rose-700">{configError}</div>;
  }

  return user ? <>{children}</> : <LoginScreen />;
};

export { signOut };
