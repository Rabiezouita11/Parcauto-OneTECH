import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  private profileUpdatedSource = new Subject<void>();

  profileUpdated$ = this.profileUpdatedSource.asObservable();

  constructor() {}

  triggerProfileUpdated(): void {
    this.profileUpdatedSource.next();
  }
}
