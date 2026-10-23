import { UserProfile } from '../types';

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  provider: 'password' | 'google';
  createdAt: string;
}

const STORAGE_KEY = 'aura_registered_users';

/**
 * In-memory fallback for testing environments (like node:test) where localStorage may not exist.
 */
let inMemoryUsers: RegisteredAccount[] = [];

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function getRegisteredAccounts(): RegisteredAccount[] {
  if (isLocalStorageAvailable()) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
    return [];
  }
  return inMemoryUsers;
}

export function saveRegisteredAccounts(accounts: RegisteredAccount[]): void {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    } catch {
      // Fallback
    }
  }
  inMemoryUsers = [...accounts];
}

export function clearRegisteredAccountsForTesting(): void {
  inMemoryUsers = [];
  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fallback
    }
  }
}

export function findAccountByEmail(email: string): RegisteredAccount | undefined {
  const normalized = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  return accounts.find((acc) => acc.email.toLowerCase() === normalized);
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  themeId?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: UserProfile;
}

export function registerAccount(params: RegisterParams): AuthResult {
  const { name, email, password, themeId = 'midnight' } = params;
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const existing = findAccountByEmail(cleanEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please switch to "Sign In" to log in.',
    };
  }

  const newAccount: RegisteredAccount = {
    id: 'usr_aura_' + Date.now() + '_' + Math.floor(Math.random() * 899 + 100),
    name: cleanName,
    email: cleanEmail,
    password: password,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0f172a,1e293b&textColor=f8fafc`,
    provider: 'password',
    createdAt: new Date().toISOString(),
  };

  const all = getRegisteredAccounts();
  saveRegisteredAccounts([...all, newAccount]);

  return {
    success: true,
    user: {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      avatarUrl: newAccount.avatarUrl,
      isGuest: false,
      themeId,
    },
  };
}

export interface LoginParams {
  email: string;
  password: string;
  themeId?: string;
}

export function loginAccount(params: LoginParams): AuthResult {
  const { email, password, themeId = 'midnight' } = params;
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter your email address.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const account = findAccountByEmail(cleanEmail);
  if (!account) {
    return {
      success: false,
      error: 'No account found with this email. Only "Create Account" can register new users. Please create an account first.',
    };
  }

  if (account.password && account.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify your password or use "Forgot password?".',
    };
  }

  return {
    success: true,
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      avatarUrl: account.avatarUrl,
      isGuest: false,
      themeId,
    },
  };
}

export function authenticateWithGoogle(googleProfile: {
  email: string;
  name?: string;
  avatarUrl?: string;
  themeId?: string;
}): AuthResult {
  const cleanEmail = googleProfile.email.trim().toLowerCase();
  const cleanName = googleProfile.name?.trim() || cleanEmail.split('@')[0];
  const themeId = googleProfile.themeId || 'midnight';

  const existing = findAccountByEmail(cleanEmail);
  if (existing) {
    return {
      success: true,
      user: {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        avatarUrl: existing.avatarUrl,
        isGuest: false,
        themeId,
      },
    };
  }

  // Auto-register verified Google account
  const newAccount: RegisteredAccount = {
    id: 'usr_g_' + Date.now() + '_' + Math.floor(Math.random() * 899 + 100),
    name: cleanName,
    email: cleanEmail,
    avatarUrl:
      googleProfile.avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0f172a,1e293b&textColor=f8fafc`,
    provider: 'google',
    createdAt: new Date().toISOString(),
  };

  const all = getRegisteredAccounts();
  saveRegisteredAccounts([...all, newAccount]);

  return {
    success: true,
    user: {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      avatarUrl: newAccount.avatarUrl,
      isGuest: false,
      themeId,
    },
  };
}

export function updateRegisteredUserPassword(
  email: string,
  oldPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  const index = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);

  if (index === -1) {
    return { success: false, error: 'User account not found.' };
  }

  const account = accounts[index];
  if (account.password && account.password !== oldPassword) {
    return { success: false, error: 'Current password does not match records.' };
  }

  account.password = newPassword;
  accounts[index] = account;
  saveRegisteredAccounts(accounts);
  return { success: true };
}
