// Authentication utilities using localStorage
export interface User {
  id: string;
  email: string;
  username: string;
  score: number;
}

export const authService = {
  login: (email: string, password: string): User | null => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      const user: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        score: 1250,
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },
};
