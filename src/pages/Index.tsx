import { useState } from 'react';
import { useFinances } from '@/hooks/useFinances';
import { 
  Header, 
  TransactionList, 
  TransactionModal, 
  CreditCardsModal, 
  FAB 
} from '@/components/finance';

const Index = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCardsModalOpen, setIsCardsModalOpen] = useState(false);

  const {
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
    getTotals,
    getCardsTotalUsed,
  } = useFinances();

  const { income, expense, balance } = getTotals();
  const filteredTransactions = getFilteredTransactions();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header
        viewDate={viewDate}
        onChangeMonth={changeMonth}
        balance={balance}
        income={income}
        expense={expense}
        onOpenCards={() => setIsCardsModalOpen(true)}
      />

      <TransactionList
        transactions={filteredTransactions}
        allTransactions={transactions}
        onDelete={(id) => {
          if (confirm('Excluir este lançamento?')) {
            removeTransaction(id);
          }
        }}
      />

      <FAB onClick={() => setIsTransactionModalOpen(true)} />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={addTransaction}
        creditCards={creditCards}
      />

      <CreditCardsModal
        isOpen={isCardsModalOpen}
        onClose={() => setIsCardsModalOpen(false)}
        creditCards={creditCards}
        onAddCard={addCreditCard}
        onDeleteCard={removeCreditCard}
        getCardUsed={getCardsTotalUsed}
      />
    </div>
  );
};

export default Index;
