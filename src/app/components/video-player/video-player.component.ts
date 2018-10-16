import {Component, Input, OnInit} from '@angular/core';
import {EmbedVideoService} from '../../services/embed-video.service';
import * as $ from 'jquery';

declare var videojs;

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  player: any;
  @Input() video;
  @Input() url;
  data;

  constructor(
      private embedService: EmbedVideoService
  ) {

  }

  ngOnInit() {
    console.log(this.video);

    setTimeout(() => {
          let settings = {};
          const container = document.getElementById('vid-' + this.video.id);

          if (this.video.link_to_videos.indexOf('youtube.com') > -1) {
            settings = {
              'techOrder': ['youtube'],
              'sources': [
                {
                  'type': 'video/youtube',
                  'src': this.video.link_to_videos
                }
              ]
            };
          } else if (this.video.link_to_videos.indexOf('vimeo.com') > -1) {
            settings = {
              'techOrder': ['vimeo'],
              'sources': [
                {
                  'type': 'video/vimeo',
                  'src': this.video.link_to_videos
                }
              ]
            };
          } else if (this.video.link_to_videos.indexOf('globstage.com') > -1) {
            settings = {
              'techOrder': ['vimeo'],
              'sources': [
                {
                  'type': 'video/vimeo',
                  'src': this.video.link_to_videos
                }
              ],
              'vimeo': { 'color': '#fbc51b'}
            };
          }
          videojs(container, settings);
        },
        500);
  }

}
