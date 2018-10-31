import {Component, OnInit, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NewVideoModalComponent} from '../../new-video-modal/new-video-modal.component';
import {VideoService} from '../../../services/video.service';
import {VideoPlayerComponent} from '../../video-player/video-player.component';
import {getFromLocalStorage} from '../../../utils/local-storage';
import { DeleteConfirmationComponent } from '../../../components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  entryComponents: [
    NewVideoModalComponent,
    VideoPlayerComponent
  ],
})


export class VideosComponent implements OnInit {
  videos = [];

  constructor(
    public dialog: MatDialog,
    public videoServices: VideoService,
  ) {
  }

  ngOnInit() {
    this.videoServices.getUserVideos(getFromLocalStorage('GLOBE_USER').username).subscribe((videos: any[]) => {
      this.videos = videos;
      console.log(videos);
    });
  }

  openDialogVideo() {
    const dialogRef = this.dialog.open(NewVideoModalComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.videos.push(result.body);
      }
    });
  }

  delete(id) {
      this.videoServices.deleteVideo(id).subscribe( res => {
        this.videos = this.videos.filter(v => v.id !== id);
        console.log(res);
      });
  }

  openDialogDelete(id) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(id);
      }
    });
  }




  playVideo() {
    const dialogRef = this.dialog.open(VideoPlayerComponent, {
      height: 'auto',
      width: '600px'
    });
  }

}
