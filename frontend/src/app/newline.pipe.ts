import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newline'
})
export class NewlinePipe implements PipeTransform {

  transform(value: string, every: number = 32): string {
    if (!value) return value;
    const regex = new RegExp(`.{1,${every}}`, 'g');
    const matches = value.match(regex);
    return matches ? matches.join('<br>') : value;
  }
}
