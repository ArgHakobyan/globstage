import {Injectable} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from './http.service';
import {  filter, take } from 'rxjs/operators';
import {getFromLocalStorage, setToLocalStorage} from '../utils/local-storage';


@Injectable()
export class UserService {
  user = new BehaviorSubject<any>(null);

  constructor(private httpService: HttpService) {
  }

  get userAsync() {
    const a = localStorage.getItem('GLOBE_USER') ? JSON.parse(localStorage.getItem('GLOBE_USER')) : this.user.getValue();

    this.setUser(a);

    return this.user.asObservable();
  }

  get userReady() {
    return this.user.pipe(
      filter(u => !!u),
      take(1));
  }

  setUser(a) {
    this.user.next(a);
    localStorage.removeItem('GLOBE_USER');
    if (!!JSON.stringify(this.user.getValue())) {
      localStorage.setItem('GLOBE_USER', JSON.stringify(this.user.getValue()));
    }
  }

  getUser(id) {
    return  this.httpService.get(`/users/${id}`);
  }
  updateUserInfo(info) {
    return  this.httpService.put('/users', info);
  }
  updateUserContact(contact) {
    return  this.httpService.put('/users/updatecontact', contact);
  }
  updateUserPersonal(personal) {
    return  this.httpService.put('/users/updatepersonalinfo', personal);
  }

}
