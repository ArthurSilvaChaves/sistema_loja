import React, {useState} from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from './components/login';
import Dashboard from "./pages/dashboard/dashboard";
import Caixa from "./pages/Caixa/caixa";

type Tela = 'dashboard' | 'caixa'

const MainContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [telaAtual, setTelaAtual] = useState<Tela>('dashboard');

  if (loading) return <div>carregando...</div>;

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <nav style={{display: 'flex', gap: '10px',padding:'10px',borderBottom: '1px solid #ddd'}}>
        <button onClick={() => setTelaAtual('dashboard')}>Dashboard</button>
        <button onClick={() => setTelaAtual('caixa')}>Caixa</button>
      </nav>

      {telaAtual === 'dashboard' && <Dashboard/ >}
      {telaAtual == 'caixa' && <Caixa />}
    </div>
  )
  
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}