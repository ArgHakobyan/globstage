import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {getFromLocalStorage} from '../../../../utils/local-storage';
import {FormControl, FormGroup} from '@angular/forms';
import {CommentService} from '../../../../services/comment.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

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
  ) {
  }

  ngOnInit() {
    console.log(this.comment);
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
      this.snackBar.open('Comment added.', 'ok', {duration: 3000});
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
    this.commentService.deleteComment(id).subscribe(res => {
      this.snackBar.open('Comment is successfully deleted.', 'ok', {duration: 3000});
      this.onDelete.emit(id);
    }, err => {
      this.snackBar.open('Comment can not be deleted.', 'ok', {duration: 3000});
    });
  }

  filterReplies(id) {
    this.replies = this.replies.filter(r => r.id !== id);
    this.snackBar.open('Comment is successfully deleted.', 'ok', {duration: 3000});
  }

}
