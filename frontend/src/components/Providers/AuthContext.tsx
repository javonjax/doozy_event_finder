import { AuthContextHelper } from '@/schemas/schemas';
import { createContext, useState } from 'react';


export const AuthContext = createContext<AuthContextHelper | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const login = (): void => {
        setLoggedIn(true);
    };

    const logout = (): void => {
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{loggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};