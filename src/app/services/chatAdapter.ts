import {Injectable} from '@angular/core';
import {ChatAdapter, Message, User} from '../components/ng-chat';
import {Observable} from 'rxjs/Observable';
import {HttpService} from './http.service';
import {getFromLocalStorage} from '../utils/local-storage';


@Injectable()
export class GlobeAdapter extends ChatAdapter {
  private mockedUsers: User[] = [];


  constructor(private  http: HttpService) {
    super();


  }

  listFriends(): Observable<User[]> {
    return this.http.get('/chats');
  }

  getMessageHistory(user_id: any): Observable<Message[]> {
    let mockedHistory: Array<Message>;

    return this.http.get(`/messages/getmessagebyuserid/${user_id}`);
  }

  sendMessage(message: Message): Observable<any> {


    return this.http.post('/messages', {
      for_id: message.for_id,
      content: message.content,
      attachments: message.attachments
    });
  }




}
