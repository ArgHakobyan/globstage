import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserUploadImageComponent } from '../../components/user-upload-image/user-upload-image.component';
import { getFromLocalStorage } from '../../utils/local-storage';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  entryComponents: [
    UserUploadImageComponent
    ],
})
export class ProfileImageComponent implements OnInit {

  public user = {};
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.user = getFromLocalStorage('GLOBE_USER');
  }

  openDialogUpload() {
    const dialogRef = this.dialog.open(UserUploadImageComponent, {
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
