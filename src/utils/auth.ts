const AUTH_KEY = 'wld_auth';
const USER_KEY = 'wld_user';
const USERS_KEY = 'wld_users';

export interface UserInfo {
  username: string;
  displayName: string;
}

// Stored as { username -> { passwordHash, displayName } }
interface StoredUser {
  // Simple deterministic hash — NOT for production use
  passwordHash: string;
  displayName: string;
}

// Seed default users on first load
function seedDefaultUsers(): void {
  if (localStorage.getItem(USERS_KEY)) return;
  const defaults: Record<string, StoredUser> = {
    admin: { passwordHash: hashPassword('admin123'), displayName: '管理员' },
    operator: { passwordHash: hashPassword('op1234'), displayName: '操作员' },
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
}

/** Simple non-cryptographic hash for demo purposes only */
function hashPassword(password: string): string {
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

function getUsers(): Record<string, StoredUser> {
  seedDefaultUsers();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') as Record<string, StoredUser>;
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(username: string, password: string): { ok: boolean; message: string } {
  const users = getUsers();
  const user = users[username];
  if (!user) {
    return { ok: false, message: '用户名不存在' };
  }
  if (user.passwordHash !== hashPassword(password)) {
    return { ok: false, message: '密码错误' };
  }
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, JSON.stringify({ username, displayName: user.displayName }));
  return { ok: true, message: '' };
}

export function register(username: string, password: string, displayName: string): { ok: boolean; message: string } {
  const users = getUsers();
  if (users[username]) {
    return { ok: false, message: '用户名已存在' };
  }
  if (username.length < 3) {
    return { ok: false, message: '用户名至少3位' };
  }
  if (password.length < 6) {
    return { ok: false, message: '密码至少6位' };
  }
  users[username] = { passwordHash: hashPassword(password), displayName };
  saveUsers(users);
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, JSON.stringify({ username, displayName }));
  return { ok: true, message: '' };
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getCurrentUser(): UserInfo | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}
