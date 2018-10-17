import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NewAlbumModalComponent} from '../../components/new-album-modal/new-album-modal.component';
import {AlbumService} from '../../services/album.service';
import { ActivatedRoute} from '@angular/router';
import {UploadMediaAttachComponent} from '../../components/upload-media-attach/upload-media-attach.component';
import { getFromLocalStorage } from '../../utils/local-storage';
import { UserService} from '../../services/user.service';


@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.scss'],
  entryComponents: [
    UploadMediaAttachComponent],
})
export class AlbumPageComponent implements OnInit {


  album: any = {};
  album_id;
  isMyAlbum = false;
  albumUser: any = {}

  constructor(
    public dialog: MatDialog,
    public albumService: AlbumService,
    private route: ActivatedRoute,
    public userService: UserService
  ) { }

  ngOnInit() {
      this.route.params.subscribe( params => {
        this.album_id = params.id;
        this.albumService.getAlbumsImages(this.album_id).subscribe(res => {
            this.album = res[0];
            if (this.album.author_id === getFromLocalStorage('GLOBE_USER').id) {
              this.isMyAlbum = true;
            } else {
              this.userService.getUser(this.album.author_id).subscribe( user => {
                this.albumUser = user;
              });
            }
            console.log(res);
          });
    });
  }


  openDialogAlbum() {
    const dialogRef = this.dialog.open(NewAlbumModalComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  openDialogAttach() {
    let attaches = [];
    const dialogRef = this.dialog.open(UploadMediaAttachComponent, {
      height: 'auto',
      width: '500px',
    });

    dialogRef.componentInstance.onUpload.subscribe((res: any) => {
      console.log(res);
      attaches.push(res.id);
      console.log(attaches);
    });

    dialogRef.afterClosed().subscribe(result => {
      this.albumService.updateAlbum({'post_id': this.album_id, 'posttype': 'album', files: attaches}).subscribe( res => {
        this.album = res;
        console.log(res);

      });
    });
  }

  delete(id) {
    if(window.confirm('Are sure you want to delete this item ?')) {
      this.albumService.deleteImage(id).subscribe( res => {
        console.log(res);

        this.album.attachments = this.album.attachments.filter(v => v.id !== id);
      });
    }

  }

}
