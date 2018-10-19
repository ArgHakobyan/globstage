import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PostsService} from '../../../services/posts.service';
import {getFromLocalStorage} from '../../../utils/local-storage';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryLayout } from 'ngx-gallery';


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

  constructor(private postService: PostsService) {
  }

  ngOnInit() {
    this.user = getFromLocalStorage('GLOBE_USER');
    if( this.post.posttype === 'vote'){
      let totalVotes = 0;
      this.post.questions.forEach( question => {
        totalVotes = totalVotes + question.vote_count;
      });
      this.post.questions.forEach( question => {
        question.percent = 100 * question.vote_count / totalVotes ;
      });
    }
  }

  addLike() {
    let mn = this.postService.addLike({
      action: 'like',
      post_id: this.post.id,
      type: 'post'
    }).subscribe(res => {
      this.post.post_like_count++;
    });
  }

  disLike() {
    let mn = this.postService.disLike({
      action: 'dislike',
      post_id: this.post.id,
      type: 'post'
    }).subscribe(res => {
      this.post.post_dislike_count++;
    });
  }

  deleteWallPost(id) {
    if(window.confirm('Are sure you want to delete this post ?')){
      this.postService.deleteWallPost(id).subscribe(res => {
        this.onDelete.emit({message: 'postDeleted', id: id});
      }, err => {
        this.onDelete.emit({message: 'postDeleted', id: id});
      });
    }
   
  }

  selectQuest(id){
    this.userId = getFromLocalStorage('GLOBE_USER').id;
     this.postService.selectQuest({
      author_id: this.userId,
      post_id: this.post.id,
      question_id: id,
    }).subscribe(res => {

    });
  }

  

}
