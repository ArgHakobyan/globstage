import {Component, OnChanges, OnInit} from '@angular/core';
import {ChatAdapter} from './components/ng-chat';
import {GlobeAdapter} from './services/chatAdapter';
import {HttpService} from './services/http.service';
import {getFromLocalStorage} from './utils/local-storage';
import {TranslateService} from '@ngx-translate/core';
import {ConfigService} from './services/config.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'app';
  userId = getFromLocalStorage('GLOBE_USER') ? getFromLocalStorage('GLOBE_USER').id : null;
  http: HttpService;
  public adapter: ChatAdapter = this.chatAdapter;

  constructor(
    private chatAdapter: GlobeAdapter,
    public _translate: TranslateService,
    private _config: ConfigService,
  ) {
  }

  ngOnInit(): void {
    this._translate.setDefaultLang('En');
    this._translate.use('En');
    this._config.locale = this._translate.getDefaultLang();
  }

  ngOnChanges() {
    this.userId = getFromLocalStorage('GLOBE_USER') ? getFromLocalStorage('GLOBE_USER').id : null;
  }

  scrollToTop() {
    console.log('scrol');
    $('.background-page').scrollTop(0);
  }
}
