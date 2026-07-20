import React, { useEffect, useState } from "react";
import api from "../../services/api";
import type { SaleResponse } from "../../types/venda";
import styles from "./vendas.module.css";

export const Vendas: React.FC = () => {
    const [sales,setSales] = useState<SaleResponse[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [expandedId, setExpandedId] = useState<number | null>(null);

    async function carregarVendas() {
        setCarregando(true);
        try {
            const params: Record<string,string> = {};
            if (startDate) params.startDate = startDate;
            if(endDate) params.endDate = endDate;

            const response = await api.get<SaleResponse[]>("/sales", { params });
            setSales(response.data);
        } catch  (erro) {
            console.error("erro ao buscar vendas (API): ", erro);
            alert("nao foi possivel carregar as vendas! ");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarVendas();
    }, []);

    const handleFiltrar = (e: React.FormEvent) => {
        e.preventDefault();
        carregarVendas();
    };

    const handleLimparFiltro = () => {
        setStartDate("");
        setEndDate("");

        setTimeout(carregarVendas,0);
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (carregando) {
        return <div>Carregando...</div>
    }

    return ( 
        <div className={styles.container}>
            <h1>Histórico de Vendas</h1>

            <form onSubmit={handleFiltrar}>
                <label>
                    <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>

                <label>
                    até
                    <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>

                <button type="submit">Filtrar</button>
                <button type="button" onClick={handleLimparFiltro}>limpar</button>
            
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Funcionário</th>
                        <th>Forma de Pagamento</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <React.Fragment key={sale.id}>
                            <tr
                                onClick={() => toggleExpand(sale.id)}
                            >
                                <td>{new Date(sale.data).toLocaleString("pt-BR")}</td>
                                <td>{sale.employee.name}</td>
                                <td>{sale.paymentMethod}</td>
                                <td>R$ {sale.total.toFixed(2)}</td>
                            </tr>

                            {expandedId === sale.id && (
                                <tr className={styles.expandedRow}>
                                    <td colSpan={4}>
                                        <div>
                                            <strong>Itens Vendidos: </strong>
                                            <ul>
                                                {sale.items.map((item) => (
                                                    <li>
                                                        {item.product.name} — {item.quantity}x R$ {item.unitPrice.toFixed(2)}
                                                        {" "}(subTotal: R$ {(item.quantity * item.unitPrice).toFixed(2)})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {sales.length === 0 && <p>nenhuma venda encontrada nesse periodos</p>}
        </div>
    );
};


export default Vendas;

