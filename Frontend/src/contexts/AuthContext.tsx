import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../config';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  // Check for existing authentication on app load and redirect if needed
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // First check if we have a stored auth state
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const response = await fetch(`${API_URL}/auth/verify`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect to caption generator if on landing page
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/LoginPage' || currentPath === '/RegisterPage') {
            window.location.href = '/generatecaption';
          }

        } else {
          setUser(null);
          localStorage.removeItem('user');
          // If not on auth pages, redirect to landing
          const currentPath = window.location.pathname;
          if (currentPath !== '/' && currentPath !== '/LoginPage' && currentPath !== '/RegisterPage') {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Add a small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Navigate to caption generator
        window.location.href = '/generatecaption';
        
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: data.message || 'Login failed. Please check your credentials.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { 
          success: true, 
          message: data.message || 'Registration successful! Please login with your credentials.' 
        };
      } else {
        return { 
          success: false, 
          message: data.error || 'Registration failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};