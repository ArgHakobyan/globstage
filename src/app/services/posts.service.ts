import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from './http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { appConfig } from '../app.config';

@Injectable()
export class PostsService {
  constructor(
    private router: Router,
    private http: HttpService,
  ) {
  }

  getWallPosts(id) {
    return this.http.get(`/posts/wall/${id}`);
  }

  deleteWallPost(id) {
    return this.http.delete(`/posts/${id}`);
  }

  hidePostOnWall(post) {
    return this.http.put(`/posts/${post.id}`, post);
  }

  getGroupPosts(id) {
    return this.http.get(`/posts?filter[post_group_id]=${id}`);
  }

  getAudiosPosts(id) {
    return this.http.get(`/posts?filter[posttype]=audio&filter[post_user_id]=${id}`);
  }

  createWallPost(post) {
    return this.http.post('/posts', post);
  }

  addLike(like){
    return this.http.post(`/likes`, like);
  }

  disLike(dislike){
    return this.http.post(`/likes`, dislike);
  }

  getNews() {
    return this.http.get(`/followers/news`);
  }

  addPoll(poll){
    return this.http.post(`/posts`, poll);
  }

  selectQuest(vote) {
    return this.http.post('/votes', vote);
  }

  updateWallPost(post) {
    return this.http.put(`/posts/${post.id}`, post);
  }


  shareGoogleNews(post) {
    post.comments = [];
    return this.http.post(`/posts/share-post`, post);
  }

}
