import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../../../services/comment.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {getFromLocalStorage} from '../../../../utils/local-storage';
import { MatSnackBar } from '@angular/material';
import { WallSmilesComponent } from '../../../../components/wall/wall-smiles/wall-smiles.component';
import {EmojifyPipe} from '../../../ng-chat/pipes/emojify.pipe';



@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  entryComponents: [
    WallSmilesComponent],
})
export class CommentsComponent implements OnInit {

  formgroupComment: FormGroup;
  @Input() postId;
  @Input() post;
  // public  comments;
  // public post;
  smileOpen = false;
  public activeClass;
  public userAvatar = '';
  public smileClass = '';
  public replayInput = false;
  user;
  user_comment;
  constructor(
    private commentService: CommentService,
    public snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    this.formgroupComment = new FormGroup({
      user_comment: new FormControl('', Validators.required)
    });
    this.userAvatar = getFromLocalStorage('GLOBE_USER').user_photo || '/assets/imgs/no_ava_50.png';
    this.user = getFromLocalStorage('GLOBE_USER');

  }

  keyPress(e){
    console.log(e);
  }

  focusFunction() {
    this.activeClass = 'focus';
  }

  focusOutFunction() {
    // this.activeClass = '';
  }


  postComment() {
    if(this.formgroupComment.valid){
      let mn = this.commentService.postComment({
        comment_content: this.formgroupComment.get('user_comment').value,
        comment_post_id:  this.post.id,
        comment_for: 'post',
      }).subscribe((res: any) => {
        console.log(res);
        
        this.smileClass = '';
        this.formgroupComment.get('user_comment').setValue('');
        res.user = getFromLocalStorage('GLOBE_USER');
        this.post.comments.push(res);
        this.post.post_comment_count++;
        this.snackBar.open('Comment added.', 'ok', {duration: 3000});
      });
    }else{
      console.log('test');
      
    }
  }

  filterComments(e) {
    console.log(e);
    this.post.comments = this.post.comments.filter(c => c.id !== e);
  }

  getAllComments(id) {
    this.commentService.getComments(id).subscribe(comments => {
      this.post.comments = comments;
    });
  }

  openSmiles() {
    this.smileOpen = !this.smileOpen;
  }

  addSmile(e) {
    this.user_comment = this.formgroupComment.get('user_comment').value ? this.formgroupComment.get('user_comment').value + ` *${e}* ` : ` *${e}* `;
    this.user_comment = EmojifyPipe.prototype.transform(this.user_comment, true);
    this.smileOpen = false;
    console.log(e, this.formgroupComment.get('user_comment').value);
  }



}