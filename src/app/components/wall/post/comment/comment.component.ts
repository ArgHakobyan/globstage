import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getFromLocalStorage } from '../../../../utils/local-storage';
import { FormControl, FormGroup } from '@angular/forms';
import { CommentService } from '../../../../services/comment.service';
import { MatSnackBar } from '@angular/material';
import { DeleteConfirmationComponent } from '../../../../components/delete-confirmation/delete-confirmation.component';
import {MatDialog} from '@angular/material';
import {PostsService} from '../../../../services/posts.service';



@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() post;
  @Input() comment: any;
  @Output() onDelete = new EventEmitter();
  public user;
  public userAvatar;
  public replayInput = false;
  public formgroupComment: FormGroup;
  public smileClass = '';
  public replies = [];

  constructor(
    private commentService: CommentService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private postService: PostsService,
  ) {
  }

  ngOnInit() {
    this.userAvatar = getFromLocalStorage('GLOBE_USER').user_photo || '/assets/imgs/no_ava_50.png';
    this.user = getFromLocalStorage('GLOBE_USER');

    this.formgroupComment = new FormGroup({
      user_comment: new FormControl()
    });

  }

  repComment() {
    this.replayInput = true;
  }

  closeInput() {
    this.replayInput = false;
  }

  postComment() {
    let mn = this.commentService.postComment({
      comment_content: this.formgroupComment.get('user_comment').value,
      comment_post_id: this.comment.comment_post_id,
      comment_for: 'comment',
      parent: this.comment.id
    }).subscribe((res: any) => {
      this.smileClass = '';
      this.formgroupComment.get('user_comment').setValue('');
      res.user = getFromLocalStorage('GLOBE_USER');
      this.replies.push(res);
      this.snackBar.open('Comment added.', 'ok', { duration: 3000 });
    });
  }

  getReplies() {
    this.commentService.getReplies(this.comment.id).subscribe((replies: any[]) => {
      this.replies = replies;
    });
  }

  hideReplies() {
    this.replies = [];
  }

  deleteComment(id) {
    console.log(this.post);
      this.commentService.deleteComment(id).subscribe(res => {
        this.post.post_comment_count--;
        this.snackBar.open('Comment is successfully deleted.', 'ok', { duration: 3000 });
        this.onDelete.emit(id);
      }, err => {

        this.snackBar.open('Comment can not be deleted.', 'ok', { duration: 3000 });
        console.log(err);
      });
  }

  openDialogDelete() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteComment(this.comment.id);
      }
    });
  }

  filterReplies(id) {
    this.replies = this.replies.filter(r => r.id !== id);
    this.snackBar.open('Comment is successfully deleted.', 'ok', { duration: 3000 });
  }

  addLikeComm() {
    let mn = this.postService.addLikeCom({
      action: 'like',
      post_id: this.comment.id,
      type: 'comment'
    }).subscribe(res => {
      this.comment.comment_like_count = this.comment.comment_like_count ? this.comment.comment_like_count + 1 : 1;
      this.user = getFromLocalStorage('GLOBE_USER');
      if (res.body.message === 'liked') {
        if (this.comment.likes_dislikes) {
          this.comment.likes_dislikes.push({user: this.user, user_id: this.user.id, status: 'like'});
        } else {
          this.comment.likes_dislikes = [{user: this.user, user_id: this.user.id, status: 'like'}];
        }
      }
    });
  }

  disLikeComm() {
    let mn = this.postService.disLikeComm({
      action: 'dislike',
      post_id: this.comment.id,
      type: 'comment'
    }).subscribe(res => {
      this.comment.comment_dislike_count = this.comment.comment_dislike_count ? this.comment.comment_dislike_count + 1 : 1;
      this.user = getFromLocalStorage('GLOBE_USER');
      if (res.body.message === 'disliked') {
        if (this.comment.likes_dislikes) {
          this.comment.likes_dislikes.push({user: this.user, user_id: this.user.id, status: 'dislike'});
        } else {
          this.comment.likes_dislikes = [{user: this.user, user_id: this.user.id, status: 'dislike'}];
        }
      }
    });
  }

}
