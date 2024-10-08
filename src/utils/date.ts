export function formatDatetime(datetime: string) {
    const date = new Date(datetime)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');   
  
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;   
  
  }

export function formatMoney(amount: number) {
    return amount.toLocaleString('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  