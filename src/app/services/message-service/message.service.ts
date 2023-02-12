import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from './models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _messageSubject = new Subject<Message>();
  public message: Observable<Message> = this._messageSubject.asObservable();
  private timeoutId = null;

  constructor() {}

  public setMessage(message: Message): void {
    this._messageSubject.next(message);
  }

  public setMessageWithAutoclose(message: Message): void {
    this._messageSubject.next(message);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.timeoutId = setTimeout(() => {
      this.setMessage(null);
    }, 3000);
    console.log('timeoutId', this.timeoutId);
  }
}
