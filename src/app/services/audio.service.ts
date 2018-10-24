import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { appConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(
    private http: HttpClient
  ) { }

  getAudios() {
    return this.http.get(`${appConfig.apiUrl}/posts/audio/${JSON.parse(localStorage.getItem('GLOBE_USER')).username}`);
  }

  addAudio(audio) {
    return this.http.post(`${appConfig.apiUrl}/posts/audio`, audio);
  }

  addDownAudio(audio) {
    return this.http.post(`${appConfig.apiUrl}/posts/audio`, audio);
  }

  getUserAudios(id) {
    return this.http.get(`${appConfig.apiUrl}/posts/audio/${id}`);
  }

}
