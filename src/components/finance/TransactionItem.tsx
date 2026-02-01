import { Trash2, Pencil } from 'lucide-react';
import { Transaction, CATEGORY_CONFIG } from '@/types/finance';
import { formatMoney, formatDate } from '@/lib/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onDelete, onEdit }: TransactionItemProps) {
  const category = CATEGORY_CONFIG[transaction.category];

  return (
    <div 
      className="glass glass-hover rounded-2xl p-4 mb-3 relative overflow-hidden group"
      style={{ 
        '--category-color': category.color 
      } as React.CSSProperties}
    >
      {/* Colored side bar */}
      <div 
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ backgroundColor: category.color }}
      />

      <div className="flex items-center gap-4">
        {/* Icon Container */}
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center ml-2 bg-muted/50"
          style={{ color: category.color }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d={category.icon} />
          </svg>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{transaction.desc}</h4>
          <p className="text-sm text-muted-foreground font-medium">
            {formatDate(transaction.date)} • {category.label}
          </p>
        </div>

        {/* Amount & Actions */}
        <div className="text-right flex flex-col items-end gap-1">
          <span 
            className={`font-bold text-lg ${
              transaction.type === 'income' ? 'text-success' : 'text-destructive'
            }`}
          >
            {transaction.type === 'expense' ? '- ' : '+ '}
            {formatMoney(transaction.amount)}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1 hover:bg-primary/10 rounded-lg"
            >
              <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1 hover:bg-destructive/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
