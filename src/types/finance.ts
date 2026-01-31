export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'moradia'
  | 'alimentacao'
  | 'transporte'
  | 'saude'
  | 'lazer'
  | 'contas'
  | 'salario'
  | 'investimento'
  | 'educacao'
  | 'streaming'
  | 'cartao'
  | 'outros';

export interface Transaction {
  id: string;
  desc: string;
  amount: number;
  category: Category;
  date: string;
  type: TransactionType;
  cardId?: string;
  installmentInfo?: {
    current: number;
    total: number;
  };
}

export interface CreditCard {
  id: string;
  name: string;
  lastDigits: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

export interface CardInvoice {
  cardId: string;
  month: number;
  year: number;
  transactions: Transaction[];
  totalAmount: number;
  isPaid: boolean;
}

export const CATEGORY_CONFIG: Record<Category, { 
  label: string; 
  color: string; 
  icon: string;
}> = {
  moradia: { 
    label: 'Moradia', 
    color: 'hsl(268 56% 66%)',
    icon: 'M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm5 15h-2v-6H9v6H7v-7.81l5-4.5 5 4.5V18z'
  },
  alimentacao: { 
    label: 'Alimentação', 
    color: 'hsl(38 92% 50%)',
    icon: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z'
  },
  transporte: { 
    label: 'Transporte', 
    color: 'hsl(217 91% 60%)',
    icon: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'
  },
  saude: { 
    label: 'Saúde', 
    color: 'hsl(0 84% 60%)',
    icon: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z'
  },
  lazer: { 
    label: 'Lazer', 
    color: 'hsl(330 81% 60%)',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'
  },
  contas: { 
    label: 'Contas', 
    color: 'hsl(239 84% 67%)',
    icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'
  },
  salario: { 
    label: 'Salário', 
    color: 'hsl(160 84% 39%)',
    icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z'
  },
  investimento: { 
    label: 'Investimento', 
    color: 'hsl(189 94% 43%)',
    icon: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.49z'
  },
  educacao: { 
    label: 'Educação', 
    color: 'hsl(271 91% 65%)',
    icon: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z'
  },
  streaming: { 
    label: 'Streaming', 
    color: 'hsl(0 100% 64%)',
    icon: 'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z'
  },
  cartao: { 
    label: 'Cartão', 
    color: 'hsl(240 60% 55%)',
    icon: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'
  },
  outros: { 
    label: 'Outros', 
    color: 'hsl(215 16% 47%)',
    icon: 'M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z'
  }
};

export const CARD_COLORS = [
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Laranja', value: '#f59e0b' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Ciano', value: '#06b6d4' },
];
