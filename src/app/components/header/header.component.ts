import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {SearchAllComponent} from '../search-all/search-all.component';
import {TranslateService} from '@ngx-translate/core';
import {FriendsService} from '../../services/friends.service';
import {ChatAdapter} from '../../components/ng-chat';
import {GlobeAdapter} from '../../services/chatAdapter';
import {getFromLocalStorage} from '../../utils/local-storage';
// import {NotificationComponent} from '../../components/notification/notification.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import * as $ from 'jquery';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  friendRequests: any[];
  notRequests: any[];

  @Input()
  public isCollapsed = false;
  public selectedOption = 'En';
  public userId;
  public adapter: ChatAdapter = this.chatAdapter;
  public notificationlength = 0;

  constructor(
      private router: Router,
      public dialog: MatDialog,
      public translate: TranslateService,
      private friendService: FriendsService,
      private chatAdapter: GlobeAdapter,
  ) {

  }

  ngOnInit() {
    this.userId = getFromLocalStorage('GLOBE_USER').id;
    if (this.userId) {
      this.getNotification();
      setInterval(() => {
        this.getNotification();
      }, 40000);
    }

  }

  getNotification() {
    this.friendService.getNotification().subscribe((res: any[]) => {
      this.notRequests = res;
      this.notificationlength = 0;
      res.forEach(element => {
        if (element.read_status === 0) {
          this.notificationlength = this.notificationlength + 1;
        }
      });
    });

  }


  readReq(id) {
    this.friendService.readReq(id).subscribe((res: any[]) => {
    });
  }

  openDialogSearch() {
    const dialogRef = this.dialog.open(SearchAllComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  logOut() {
    localStorage.removeItem('GLOBE_AUTH');
    localStorage.removeItem('GLOBE_USER');
    this.router.navigate(['']);

  }
  scrollToTop() {
    console.log('scrol');
    $('.background-page').scrollTop(0);
  }

  onChatTitleClicked(event: any): void {
    this.isCollapsed = !this.isCollapsed;
  }

  changeLang(e) {
    this.selectedOption = e.value;
    this.translate.use(e.value);
  }

}
