import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from './components/login';
import Dashboard from "./pages/dashboard/dashboard";

const MainContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>carregando...</div>;

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />
  
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}