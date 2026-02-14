// Session-scoped storage for admin authentication with change notification
const SESSION_TOKEN_KEY = 'admin_session_token';
const SESSION_USERNAME_KEY = 'admin_username';
const SESSION_EXPIRY_KEY = 'admin_session_expiry';
const LOGOUT_REASON_KEY = 'admin_logout_reason';

export interface AdminSession {
  token: string;
  username: string;
  expiresAt?: bigint;
}

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

// Single-flight invalidation flag to prevent repeated clears
let isClearing = false;
let clearingTimestamp = 0;
const CLEAR_DEBOUNCE_MS = 2000; // Prevent repeated clears within 2 seconds

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
        this.clearWithReason('Your session has expired. Please log in again.');
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
    // Clear any logout reason when setting a new session
    sessionStorage.removeItem(LOGOUT_REASON_KEY);
    isClearing = false; // Reset clearing flag on new session
    clearingTimestamp = 0;
    notifyListeners();
  },

  clear(): void {
    this.clearWithReason(null);
  },

  clearWithReason(reason: string | null): void {
    const now = Date.now();
    
    // Single-flight with time-based debouncing: prevent repeated clears
    if (isClearing && (now - clearingTimestamp) < CLEAR_DEBOUNCE_MS) {
      return;
    }
    
    isClearing = true;
    clearingTimestamp = now;
    
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USERNAME_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
    
    // Store logout reason for display on login screen
    if (reason) {
      sessionStorage.setItem(LOGOUT_REASON_KEY, reason);
    } else {
      sessionStorage.removeItem(LOGOUT_REASON_KEY);
    }
    
    notifyListeners();
    
    // Reset clearing flag after debounce period
    setTimeout(() => {
      isClearing = false;
    }, CLEAR_DEBOUNCE_MS);
  },

  getLogoutReason(): string | null {
    return sessionStorage.getItem(LOGOUT_REASON_KEY);
  },

  clearLogoutReason(): void {
    sessionStorage.removeItem(LOGOUT_REASON_KEY);
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
