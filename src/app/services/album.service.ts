import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { appConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(
    private http: HttpClient
  ) { }

  createAlbum(album) {
    return this.http.post(`${appConfig.apiUrl}/posts`, album);
  }

  getAlbums() {
    return this.http.get(`${appConfig.apiUrl}/posts/album/${JSON.parse(localStorage.getItem('GLOBE_USER')).username}`);
  }

  getAlbumsImages(id) {
    return this.http.get(`${appConfig.apiUrl}/posts/${id}`);
  }

  updateAlbum(updateAlb) {
    return this.http.post(`${appConfig.apiUrl}/posts/update-files`, updateAlb);
  }

  deleteImage(id) {
    return this.http.delete(`${appConfig.apiUrl}/files/${id}`);
  }

  getUserAlbums(id) {
    return this.http.get(`${appConfig.apiUrl}/posts/album/${id}`);
  }

  saveAlbumPriv(albumPriv, id) {
    return this.http.put(`${appConfig.apiUrl}/posts/${id}`, albumPriv);
  }

}
