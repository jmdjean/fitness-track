import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDuration',
    standalone: false
})
export class FormatDurationPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min e ${seconds} seg`;
  }
}
