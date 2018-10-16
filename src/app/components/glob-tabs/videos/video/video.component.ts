import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {VideoService} from '../../../../services/video.service';
import { Plyr } from 'plyr';
// declare var Plyr;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
@Input() video;
@Output() deleteVideo = new EventEmitter();

  constructor(
    private videoService: VideoService
  ) {

  }

  ngOnInit() {
    setTimeout(() => {
      const players = Array.from(document.querySelectorAll('.js-player')).map(p => new Plyr(p));
    });

  }

  delete(id) {
    this.videoService.deleteVideo(id).subscribe( res => {
      this.deleteVideo.emit(id);
    });
  }
}
