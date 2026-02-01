import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, Wallet } from 'lucide-react';
import { useFinances } from '@/hooks/useFinances';
import { CATEGORY_CONFIG, Category } from '@/types/finance';
import { formatMoney } from '@/lib/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, viewDate, changeMonth, getTotals, isLoaded } = useFinances();
  const { income, expense, balance } = getTotals();

  const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const categoryTotals: Record<Category, number> = {} as Record<Category, number>;
    
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as Category,
        amount,
        percentage: expense > 0 ? (amount / expense) * 100 : 0,
        config: CATEGORY_CONFIG[category as Category]
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, viewDate, expense]);

  // Calculate income by category
  const incomeByCategory = useMemo(() => {
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const categoryTotals: Record<Category, number> = {} as Record<Category, number>;
    
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as Category,
        amount,
        percentage: income > 0 ? (amount / income) * 100 : 0,
        config: CATEGORY_CONFIG[category as Category]
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, viewDate, income]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold capitalize min-w-[160px] text-center">
            {monthName}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-muted rounded-xl transition-colors rotate-180"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Receitas</span>
            </div>
            <p className="text-lg font-bold text-success">{formatMoney(income)}</p>
          </div>
          
          <div className="glass rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Despesas</span>
            </div>
            <p className="text-lg font-bold text-destructive">{formatMoney(expense)}</p>
          </div>
          
          <div className="glass rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Saldo</span>
            </div>
            <p className={`text-lg font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatMoney(balance)}
            </p>
          </div>
        </div>

        {/* Expenses by Category */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-destructive/10 rounded-xl">
              <PieChart className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-lg font-bold">Despesas por Categoria</h2>
          </div>

          {expensesByCategory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma despesa registrada este mês.
            </p>
          ) : (
            <div className="space-y-4">
              {expensesByCategory.map(({ category, amount, percentage, config }) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <svg 
                          className="w-4 h-4" 
                          style={{ fill: config.color }}
                          viewBox="0 0 24 24"
                        >
                          <path d={config.icon} />
                        </svg>
                      </div>
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatMoney(amount)}</p>
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: config.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Income by Category */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-success/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <h2 className="text-lg font-bold">Receitas por Categoria</h2>
          </div>

          {incomeByCategory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma receita registrada este mês.
            </p>
          ) : (
            <div className="space-y-4">
              {incomeByCategory.map(({ category, amount, percentage, config }) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <svg 
                          className="w-4 h-4" 
                          style={{ fill: config.color }}
                          viewBox="0 0 24 24"
                        >
                          <path d={config.icon} />
                        </svg>
                      </div>
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">{formatMoney(amount)}</p>
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: config.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Investment Summary */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Investimentos</h2>
          </div>

          {(() => {
            const investmentTotal = incomeByCategory.find(c => c.category === 'investimento');
            const investmentExpense = expensesByCategory.find(c => c.category === 'investimento');
            
            const totalInvested = investmentExpense?.amount || 0;
            const totalReturns = investmentTotal?.amount || 0;

            if (totalInvested === 0 && totalReturns === 0) {
              return (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum investimento registrado este mês.
                </p>
              );
            }

            return (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Investido</p>
                  <p className="text-xl font-bold">{formatMoney(totalInvested)}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Retornos</p>
                  <p className="text-xl font-bold text-success">{formatMoney(totalReturns)}</p>
                </div>
              </div>
            );
          })()}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
