import { User } from '../types';

const USER_STORAGE_KEY = 'wanderlust_active_user';
const USERS_DB_KEY = 'wanderlust_users_db';

// Simulate a database of users in local storage
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_DB_KEY);
  return users ? JSON.parse(users) : [];
};

export const AuthService = {
  login: async (email: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('User not found. Please sign up.');
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (name: string, email: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }
};