import { Download } from 'lucide-react';
import { Transaction } from '@/types/finance';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  allTransactions: Transaction[];
}

export function TransactionList({ transactions, onDelete, allTransactions }: TransactionListProps) {
  const exportCSV = () => {
    let csv = "ID,Data,Descrição,Categoria,Tipo,Valor\n";
    allTransactions.forEach(t => {
      csv += `${t.id},${t.date},"${t.desc}",${t.category},${t.type},${t.amount}\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = "financas_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-sm font-bold uppercase text-muted-foreground">
          Extrato Mensal
        </h2>
        <button 
          onClick={exportCSV}
          className="text-sm font-semibold text-foreground flex items-center gap-1.5 hover:underline"
        >
          <Download className="w-4 h-4" />
          Baixar CSV
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 opacity-60">
          <p className="text-muted-foreground">Nenhum lançamento neste mês.</p>
        </div>
      ) : (
        <div>
          {transactions.map(t => (
            <TransactionItem 
              key={t.id} 
              transaction={t} 
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
