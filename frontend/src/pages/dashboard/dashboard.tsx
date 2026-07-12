import React, { useEffect, useState} from "react";
import api from "../../services/api";
import type { Product } from "../../types/product";
import { useAuth } from "../../context/AuthContext";

export const Dashboard: React.FC = () => {
    const { logout } = useAuth();

    //estados de produtos
    const [products,setProducts] = useState<Product[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    //estados de crud e filtros de produtos
    const [busca,setBusca] = useState<string>('');
    const [novoNome,setNovoNome] = useState<string>('');
    const [novoPreco, setNovoPreco] = useState<string>('');
    const [novoEstoque,setNovoEstoque] = useState<string>('');

    useEffect(() => {
        async function carregarProdutos() {
            try{
                const response = await api.get<Product[]>('/products');
                setProducts(response.data);
            } catch (erro) {
                console.error("erro ao buscar produto (API): ", erro);
                alert("nao foi possivel encontrar ou carregar os produtos! ")
            } finally {
                setCarregando(false);
            }
        }
        carregarProdutos();
    }, []);

    const handleAddProducts = async (e: React.FormEvent) => {
        e.preventDefault();

        const preco = parseFloat(novoPreco);
        const estoque = parseInt(novoEstoque);

        if(isNaN(preco) || isNaN(estoque)) {
            alert("preco ou estoque invalido! ");
            return;
        }

        try{
            const response = await api.post<Product>('/products', {
                name:novoNome,
                price: novoPreco,
                inventory: novoEstoque
            });

            setProducts([...products, response.data])

            alert("produto adicionado com sucesso!");
            setNovoNome('');
            setNovoPreco('');
            setNovoEstoque('');
        } catch (erro) {
            console.error("erro ao adicionar produto (API): ",erro);
            alert("nao foi possivel adicionar o produto! ");
        }
    }

    const handleDeleteProduct = async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(product => product.id !== id));
            alert("produto deletado com sucesso!");
        } catch (erro) {
            console.error("erro ao deletar produto (API): ", erro);
            alert("nao foi possivel deletar o produto! ")
        } 
    }

    const filteredProcucts = products.filter(product => 
        product.name.toLowerCase().includes(busca.toLowerCase())
    );

    if (carregando) {
        return <div>carregando...</div>;
    }

    return (
        <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Sistema PDV generico - Tela de Dashboard</h1>
                <button
                onClick={logout}
                >
                    Sair
                </button>
            </div>

            <form onSubmit={handleAddProducts}>
                <h3>Cadastrar Produtos</h3>
                <input type="text" placeholder="Nome" value={novoNome} onChange={e => setNovoNome(e.target.value)} required/>
                <input type="number" placeholder="Preço" value={novoPreco} onChange={e => setNovoPreco(e.target.value)} required />
                <input type="number" placeholder="Estoque" value={novoEstoque} onChange={e => setNovoEstoque(e.target.value)} required/>

                <button type="submit">Adicionar</button>
            </form>

            {/* filtro <div> */}
            <div>
                <input 
                type="text"
                placeholder="filtrar por nome... "
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                />                
            </div>

            {/* Lista de produtos*/}

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                {filteredProcucts.map((product) => (
                    <div key={product.id} style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', position: 'relative'}}>
                        <h2>{product.name}</h2>
                        <p>estoque : {product.inventory}</p>
                        <p>Preço: R$ {product.price}</p>

                        <button
                        onClick={() => handleDeleteProduct(product.id)}>
                            Excluir
                        </button>
                    </div>
                ))}
            </div>
            {filteredProcucts.length === 0 && <p>Nenhum produto encontrado</p>}
        </div>  
    );
};

export default Dashboard;