import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NewVideoModalComponent} from '../../new-video-modal/new-video-modal.component';
import {VideoService} from '../../../services/video.service';
import {VideoPlayerComponent} from '../../video-player/video-player.component';
import {getFromLocalStorage} from '../../../utils/local-storage';

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
    if (window.confirm('Are you sure do you want to delete this audio?')) {
      this.videoServices.deleteVideo(id).subscribe( res => {
        this.videos = this.videos.filter(v => v.id !== id);
        console.log(res);
      });
    }
  }

  playVideo() {
    const dialogRef = this.dialog.open(VideoPlayerComponent, {
      height: 'auto',
      width: '600px'
    });
  }

}
