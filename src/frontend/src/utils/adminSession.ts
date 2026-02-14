// Session-scoped storage for admin authentication with change notification
const SESSION_TOKEN_KEY = 'admin_session_token';
const SESSION_USERNAME_KEY = 'admin_username';
const SESSION_EXPIRY_KEY = 'admin_session_expiry';

export interface AdminSession {
  token: string;
  username: string;
  expiresAt?: bigint;
}

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export const adminSession = {
  get(): AdminSession | null {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    const username = sessionStorage.getItem(SESSION_USERNAME_KEY);
    const expiryStr = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    
    if (!token || !username) {
      return null;
    }

    // Check if session is expired
    if (expiryStr) {
      const expiresAt = BigInt(expiryStr);
      const now = BigInt(Date.now()) * BigInt(1_000_000); // Convert to nanoseconds
      if (now > expiresAt) {
        this.clear();
        return null;
      }
    }
    
    return { 
      token, 
      username,
      expiresAt: expiryStr ? BigInt(expiryStr) : undefined
    };
  },

  set(session: AdminSession): void {
    sessionStorage.setItem(SESSION_TOKEN_KEY, session.token);
    sessionStorage.setItem(SESSION_USERNAME_KEY, session.username);
    if (session.expiresAt) {
      sessionStorage.setItem(SESSION_EXPIRY_KEY, session.expiresAt.toString());
    }
    notifyListeners();
  },

  clear(): void {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USERNAME_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
    notifyListeners();
  },

  getToken(): string | null {
    const session = this.get();
    return session?.token || null;
  },

  getUsername(): string | null {
    const session = this.get();
    return session?.username || null;
  },

  subscribe(listener: ChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
