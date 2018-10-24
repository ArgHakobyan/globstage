import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {appConfig} from '../app.config';

@Injectable()
export class VideoService {

  constructor(
    private http: HttpClient
  ) {
  }

  getVideos() {
    return this.http.get(`${appConfig.apiUrl}/videos`);
  }

  addVideo(video) {
    return this.http.post(`${appConfig.apiUrl}/posts`, video);
  }

  deleteVideo(id) {
    return this.http.delete(`${appConfig.apiUrl}/posts/${id}`);
  }

  getUserVideos(username) {
    return this.http.get(`${appConfig.apiUrl}/posts/video/${username}`);
  }

}
