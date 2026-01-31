export function formatMoney(value: number): string {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

export function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function getMonthLabel(date: Date): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", 
    "Maio", "Junho", "Julho", "Agosto", 
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
