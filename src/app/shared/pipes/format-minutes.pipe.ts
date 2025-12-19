import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMinutes',
})
export class FormatMinutesPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    const minutes = totalSeconds / 60;
    const formatted = minutes.toFixed(1).replace('.', ',');
    return `${formatted} min`;
  }
}
