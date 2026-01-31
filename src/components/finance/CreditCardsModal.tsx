import { useState } from 'react';
import { X, Plus, Trash2, CreditCard as CreditCardIcon } from 'lucide-react';
import { CreditCard, CARD_COLORS } from '@/types/finance';
import { formatMoney } from '@/lib/formatters';

interface CreditCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditCards: CreditCard[];
  onAddCard: (card: Omit<CreditCard, 'id'>) => void;
  onDeleteCard: (id: string) => void;
  getCardUsed: (cardId: string) => number;
}

export function CreditCardsModal({ 
  isOpen, 
  onClose, 
  creditCards, 
  onAddCard, 
  onDeleteCard,
  getCardUsed 
}: CreditCardsModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [limit, setLimit] = useState('');
  const [closingDay, setClosingDay] = useState('10');
  const [dueDay, setDueDay] = useState('20');
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) return;
    if (!name.trim() || lastDigits.length !== 4) return;

    onAddCard({
      name: name.trim(),
      lastDigits,
      limit: parsedLimit,
      closingDay: parseInt(closingDay),
      dueDay: parseInt(dueDay),
      color: selectedColor,
    });

    // Reset form
    setName('');
    setLastDigits('');
    setLimit('');
    setClosingDay('10');
    setDueDay('20');
    setSelectedColor(CARD_COLORS[0].value);
    setIsAdding(false);
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

        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <CreditCardIcon className="w-6 h-6 text-primary" />
          Meus Cartões
        </h2>

        {/* Cards List */}
        {creditCards.length === 0 && !isAdding ? (
          <div className="text-center py-8 opacity-60">
            <CreditCardIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">Nenhum cartão cadastrado.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {creditCards.map(card => {
              const used = getCardUsed(card.id);
              const percentage = Math.min((used / card.limit) * 100, 100);
              
              return (
                <div 
                  key={card.id}
                  className="glass rounded-2xl p-5 relative overflow-hidden group"
                  style={{ borderLeft: `4px solid ${card.color}` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{card.name}</h3>
                      <p className="text-muted-foreground text-sm">•••• {card.lastDigits}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir o cartão ${card.name}? Todas as transações vinculadas serão removidas.`)) {
                          onDeleteCard(card.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>

                  {/* Usage Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Usado</span>
                      <span className="font-semibold">{formatMoney(used)} / {formatMoney(card.limit)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: percentage > 80 ? 'hsl(var(--destructive))' : card.color
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📅 Fecha dia <strong className="text-foreground">{card.closingDay}</strong></span>
                    <span>💳 Vence dia <strong className="text-foreground">{card.dueDay}</strong></span>
                  </div>

                  {/* Available */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Disponível</span>
                      <span className="font-bold text-success">{formatMoney(Math.max(0, card.limit - used))}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Card Form */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="animate-fade-in">
            <h3 className="font-semibold mb-4">Novo Cartão</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Nome do Cartão
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Nubank"
                  required
                  maxLength={30}
                  className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Últimos 4 dígitos
                </label>
                <input
                  type="text"
                  value={lastDigits}
                  onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  required
                  pattern="\d{4}"
                  maxLength={4}
                  className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Limite (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="5000"
                  required
                  className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Dia de Fechamento
                </label>
                <select
                  value={closingDay}
                  onChange={(e) => setClosingDay(e.target.value)}
                  className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Dia de Vencimento
                </label>
                <select
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  className="w-full p-4 bg-muted/50 border-0 rounded-2xl font-medium focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color Picker */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-muted-foreground mb-3">
                Cor do Cartão
              </label>
              <div className="flex gap-2 flex-wrap">
                {CARD_COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-xl transition-all ${
                      selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-4 text-muted-foreground font-bold rounded-2xl hover:bg-muted/50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
              >
                Adicionar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Cartão
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 mt-2 text-muted-foreground font-bold rounded-2xl hover:bg-muted/50 transition-all"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
