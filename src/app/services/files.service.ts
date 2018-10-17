import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {appConfig} from '../app.config';
import { getFromLocalStorage } from '../utils/local-storage';



@Injectable()
export class FilesService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  upload(file) {
    const headers = new HttpHeaders({
      //  'Content-Type': null,
      'Accept': 'multipart/form-data',
    });

    const params = new FormData();

    params.append('file', file);
    return this.http.post(`${appConfig.apiUrl}/files`, params,
        {
          headers: headers,
          withCredentials: true
        });
    // return this.http.post(`${appConfig.apiUrl}/files`, {file: file});
  }
}
