import { createContext, useEffect, useState } from 'react';

// Environment variables.
const SESSION_API_URL: string = import.meta.env.VITE_BACKEND_SESSION_API_URL;

export interface AuthContextProvider {
  loggedIn: boolean,
  login: () => void,
  logout: () => void
};

export const AuthContext = createContext<AuthContextProvider | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const getSession = async (): Promise<void> => {
      try {
        const res: globalThis.Response = await fetch(SESSION_API_URL, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Active session not found.');
        }
        setLoggedIn(true);
      } catch (error) {
        setLoggedIn(false);
      }
    };

    getSession();
  }, []);

  const login = (): void => {
    setLoggedIn(true);
  };

  const logout = (): void => {
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
