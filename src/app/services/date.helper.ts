export class DateHelper {
  static formatDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); 
    return dateObj? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(dateObj).replace(/,/g, '') : '';
  }

  static setDateRangeString(startDate: string, endDate: string){
    return `${DateHelper.formatDate(startDate)} — ${DateHelper.formatDate(endDate)}`
  }
}