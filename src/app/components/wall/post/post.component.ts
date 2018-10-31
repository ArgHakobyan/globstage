import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PostsService} from '../../../services/posts.service';
import {getFromLocalStorage} from '../../../utils/local-storage';
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryLayout} from 'ngx-gallery';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material';
import { DeleteConfirmationComponent } from '../../../components/delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: any;
  @Output() onDelete = new EventEmitter<any>();
  user;
  videos = [];
  audios = [];
  userId;
  like;
  public allVotes = 0;

  constructor(
      private postService: PostsService,
      public snackBar: MatSnackBar,
      public dialog: MatDialog,
      ) {
  }

  ngOnInit() {
    this.user = getFromLocalStorage('GLOBE_USER');
    if (this.post.posttype === 'vote' && this.post.questions) {
      let totalVotes = 0;
      this.post.questions.forEach(question => {
        totalVotes = totalVotes + question.vote_count;
        this.allVotes = totalVotes;
      });
      this.post.questions.forEach(question => {
        question.percent = 100 * question.vote_count / totalVotes;
      });
    }
  }

  addAudio(post){
    post.posttype = 'audio';
    post.post_attchments = [],
    post.post_content = post.post_title,
    post.post_link = post.post_link,
    post.post_privacy = 1,
    this.postService.shareGoogleNews(post).subscribe( res => {
      this.snackBar.open('The audio is on your wall now!.', 'ok', {duration: 3000});
    });
  }

  addLike() {
    let mn = this.postService.addLike({
      action: 'like',
      post_id: this.post.id,
      type: 'post'
    }).subscribe(res => {
      this.post.post_like_count++;
      this.user = getFromLocalStorage('GLOBE_USER');
      if (res.body.message === 'liked') {
        this.post.likes_dislikes.push({user: this.user, user_id: this.user.id, status: 'like'});
        }
    });
  }

  disLike() {
    let mn = this.postService.disLike({
      action: 'dislike',
      post_id: this.post.id,
      type: 'post'
    }).subscribe(res => {
      this.post.post_dislike_count++;
      this.user = getFromLocalStorage('GLOBE_USER');
      if (res.body.message === 'disliked') {
        this.post.likes_dislikes.push({user: this.user, user_id: this.user.id, status: 'dislike'});
        }
    });
  }

  deleteWallPost(post) {
    const id = post.id;
    if (post.posttype === 'post') {
      this.postService.deleteWallPost(id).subscribe(res => {
        this.onDelete.emit({message: 'postDeleted', id: id});
      }, err => {
        this.onDelete.emit({message: 'postDeleted', id: id});
      });
    } else  {
      post.hide_from_wall = 0;
      this.postService.hidePostOnWall(post).subscribe( res => {
        this.post.hide_from_wall = 0;
        console.log(res);
      });
    }
  }

  openDialogDelete() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteWallPost(this.post);
      }
    });
  }


  selectQuest(id) {
    this.userId = getFromLocalStorage('GLOBE_USER').id;
    this.postService.selectQuest({
      author_id: this.userId,
      post_id: this.post.id,
      question_id: id,
    }).subscribe(res => {

    });
  }

  repost(post) {
    console.log(post);
    post.post_type = 'post';
    post.post_attchments = post.attchments;
    this.postService.shareGoogleNews(post).subscribe( res => {
      this.snackBar.open('The post is on your wall now!.', 'ok', {duration: 3000});
    });
  }

}
