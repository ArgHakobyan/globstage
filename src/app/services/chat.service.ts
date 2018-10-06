import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpService } from './http.service';


@Injectable()
export class ChatService {

  constructor(
    private http: HttpService,

  ) {
  }

  isOpen = false;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle(user) {

    this.change.emit(user);
  }

  getMessageNotify() {
    return this.http.get(`/notifications/get-messages`);
  }

}
