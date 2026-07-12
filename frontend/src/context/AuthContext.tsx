import React, { createContext, useState, useContext, useEffect } from 'react'

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{ children:React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('app_token');

        if(token){
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (token : string) => {
        localStorage.setItem('app_token',token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('app_token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value ={{isAuthenticated, login,logout,loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    return context;
};
