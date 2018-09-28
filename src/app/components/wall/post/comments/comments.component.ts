import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../../../services/comment.service';
import {FormControl, FormGroup} from "@angular/forms";
import {getFromLocalStorage} from "../../../../utils/local-storage";
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  formgroupComment: FormGroup;
  @Input() postId;
  @Input() post;
  // public  comments;
  // public post;
  public activeClass;
  public userAvatar = '';
  public smileClass = '';
  user;
  constructor(
    private commentService: CommentService,
    public snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    this.formgroupComment = new FormGroup({
      user_comment: new FormControl()
    });
    this.userAvatar = getFromLocalStorage('GLOBE_USER').user_photo || '/assets/imgs/no_ava_50.png';
    this.user = getFromLocalStorage('GLOBE_USER');
  }

  focusFunction() {
    this.activeClass = 'focus';
  }

  focusOutFunction(){
    // this.activeClass = '';
  }

  postComment() {
    let mn = this.commentService.postComment({
      comment_content: this.formgroupComment.get('user_comment').value,
      comment_post_id:  this.post.id,
      comment_for: 'post',
    }).subscribe((res: any) => {
      this.smileClass = '';
      this.formgroupComment.get('user_comment').setValue('');
      res.user = getFromLocalStorage('GLOBE_USER');
      this.post.comments.push(res);
      this.snackBar.open('Comment added.', 'ok', {duration: 3000});
    });
  }

  deleteComment(id){
    this.commentService.deleteComment(id).subscribe(res => {
      this.post.comments = this.post.comments.filter(c => c.id !== id);
      this.snackBar.open('Comment is successfully deleted.', 'ok', {duration: 3000});
    }, err => {
      this.snackBar.open('Comment can not be deleted.', 'ok', {duration: 3000});
    });
  }
}

