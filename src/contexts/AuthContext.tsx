import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types";
import { getCurrentUser, logout as apiLogout } from "@/services/auth.api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updatePoints: (pointsToAdd: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  setAuth: () => {},
  signOut: async () => {},
  refreshUser: async () => {},
  updatePoints: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!localStorage.getItem('accessToken');

  const setAuth = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Don't clear auth on refresh failure - user might just be offline
    }
  };

  const updatePoints = (pointsToAdd: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      points: Number(user.points) + pointsToAdd,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Always redirect to login after sign-out
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Only refresh user data if not on login/signup pages
          const isAuthPage = window.location.pathname.includes('/login') || 
                            window.location.pathname.includes('/signup') ||
                            window.location.pathname.includes('/verify-email');
          
          if (!isAuthPage) {
            // Optionally refresh user data from server
            await refreshUser();
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, setAuth, signOut, refreshUser, updatePoints }}>
      {children}
    </AuthContext.Provider>
  );
};
