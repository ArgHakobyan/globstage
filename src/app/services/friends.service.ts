import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { appConfig } from '../app.config';
import {getFromLocalStorage} from "../utils/local-storage";
import {RequestOptions} from "@angular/http";

@Injectable()
export class FriendsService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  addFriend(id) {
    return this.http.post(`${appConfig.apiUrl}/friends`, {friend_id: id});
  }

  getFriends(id){
    return this.http.get(`${appConfig.apiUrl}/friends/${id}`);
  }

  getNotification() {
    return this.http.get(`${appConfig.apiUrl}/notifications/get-notifications`);
  }

  readReq(id){
    return this.http.put(`${appConfig.apiUrl}/notifications/${id}`, {'read_status': 1});
  }

  
  getFriendRequests(){
    return this.http.get(`${appConfig.apiUrl}/friends?filter[subscription]=0&filter[friend_id]=${getFromLocalStorage('GLOBE_USER').id}`);
  }

  deleteFriend(id){
    return this.http.delete(`${appConfig.apiUrl}/friends/${id}`);
  }

  confirmFriend(body){
    return this.http.post(`${appConfig.apiUrl}/friends/confirm`, body);
  }

  unConfirmFriend(body){
    return this.http.post(`${appConfig.apiUrl}/friends/unconfirm`, body);
  }

  addFollow(body){
    return this.http.post(`${appConfig.apiUrl}/followers`, body);
  }

  deleteFollow(id, type: string){
    return this.http.request('delete', `${appConfig.apiUrl}/followers/${id}`, {body: {to: type}} );
  }

  blockUser(id){
    return this.http.post(`${appConfig.apiUrl}/block-users`, {'block_user': id,
      'blocked_by':'user' });
  }

  unblockUser(id) {
    return this.http.delete(`${appConfig.apiUrl}/block-users/${id}`);
  }
}
