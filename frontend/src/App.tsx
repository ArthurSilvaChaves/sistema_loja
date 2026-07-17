import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from './components/login';
import Dashboard from "./pages/dashboard/dashboard";
import Caixa from "./pages/Caixa/caixa";
import Vendas from "./pages/vendas/vendas"

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const MainContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>carregando...</div>;

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '10px', padding: '10px'}}>
        <Link to="/">Dashboard</Link>
        <Link to="/caixa">Caixa</Link>
        <Link to="/vendas">Vendas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/caixa" element={<Caixa />} />
        <Route path="/vendas" element={<Vendas />}/>
      </Routes>
    </BrowserRouter>
  );
  
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}