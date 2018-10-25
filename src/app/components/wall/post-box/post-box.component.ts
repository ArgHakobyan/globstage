import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NewAudioModalComponent } from '../../new-audio-modal/new-audio-modal.component';
import { NewPollModalComponent } from '../../new-poll-modal/new-poll-modal.component';
import { NewVideoModalComponent } from '../../new-video-modal/new-video-modal.component';
import { UploadMediaAttachComponent } from '../../upload-media-attach/upload-media-attach.component';
import { getFromLocalStorage } from '../../../utils/local-storage';
import { ChatService } from '../../../services/chat.service';
import { WallSmilesComponent } from '../../../components/wall/wall-smiles/wall-smiles.component';
import {EmojifyPipe} from '../../ng-chat/pipes/emojify.pipe';

@Component({
  selector: 'app-post-box',
  templateUrl: './post-box.component.html',
  styleUrls: ['./post-box.component.scss'],
  entryComponents: [
    NewAudioModalComponent,
    NewPollModalComponent,
    UploadMediaAttachComponent,
    NewVideoModalComponent,
    WallSmilesComponent],
})
export class PostBoxComponent implements OnInit {
  formgroupWall: FormGroup;
  public smileClass = '';
  public userAvatar = '';
  @Input() type;
  @Input() wallId;
  @Input() groupId;
  @Output() postCreated = new EventEmitter<boolean>();
  attachements = [];
  videos = [];
  attached = [];
  smileOpen = false;
  user_wall;
  videosid = [];
  post: any = {};

  constructor(
    private postsService: PostsService,
    public dialog: MatDialog,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.formgroupWall = new FormGroup({
      user_wall: new FormControl()
    });
    this.userAvatar = getFromLocalStorage('GLOBE_USER').user_photo || '/assets/imgs/no_ava_50.png';
  }

  createPost() {
    if (this.wallId) {
      let mn = this.postsService.createWallPost({
        post_type: this.type,
        post_content: this.formgroupWall.get('user_wall').value,
        post_attachments: this.attachements,
        post_wall_id: this.wallId,
        author_id: getFromLocalStorage('GLOBE_USER').id,
        post_user_id: getFromLocalStorage('GLOBE_USER').id,
        post_videos: this.videosid,
      }).subscribe(res => {
        this.smileClass = '';
        this.formgroupWall.get('user_wall').setValue('');
        this.postCreated.emit();
        this.attached = [];
        this.attachements = [];
        this.videos = [];
      });
    }
    if (this.groupId) {
      let mn = this.postsService.createWallPost({
        post_type: this.type,
        post_content: this.formgroupWall.get('user_wall').value,
        post_attachments: this.attachements,
        post_group_id: this.groupId,
        author_id: getFromLocalStorage('GLOBE_USER').id,
        post_user_id: getFromLocalStorage('GLOBE_USER').id,
        post_videos: this.videosid,
      }).subscribe(res => {
        this.smileClass = '';
        this.formgroupWall.get('user_wall').setValue('');
        this.postCreated.emit();
        this.attached = [];
        this.attachements = [];
        this.videos = [];
      });
    }
  }

  updatePost() {
    this.post.post_content = this.formgroupWall.get('user_wall').value;
    this.postsService.updateWallPost(this.post).subscribe( res => {
      this.postCreated.emit();
      this.formgroupWall.get('user_wall').setValue('');
      this.post = {};

    });
  }

  openDialogAttach() {
    const dialogRef = this.dialog.open(UploadMediaAttachComponent, {
      height: 'auto',
      width: '500px',
    });

    dialogRef.componentInstance.onUpload.subscribe((res: any) => {
      this.attachements.push((res).id);
      this.attached.push((res));
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogVideo() {
    const dialogRef = this.dialog.open(NewVideoModalComponent, {
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.post = result.body;
      }
    });
  }

  openDialogAudio() {
    const dialogRef = this.dialog.open(NewAudioModalComponent, {
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogPoll() {
    const dialogRef = this.dialog.open(NewPollModalComponent, {
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postCreated.emit();
      }
    });
  }

  smileFocusFunction() {
    this.smileClass = 'focusSmile';
  }

  smileFocusOutFunction() {
    // this.smileClass = '';
  }

  openSmiles() {
    this.smileOpen = !this.smileOpen;
  }

  addSmile(e) {
    this.user_wall = this.formgroupWall.get('user_wall').value ? this.formgroupWall.get('user_wall').value + ` *${e}* ` : ` *${e}* `;
    this.user_wall = EmojifyPipe.prototype.transform(this.user_wall, true);
    this.smileOpen = false;
    console.log(e, this.formgroupWall.get('user_wall').value);
  }

}
