import { useState, useEffect, useCallback } from 'react';
import type { Transaction, CreditCard, Category } from '@/types/finance';

const TRANSACTIONS_KEY = 'financas_v4_transactions';
const CARDS_KEY = 'financas_v4_cards';

export function useFinances() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    const savedCards = localStorage.getItem(CARDS_KEY);
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedCards) {
      setCreditCards(JSON.parse(savedCards));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CARDS_KEY, JSON.stringify(creditCards));
    }
  }, [creditCards, isLoaded]);

  const changeMonth = useCallback((step: number) => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + step);
      return newDate;
    });
  }, []);

  const getFilteredTransactions = useCallback(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date + 'T12:00:00');
      return tDate.getMonth() === viewDate.getMonth() && 
             tDate.getFullYear() === viewDate.getFullYear();
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, viewDate]);

  const addTransaction = useCallback((
    data: {
      desc: string;
      amount: number;
      category: Category;
      date: string;
      type: 'income' | 'expense';
      cardId?: string;
      installments?: number;
    }
  ) => {
    const { desc, amount, category, date, type, cardId, installments = 1 } = data;
    const baseDate = new Date(date + 'T12:00:00');
    const newTransactions: Transaction[] = [];

    for (let i = 0; i < installments; i++) {
      const pDate = new Date(baseDate);
      pDate.setMonth(baseDate.getMonth() + i);

      newTransactions.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        desc: installments > 1 ? `${desc} (${i + 1}/${installments})` : desc,
        amount: installments > 1 ? amount / installments : amount,
        category: cardId ? 'cartao' : category,
        date: pDate.toISOString().split('T')[0],
        type,
        cardId,
        installmentInfo: installments > 1 ? { current: i + 1, total: installments } : undefined,
      });
    }

    setTransactions(prev => [...prev, ...newTransactions]);
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const addCreditCard = useCallback((card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setCreditCards(prev => [...prev, newCard]);
    return newCard;
  }, []);

  const removeCreditCard = useCallback((id: string) => {
    setCreditCards(prev => prev.filter(c => c.id !== id));
    setTransactions(prev => prev.filter(t => t.cardId !== id));
  }, []);

  const getCardInvoice = useCallback((cardId: string, month: number, year: number) => {
    const cardTransactions = transactions.filter(t => {
      if (t.cardId !== cardId) return false;
      const tDate = new Date(t.date + 'T12:00:00');
      return tDate.getMonth() === month && tDate.getFullYear() === year;
    });

    return {
      cardId,
      month,
      year,
      transactions: cardTransactions,
      totalAmount: cardTransactions.reduce((acc, t) => acc + t.amount, 0),
      isPaid: false,
    };
  }, [transactions]);

  const getTotals = useCallback(() => {
    const filtered = getFilteredTransactions();
    let income = 0;
    let expense = 0;

    filtered.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    // Calculate total balance including card invoices
    const totalBalance = transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);

    return { income, expense, balance: totalBalance };
  }, [getFilteredTransactions, transactions]);

  const getCardsTotalUsed = useCallback((cardId: string) => {
    const now = new Date();
    return transactions
      .filter(t => {
        if (t.cardId !== cardId) return false;
        const tDate = new Date(t.date + 'T12:00:00');
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      })
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  return {
    transactions,
    creditCards,
    viewDate,
    isLoaded,
    changeMonth,
    getFilteredTransactions,
    addTransaction,
    removeTransaction,
    addCreditCard,
    removeCreditCard,
    getCardInvoice,
    getTotals,
    getCardsTotalUsed,
  };
}
