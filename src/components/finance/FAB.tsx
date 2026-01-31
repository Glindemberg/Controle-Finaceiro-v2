import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/50 flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 active:scale-95 z-40"
    >
      <Plus className="w-8 h-8" />
    </button>
  );
}
