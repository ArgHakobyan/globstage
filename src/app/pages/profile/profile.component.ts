import {Component, Input, OnInit} from '@angular/core';
import {GlobTabsComponent} from '../../components/glob-tabs/glob-tabs.component';
import {WallComponent} from '../../components/wall/wall.component';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {UserUploadImageComponent} from '../../components/user-upload-image/user-upload-image.component';
import {UserCropImageComponent} from '../../components/user-crop-image/user-crop-image.component';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from '../../utils/local-storage';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  entryComponents: [GlobTabsComponent, WallComponent, UserUploadImageComponent, UserCropImageComponent],
})
export class ProfileComponent implements OnInit {

  @Input() userId;
  public user;
  public newStatus = false;
  public status = true;
  public userProfile: any;

  constructor(
      public authService: AuthService,
      public router: Router,
      public dialog: MatDialog,
      private userService: UserService
  ) {
  }

  ngOnInit() {
    this.user = getFromLocalStorage('GLOBE_USER');
    this.userService.getUserByUsername(getFromLocalStorage('GLOBE_USER').username).subscribe((user: any) => {
      this.userProfile = user;
      setToLocalStorage('GLOBE_USER', user);
    });
  }

  logOut() {
    removeFromLocalStorage(['GLOBE_AUTH', 'GLOBE_USER']);
    this.router.navigate(['']);
  }


  openInputWrite() {
    this.newStatus = true;
    this.status = false;
  }

  postStatus() {
    this.userService.updateUserInfo({user_status: this.user.user_status}).subscribe((res: any) => {
      this.newStatus = false;
      this.status = true;
      const usr = getFromLocalStorage('GLOBE_USER');
      usr.user_status = res.user_status;
      this.user.user_status = res.user_status;
      setToLocalStorage('GLOBE_USER', usr);
    });
  }


}
