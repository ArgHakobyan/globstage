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
    return this.http.get(`${appConfig.apiUrl}/audios/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`);
  }

  addAudio(audio){
    return this.http.post(`${appConfig.apiUrl}/audios`, audio);
  }

  addAudioComp(audio){
    return this.http.post(`${appConfig.apiUrl}/audios`, audio);
  }

  getUserAudios(id) {
    return this.http.get(`${appConfig.apiUrl}/audios/${id}`);
  }

}
