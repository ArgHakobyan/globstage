import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { filter, take } from 'rxjs/operators';
import { getFromLocalStorage, setToLocalStorage } from '../utils/local-storage';
import { appConfig } from '../app.config';

@Injectable()
export class UserService {
  user = new BehaviorSubject<any>(null);
  apiUrl = appConfig.apiUrl;

  constructor(private http: HttpClient) {
  }

  get userAsync() {
    const a = getFromLocalStorage('GLOBE_USER') ? getFromLocalStorage('GLOBE_USER') : this.user.getValue();

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
      setToLocalStorage('GLOBE_USER', this.user.getValue());
    }
  }


  getUser(id) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  getUserByUsername(username) {
    return this.http.get(`${this.apiUrl}/users/views/${username}`);
  }

  updateUserInfo(info) {
    console.log(info);
    
    return this.http.put(`${this.apiUrl}/users/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`, info);
  }

  updateUserContact(contact) {
    return this.http.put(`${this.apiUrl}/users/updatecontact`, contact);
  }

  updateUserPersonal(personal) {
    return this.http.put(`${this.apiUrl}/users/updatepersonalinfo`, personal);
  }

  changeAvatar(img) {
    return this.http.put(`${this.apiUrl}/users`, { 'user_photo': img });
  }

  savePrivacy(privacy) {
    return this.http.put(`${this.apiUrl}/privacys/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`, privacy);
  }

  reqNot(priv) {
    return this.http.put(`${this.apiUrl}/privacys/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`, priv);
  }

  reqLocation(p) {
    return this.http.put(`${this.apiUrl}/privacys/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`, p);
  }

  getPrivacy() {
    return this.http.get(`${this.apiUrl}/privacys`);
  }

  newPassword(newPass) {
    return this.http.put(`${this.apiUrl}/users/updateuser`, newPass);
  }

  newName(nameLastname) {
    return this.http.put(`${this.apiUrl}/users/updateuser`, nameLastname);
  }

  deleteUserPhoto(id) {
    return this.http.put(`${appConfig.apiUrl}/users/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`, { 'user_photo': '' });
  }

}
