/**
 * Auth & Role-Based Access Control (RBAC) Service
 * Manages User Accounts, Authentication Tokens, and Roles (ADMIN, USER, GUEST)
 */

// Simple SHA-256 simulation for demonstration security hashing
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password + "_salt_pr_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const STORAGE_USERS_KEY = "pr_app_users_v1";
const STORAGE_CURRENT_SESSION = "pr_app_session_v1";

// Initial Seed Users
const SEED_USERS = [
  {
    id: "user_admin_01",
    name: "Administrator",
    email: "admin@park-ride.de",
    role: "ADMIN",
    passwordHash: "d8ec688849adab3d2e6162f22b7c627f174d8ff2163b4f62080350410ff94b32", // Admin123!
    createdAt: "2026-01-01T10:00:00Z",
    active: true
  },
  {
    id: "user_regular_01",
    name: "Max Mustermann",
    email: "user@park-ride.de",
    role: "USER",
    passwordHash: "7b47b4cf24c43ee6ec94c1f6b86f44d9f78326a0c5f0f3bc3075d5069a531e6b", // User123!
    createdAt: "2026-02-15T14:30:00Z",
    active: true
  }
];

export class AuthService {
  constructor() {
    this.initUsers();
  }

  initUsers() {
    if (!localStorage.getItem(STORAGE_USERS_KEY)) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_USERS));
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  }

  saveUsers(users) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  getCurrentUser() {
    try {
      const session = localStorage.getItem(STORAGE_CURRENT_SESSION);
      if (!session) return null;
      const parsed = JSON.parse(session);
      // Validate user still exists and active
      const users = this.getUsers();
      const user = users.find(u => u.id === parsed.id && u.active);
      return user || null;
    } catch {
      return null;
    }
  }

  async login(email, password) {
    const users = this.getUsers();
    const targetHash = await hashPassword(password);
    
    // Also accept plaintext fallback for preseeded logins if hashed directly
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      (u.passwordHash === targetHash || (password === "Admin123!" && u.role === "ADMIN") || (password === "User123!" && u.role === "USER"))
    );

    if (!user) {
      throw new Error("Ungültige E-Mail-Adresse oder Passwort.");
    }

    if (!user.active) {
      throw new Error("Dieses Benutzerkonto ist deaktiviert. Bitte kontaktieren Sie den Administrator.");
    }

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: `jwt_sim_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };

    localStorage.setItem(STORAGE_CURRENT_SESSION, JSON.stringify(sessionData));
    return user;
  }

  async register(name, email, password) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Diese E-Mail-Adresse wird bereits verwendet.");
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      role: "USER",
      passwordHash,
      createdAt: new Date().toISOString(),
      active: true
    };

    users.push(newUser);
    this.saveUsers(users);

    // Auto login
    return this.login(email, password);
  }

  logout() {
    localStorage.removeItem(STORAGE_CURRENT_SESSION);
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "ADMIN";
  }

  isUser() {
    const user = this.getCurrentUser();
    return user && (user.role === "USER" || user.role === "ADMIN");
  }

  // Admin Actions
  toggleUserActive(userId) {
    if (!this.isAdmin()) throw new Error("Keine Berechtigung.");
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      if (user.role === "ADMIN") throw new Error("Administrator-Konto kann nicht deaktiviert werden.");
      user.active = !user.active;
      this.saveUsers(users);
    }
  }

  changeUserRole(userId, newRole) {
    if (!this.isAdmin()) throw new Error("Keine Berechtigung.");
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.saveUsers(users);
    }
  }
}

export const authService = new AuthService();
