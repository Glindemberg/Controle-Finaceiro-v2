import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, CreditCard, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatMoney, getMonthLabel } from '@/lib/formatters';

interface HeaderProps {
  viewDate: Date;
  onChangeMonth: (step: number) => void;
  balance: number;
  income: number;
  expense: number;
  onOpenCards: () => void;
}

export function Header({ viewDate, onChangeMonth, balance, income, expense, onOpenCards }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <header className="glass rounded-b-3xl px-6 pt-6 pb-12 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
        </div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <button
            onClick={() => onChangeMonth(-1)}
            className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-card/80 transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-lg">{getMonthLabel(viewDate)}</span>
          <button
            onClick={() => onChangeMonth(1)}
            className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-card/80 transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center relative z-10">
          <p className="text-sm uppercase tracking-wider opacity-80 font-medium">Saldo Total</p>
          <h2 className="text-4xl font-bold tracking-tight mt-2">{formatMoney(balance)}</h2>
        </div>

        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex gap-2 z-20">
          <button
            onClick={() => navigate('/dashboard')}
            className="glass w-10 h-10 rounded-xl flex items-center justify-center hover:bg-card/80 transition-all"
            title="Dashboard"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenCards}
            className="glass w-10 h-10 rounded-xl flex items-center justify-center hover:bg-card/80 transition-all"
            title="Gerenciar Cartões"
          >
            <CreditCard className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 px-4 -mt-8 relative z-10">
        <div className="glass glass-hover rounded-2xl p-5 text-left border-l-4 border-l-success">
          <h3 className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            Receitas
          </h3>
          <p className="text-xl font-bold text-success mt-2">{formatMoney(income)}</p>
        </div>
        <div className="glass glass-hover rounded-2xl p-5 text-left border-l-4 border-l-destructive">
          <h3 className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-destructive" />
            Despesas
          </h3>
          <p className="text-xl font-bold text-destructive mt-2">{formatMoney(expense)}</p>
        </div>
      </div>
    </>
  );
}
