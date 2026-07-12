import { useEffect, useState} from "react";
import api from "../../services/api";
import type { Product } from "../../types/product";
import { useAuth } from "../../context/AuthContext";

export const Caixa: React.FC = () => {
    const { logout } = useAuth();

    //1.
    const [produtos, setProdutos] = useState<Product[]>([])
    const [carregando, setCarregando] = useState<boolean>(true)

    //2.

    useEffect(() => {
        async function carregarProdutos(){
            try{
                const response = await api.get<Product[]>('/products');

                setProdutos(response.data)
            } catch (erro) {
                console.error("Erro ao buscar produtos da API: ", erro);
                alert("nao foi possivel carregar os produtos!");
            } finally {
                setCarregando(false)
            }
        }

        carregarProdutos();
    }, []);

    if(carregando){
        return <p>carregando produtos do banco...</p>;
    }

    return (
        <div style={{padding: '20px', border:'2px solid #ccc'}}>
            <h1>Sistema generico de PDV - Tela de Caixa</h1>
            
            <button
            onClick={ logout }>
                deslogar
            </button>


            {produtos.length === 0 && <p>Nenhum produto no banco</p>}
        </div>
    );
}


export default Caixa;