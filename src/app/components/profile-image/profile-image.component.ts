import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserUploadImageComponent } from '../../components/user-upload-image/user-upload-image.component';
import { getFromLocalStorage } from '../../utils/local-storage';
import {UserCropImageComponent} from '../user-crop-image/user-crop-image.component';
import {UserService} from '../../services/user.service';


@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  entryComponents: [
    UserUploadImageComponent
    ],
})
export class ProfileImageComponent implements OnInit {
  public user;
  public user_photo;
  public userPhoto = false;
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
  ) { }

  ngOnInit() {
    this.user = getFromLocalStorage('GLOBE_USER');
    this.userPhoto = getFromLocalStorage('GLOBE_USER').user_photo;
    // window.addEventListener('scroll', this.getScrollPosition, true); 
        
  }

  openDialogUpload() {
    const dialogRef = this.dialog.open(UserUploadImageComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.user.user_photo = result.user_photo;
      console.log(result);
    });
  }

  openDialogCrop() {
    const dialogRef = this.dialog.open(UserCropImageComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.user.user_photo = result.user_photo;
    });
  }

  deletePhoto(id){
    this.userService.deleteUserPhoto(id).subscribe( res => {
      this.user.user_photo = '';
    });

  }

  // getScrollPosition(e){
  //   let avatar = document.getElementById('userAvatar');
  //   let wallHeight = document.getElementById('wallContent');
  //   let homeContent = document.getElementById('homeContent');
  //   // homeContent.style.maxHeight = wallHeight.clientHeight + 'px';
  //   if( e.srcElement.scrollTop +200 > e.srcElement.clientHeight){
  //     avatar.style.position = 'relative';
  //     avatar.style.top = e.srcElement.scrollTop + 'px';
  //   }else{
  //     avatar.style.position = 'relative';
  //     avatar.style.top = 0 + 'px';
  //   }   
  // }

}
