import React, { useEffect, useState} from "react";
import api from "../../services/api";
import type { Product } from "../../types/product";

function Caixa(){
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
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                {produtos.map((produto) => (
                    <div key={produto.id} style={{border:'1px solid #ddd', padding:'15px', borderRadius:'8px'}}>
                        <h2>{produto.name}</h2>
                        <p>preco: {produto.price}</p>
                    </div>
                ))}
            </div>

            {produtos.length === 0 && <p>Nenhum produto no banco</p>}
        </div>
    );
}

export default Caixa;