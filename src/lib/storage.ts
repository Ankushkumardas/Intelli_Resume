import type { User, AnalysisHistoryItem } from '../types.ts';

const USERS_KEY = 'resume_tailor_users';
const SESSION_KEY = 'resume_tailor_session';

// --- User Management ---

function getUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signupUser(name: string, email: string, password: string): User {
  const users = getUsers();
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  // In a real app, this would be a secure hash. Here it's just a simple "hash".
  const passwordHash = `hashed_${password}`; 

  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash,
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return newUser;
}

export function loginUser(email: string, password: string): User {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  const passwordHash = `hashed_${password}`;

  if (user && user.passwordHash === passwordHash) {
    setCurrentUser(user);
    return user;
  }

  throw new Error('Invalid email or password.');
}

// --- Session Management ---

export function getCurrentUser(): User | null {
  const sessionJson = localStorage.getItem(SESSION_KEY);
  return sessionJson ? JSON.parse(sessionJson) : null;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

// --- History Management ---

function getHistoryKey(userId: string): string {
  return `history_${userId}`;
}

export function getHistoryForUser(userId: string): AnalysisHistoryItem[] {
  const historyJson = localStorage.getItem(getHistoryKey(userId));
  const history = historyJson ? JSON.parse(historyJson) : [];
  return history.sort((a: AnalysisHistoryItem, b: AnalysisHistoryItem) => 
    new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
  );
}

export function addHistoryForUser(
    userId: string, 
    item: Omit<AnalysisHistoryItem, 'id' | 'analyzedAt'>
): AnalysisHistoryItem {
  const history = getHistoryForUser(userId);
  const newHistoryItem: AnalysisHistoryItem = {
    ...item,
    id: `hist_${Date.now()}`,
    analyzedAt: new Date().toISOString(),
  };
  history.unshift(newHistoryItem); // Add to the top
  localStorage.setItem(getHistoryKey(userId), JSON.stringify(history));
  return newHistoryItem;
}
