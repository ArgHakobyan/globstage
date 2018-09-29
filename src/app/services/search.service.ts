import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {appConfig} from '../app.config';

@Injectable()
export class SearchService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  getSearchResults(q, type) {
    let model = '';
    switch(type) {
      case 'users':
        model = 'user';
        break;
      case 'videos':
        model = 'video';
        break;
      case 'audios':
        model = 'audio';
        break;
      case 'notes':
        model = 'note';
        break;
      case 'group':
        model = 'group';
        break;
      case 'posts':
        model = 'post';
        break;
    }
    return this.http.get(`${appConfig.apiUrl}/searchs?type=${model}&q=${q}`, );
  }

  searchGroups(searchGroup){
    return this.http.get(`${appConfig.apiUrl}/groups?filter[group_name]=`+searchGroup );
  }


}
