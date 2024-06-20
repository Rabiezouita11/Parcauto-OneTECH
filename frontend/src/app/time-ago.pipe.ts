import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(timestamp: string): string {
    if (!timestamp) return '';

    const now = new Date();
    const then = new Date(timestamp);

    const timeDiff = now.getTime() - then.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `${seconds} s ago`;
    } else if (minutes < 60) {
      return `${minutes} m ago`;
    } else if (hours < 24) {
      return `${hours} h ago`;
    } else if (days < 30) {
      return `${days} d ago`;
    } else if (months < 12) {
      return `${months} month ago`;
    } else {
      return `${years} year ago`;
    }
  }
}
