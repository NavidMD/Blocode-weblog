import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianDate',
  standalone: true
})
export class PersianDatePipe implements PipeTransform {
  transform(date: string): string {
    const convertingDate = new Date(date);
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(convertingDate);
  }
}
