import React, {useState} from "react";
import { useAuth } from "../context/AuthContext"

export const Login: React.FC = () => {  
    const { login } = useAuth();
    const [name,setName] = useState('');
    const [cpf,setCPF] = useState('');

    const [,setError] = useState('');

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body:JSON.stringify({name,cpf})
            });

            const dados = await response.json();

            if(response.ok) {
                login(dados.token,dados.employee)
            } else {
                setError(dados.error || 'erro no login');
            }
        } catch (err){
            setError('erro na conexao do servidor');
        }
    };

    return (
        <div style={{maxWidth: '300px', margin: '100px auto',textAlign:'center'}}>
            <h2>login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="text" placeholder="Nome do funcionario" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required
                />

                <br /><br />

                <input 
                type= "text"
                placeholder="cpf"
                value={cpf}
                onChange={(e) => setCPF(e.target.value)} 
                required
                />

                <br /><br />

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};
