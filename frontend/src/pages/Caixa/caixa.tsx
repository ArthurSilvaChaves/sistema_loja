fetch

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import type { Product } from "../../types/product";
import type { ItemVenda, Venda, FormaPagamento } from "../../types/sale";
import { useAuth } from "../../context/AuthContext";
import styles from "./caixa.module.css";

export const Caixa: React.FC = () => {
    const { user } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>('');
    const [quantidade, setQuantidade] = useState<string>('1');

    const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('dinheiro');
    const [descontoPercentual, setDescontoPercentual] = useState<string>('0');

    const [vendas, setVendas] = useState<Venda[]>([]);
    const [enviando, setEnviando] = useState<boolean>(false);

    async function carregarProdutos() {
        try {
            const response = await api.get<Product[]>('/products');
            setProducts(response.data);
        } catch (erro) {
            console.error("erro ao buscar produtos (API): ", erro);
            alert("nao foi possivel carregar os produtos! ");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    const adicionarAoCarrinho = () => {
        const produto = products.find(p => p.id === Number(produtoSelecionadoId));
        const qtd = parseInt(quantidade);

        if (!produto) {
            alert("selecione um produto valido! ");
            return
        }

        if (isNaN(qtd) || qtd <= 0) {
            alert("quantidade invalida");
            return
        }

        if (qtd > produto.inventory) {
            alert(`Estoque insuficiente ! disponivel: ${produto.inventory}`);
            return
        }

        const novoItem: ItemVenda = {
            productId: produto.id,
            name: produto.name,
            quantidade: qtd,
            precoUnitario: produto.price,
            subtotal: produto.price * qtd
        };

        setCarrinho([...carrinho, novoItem]);
        setProdutoSelecionadoId('');
        setQuantidade('1');
    };

    const removerDoCarrinho = (index: number) => {
        setCarrinho(carrinho.filter((_, i) => i !== index));
    };

    const totalBruto = carrinho.reduce((soma, item) => soma + item.subtotal, 0);

    const descontoPermitido = formaPagamento === 'dinheiro' || formaPagamento === 'pix';
    const descontoValor = descontoPermitido ? totalBruto * (parseFloat(descontoPercentual) || 0) / 100 : 0;
    const totalFinal = totalBruto - descontoValor;

    const finalizarVenda = async () => {
        if (carrinho.length === 0) {
            alert('carrinho vazio!');
            return;
        }

        if (!user?.id) {
            alert('nao foi possivel identificar o operador logado');
            return;
        }

        setEnviando(true);

        try {
            const response = await api.post('/sales', {
                employeeId: user.id,
                paymentMethod: formaPagamento,
                items: carrinho.map(item => ({
                    productId: item.productId,
                    quantity: item.quantidade
                }))
            });

            const vendaCriada = response.data;

            const novaVenda: Venda = {
                id: String(vendaCriada.id),
                funcionario: user?.name ?? 'desconhecido',
                itens: carrinho,
                totalBruto,
                desconto: descontoValor,
                totalFinal: vendaCriada.total,
                formaPagamento,
                dataHora: vendaCriada.data
            };

            setVendas([...vendas, novaVenda]);
            alert("venda finalizada com sucesso");

            setCarrinho([]);
            setDescontoPercentual('0');
            setFormaPagamento('dinheiro');

            await carregarProdutos();
        } catch (erro: any) {
            console.error("erro ao finalizar venda (API): ", erro);
            const mensagem = erro?.response?.data?.error ?? 'erro ao finalizar a venda';
            alert(mensagem);
        } finally {
            setEnviando(false);
        }
    };

    if (carregando) {
        return <div>carregando...</div>
    }

    return (
        <div className={styles.parent}>
            <h1>Caixa</h1>
            <p>Operador: {user?.name ?? 'Desconhecido'}</p>

            {/* seleção de produto */}
            <div className={styles.productSelection}>
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
            <div className={styles.pagamento}>
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
            <div className={styles.totais}>
                <p>Subtotal: R$ {totalBruto.toFixed(2)}</p>
                {descontoPermitido && <p>Desconto: - R$ {descontoValor.toFixed(2)}</p>}
                <p><strong>Total: R$ {totalFinal.toFixed(2)}</strong></p>
            </div>

            <button onClick={finalizarVenda} disabled={enviando} style={{ marginTop: '10px' }}>
                {enviando ? 'Enviando...' : 'Finalizar Venda'}
            </button>

            {/* histórico local */}
            <h3 style={{ marginTop: '40px' }}>Vendas realizadas (sessão atual)</h3>
            {vendas.length === 0 && <p>Nenhuma venda registrada ainda</p>}
            <ul className={styles.vendas}>
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