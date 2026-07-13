import React, { createContext, useState, useContext, useEffect } from 'react'
import type { Employee } from '../types/employee';

interface AuthContextType {
    isAuthenticated: boolean;
    user: Employee | null;
    login: (token: string,userData:Employee) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{ children:React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<Employee |null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const token = localStorage.getItem('app_token');
        const storedUser = localStorage.getItem('app_user');

        if(token && storedUser){
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (erro) {
                console.error("dados de usuario corrompidos no localStorage, limpando...", erro);
                localStorage.removeItem('app_token')
                localStorage.removeItem('app_user')
            }
        }
        setLoading(false);
    }, []);

    const login = (token : string, userData: Employee) => {
        localStorage.setItem('app_token',token);
        localStorage.setItem('app_user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('app_token');
        localStorage.removeItem('app_user');
        setUser(null)
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user,login,logout,loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    return context;
};
