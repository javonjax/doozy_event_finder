import { createContext, useEffect, useState } from 'react';

// Environment variables.
const SESSION_API_URL: string = import.meta.env.VITE_BACKEND_SESSION_API_URL;

export interface AuthContextProvider {
  loggedIn: boolean,
  login: () => void,
  logout: () => void,
  getSession: () => Promise<void>
};

export const AuthContext = createContext<AuthContextProvider | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async (): Promise<void> => {
    try {
      const res: globalThis.Response = await fetch(SESSION_API_URL, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Active session not found.');
      }
      login();
    } catch (error) {
      if (error instanceof Error) {
        logout();
      }
    }
  };

  const login = (): void => {
    setLoggedIn(true);
  };

  const logout = (): void => {
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, getSession }}>
      {children}
    </AuthContext.Provider>
  );
};
