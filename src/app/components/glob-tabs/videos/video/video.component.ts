import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {VideoService} from '../../../../services/video.service';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
@Input() video;
@Output() deleteVideo = new EventEmitter();

  constructor(
    private videoService: VideoService,
  ) {

  }

  ngOnInit() {


  }


  delete(id) {
    this.videoService.deleteVideo(id).subscribe( res => {
      this.deleteVideo.emit(id);
      console.log(res);
    });
  }
}
