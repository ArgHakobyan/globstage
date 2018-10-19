import {Component, OnInit, Input} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {VideoService} from '../../services/video.service';
import {PostsService} from '../../services/posts.service';
import {EmbedVideoService} from '../../services/embed-video.service';

@Component({
  selector: 'app-new-video-modal',
  templateUrl: './new-video-modal.component.html',
  styleUrls: ['./new-video-modal.component.scss']
})
export class NewVideoModalComponent implements OnInit {
  @Input() videoPost;
  videosPosts = [];
  selected3 = '1';
  public newpostvideo: FormGroup;
  public selectmembers = {};
  thumbUrl;

  constructor(
    public dialogRef: MatDialogRef<NewVideoModalComponent>,
    public videoServices: VideoService,
    public postServices: PostsService,
    private embedVideoService: EmbedVideoService
  ) {

  }

  ngOnInit() {
    this.newpostvideo = new FormGroup({
      linkvideo: new FormControl('', Validators.required),
      namevideo: new FormControl(''),
      descvideo: new FormControl(),
      selectmembers: new FormControl('1'),
    });

    this.newpostvideo.get('linkvideo').valueChanges.subscribe(val => {
      console.log(val);
      this.getThumbnail(val);
    });
  }

  getNotification(name) {
    console.log(name);
  }

  done() {
    if (this.newpostvideo.valid) {
      this.postServices.createWallPost(
        {
          'posttype': 'video',
          'post_content': this.newpostvideo.value.namevideo,
          'post_link': this.newpostvideo.value.linkvideo,
          'post_description': this.newpostvideo.value.descvideo,
          'post_privacy': this.newpostvideo.value.selectmembers,
        }).subscribe(res => {
          console.log(res);
        this.dialogRef.close(res);
      });
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getThumbnail(url) {
    console.log(url);
    if (url && url.match(/youtube.com/) || (url && url.match(/vimeo.com/))) {
      this.thumbUrl = this.embedVideoService.embed(url);
    }
  }


}
