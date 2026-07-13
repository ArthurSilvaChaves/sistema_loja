import React, { useEffect, useState} from "react";
import api from "../../services/api";
import type { Product } from "../../types/product";
import type { ItemVenda,Venda,FormaPagamento } from "../../types/sale";
import { useAuth } from "../../context/AuthContext";

export const Caixa: React.FC = () => {
    const { user } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [carregando,setCarregando] = useState<boolean>(true);

    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>('');
    const [quantidade, setQuantidade] = useState<string>('1');

    const [carrinho,setCarrinho] = useState<ItemVenda[]>([]);
    const [formaPagamento,setFormaPagamento] = useState<FormaPagamento>('dinheiro');
    const [descontoPercentual, setDescontoPercentual] = useState<string>('0');

    const [vendas, setVendas] = useState<Venda[]>([]);

    useEffect(() => {
        async function carregarProdutos() {
            try{
                const response = await api.get<Product[]>('/products');
                setProducts(response.data);
            }catch (erro){
                console.error("erro ao buscar produtos (API): ", erro);
                alert("nao foi possivel carregar os produtos! ");
            } finally {
                setCarregando(false)
            }
        }

        carregarProdutos();
    }, []);

    const adicionarAoCarrinho = () => {
        const produto = products.find(p => p.id === Number(produtoSelecionadoId));
        const qtd = parseInt(quantidade);

        if(!produto) {
            alert("selecione um produto valido! ");
            return
        }

        if(isNaN(qtd) || qtd <= 0) {
            alert("quantidade invalida");
            return
        }

        if(qtd > produto.inventory) {
            alert(`Estoque insuficiente ! disponivel: ${produto.inventory}`);
            return
        }

        const novoItem: ItemVenda = {
            productId: produto.id,
            name: produto.name,
            quantidade:qtd,
            precoUnitario:produto.price,
            subtotal:produto.price * qtd
        };

        setCarrinho([...carrinho, novoItem]);
        setProdutoSelecionadoId('');
        setQuantidade('1');
    };

    const removerDoCarrinho = (index: number) => {
        setCarrinho(carrinho.filter((_,i) => i !== index));
    };

    const totalBruto = carrinho.reduce((soma, item) => soma + item.subtotal, 0);

    const descontoPermitido = formaPagamento === 'dinheiro' || formaPagamento === 'pix';
    const descontoValor = descontoPermitido ? totalBruto * (parseFloat(descontoPercentual) || 0)/100 : 0;
    const totalFinal = totalBruto - descontoValor;

    const finalizarVenda = () => {
        if(carrinho.length === 0){
            alert('carrinho vazio!');
            return;
        }

        const novaVenda: Venda = {
            id: crypto.randomUUID(),
            funcionario: user?.name ?? 'desconhecido',
            itens: carrinho,
            totalBruto,
            desconto: descontoValor,
            totalFinal,
            formaPagamento,
            dataHora: new Date().toISOString()
        };

        setVendas([...vendas,novaVenda]);
        alert("venda finizalida com sucesso");
    
        setCarrinho([]);
        setDescontoPercentual('0');
        setFormaPagamento('dinheiro');
    };

    if(carregando){
        return <div>carregando...</div>
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>Caixa</h1>
            <p>Operador: {user?.name ?? 'Desconhecido'}</p>

            {/* seleção de produto */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select value={produtoSelecionadoId} onChange={e => setProdutoSelecionadoId(e.target.value)}>
                    <option value="">Selecione um produto</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} — R$ {p.price.toFixed(2)} (estoque: {p.inventory})
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={e => setQuantidade(e.target.value)}
                    style={{ width: '70px' }}
                />
                <button onClick={adicionarAoCarrinho}>Adicionar</button>
            </div>

            {/* carrinho */}
            <h3>Carrinho</h3>
            {carrinho.length === 0 && <p>Nenhum item adicionado</p>}
            <ul>
                {carrinho.map((item, index) => (
                    <li key={index}>
                        {item.name} — {item.quantidade}x R$ {item.precoUnitario.toFixed(2)} = R$ {item.subtotal.toFixed(2)}
                        <button onClick={() => removerDoCarrinho(index)} style={{ marginLeft: '10px' }}>
                            Remover
                        </button>
                    </li>
                ))}
            </ul>

            {/* pagamento */}
            <div style={{ marginTop: '20px' }}>
                <label>
                    Forma de pagamento:{' '}
                    <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value as FormaPagamento)}>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">Pix</option>
                        <option value="cartao">Cartão</option>
                    </select>
                </label>
            </div>

            {descontoPermitido && (
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Desconto (%):{' '}
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={descontoPercentual}
                            onChange={e => setDescontoPercentual(e.target.value)}
                            style={{ width: '60px' }}
                        />
                    </label>
                </div>
            )}

            {/* totais */}
            <div style={{ marginTop: '20px', fontSize: '1.1em' }}>
                <p>Subtotal: R$ {totalBruto.toFixed(2)}</p>
                {descontoPermitido && <p>Desconto: - R$ {descontoValor.toFixed(2)}</p>}
                <p><strong>Total: R$ {totalFinal.toFixed(2)}</strong></p>
            </div>

            <button onClick={finalizarVenda} style={{ marginTop: '10px' }}>
                Finalizar Venda
            </button>

            {/* histórico local */}
            <h3 style={{ marginTop: '40px' }}>Vendas realizadas (sessão atual)</h3>
            {vendas.length === 0 && <p>Nenhuma venda registrada ainda</p>}
            <ul>
                {vendas.map(v => (
                    <li key={v.id}>
                        {new Date(v.dataHora).toLocaleString('pt-BR')} — {v.funcionario} — R$ {v.totalFinal.toFixed(2)} ({v.formaPagamento})
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default Caixa