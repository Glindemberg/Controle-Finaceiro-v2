import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Category, CATEGORY_CONFIG, CreditCard as CreditCardType } from '@/types/finance';
import { getTodayISO } from '@/lib/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    desc: string;
    amount: number;
    category: Category;
    date: string;
    type: 'income' | 'expense';
    cardId?: string;
    installments?: number;
  }) => void;
  creditCards: CreditCardType[];
}

const incomeCategories: Category[] = ['salario', 'investimento', 'outros'];
const expenseCategories: Category[] = [
  'moradia', 'alimentacao', 'transporte', 'saude', 
  'lazer', 'contas', 'educacao', 'streaming', 'outros'
];

export function TransactionModal({ isOpen, onClose, onSubmit, creditCards }: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<Category>('alimentacao');
  const [date, setDate] = useState(getTodayISO());
  const [useCard, setUseCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState(2);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!desc.trim()) return;

    onSubmit({
      desc: desc.trim(),
      amount: parsedAmount,
      category: useCard ? 'cartao' : category,
      date,
      type,
      cardId: useCard ? selectedCardId : undefined,
      installments: isInstallment ? installments : 1,
    });

    // Reset form
    setAmount('');
    setDesc('');
    setCategory('alimentacao');
    setDate(getTodayISO());
    setUseCard(false);
    setSelectedCardId('');
    setIsInstallment(false);
    setInstallments(2);
    onClose();
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    if (newType === 'income') {
      setCategory('salario');
      setUseCard(false);
    } else {
      setCategory('alimentacao');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="glass relative w-full max-w-lg rounded-t-[2rem] p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Type Switch */}
        <div className="flex bg-muted/50 p-1.5 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              type === 'expense' 
                ? 'bg-card text-destructive shadow-lg' 
                : 'text-muted-foreground'
            }`}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              type === 'income' 
                ? 'bg-card text-success shadow-lg' 
                : 'text-muted-foreground'
            }`}
          >
            Receita
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
              className="w-full p-4 bg-muted/50 border-0 rounded-2xl text-3xl font-bold text-center focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Ex: Mercado"
              required
              maxLength={100}
              className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                disabled={useCard}
                className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none disabled:opacity-50"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {CATEGORY_CONFIG[cat].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
              />
            </div>
          </div>

          {/* Credit Card Option - Only for expenses */}
          {type === 'expense' && creditCards.length > 0 && (
            <div className="mb-5">
              <label className="flex items-center gap-3 bg-muted/50 p-4 rounded-2xl cursor-pointer hover:bg-muted/70 transition-colors">
                <input
                  type="checkbox"
                  checked={useCard}
                  onChange={(e) => {
                    setUseCard(e.target.checked);
                    if (e.target.checked && creditCards.length > 0) {
                      setSelectedCardId(creditCards[0].id);
                    }
                  }}
                  className="w-5 h-5 accent-primary"
                />
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="font-medium flex-1">Usar Cartão de Crédito</span>
              </label>

              {useCard && (
                <div className="mt-3 animate-fade-in">
                  <select
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
                  >
                    {creditCards.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Installment Option */}
          <div className="mb-5">
            <label className="flex items-center gap-3 bg-muted/50 p-4 rounded-2xl cursor-pointer hover:bg-muted/70 transition-colors">
              <input
                type="checkbox"
                checked={isInstallment}
                onChange={(e) => setIsInstallment(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
              <span className="font-medium flex-1">Parcelar / Repetir?</span>
            </label>

            {isInstallment && (
              <div className="mt-3 animate-fade-in">
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Quantas vezes (Meses):
                </label>
                <input
                  type="number"
                  value={installments}
                  onChange={(e) => setInstallments(Math.max(2, Math.min(120, parseInt(e.target.value) || 2)))}
                  min={2}
                  max={120}
                  className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-[0.98]"
          >
            Salvar Lançamento
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 mt-2 text-muted-foreground font-bold rounded-2xl hover:bg-muted/50 transition-all"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
