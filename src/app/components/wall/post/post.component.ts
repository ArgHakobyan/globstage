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

  constructor(private postService: PostsService) {
  }

  ngOnInit() {
    this.user = getFromLocalStorage('GLOBE_USER');
    
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
      post_id: this.post.id
    }).subscribe(res => {
      this.post.post_dislike_count++;
    });
  }

  deleteWallPost(id) {
    this.postService.deleteWallPost(id).subscribe(res => {
      this.onDelete.emit({message: 'postDeleted', id: id});
    }, err => {
      this.onDelete.emit({message: 'postDeleted', id: id});
    });
  }

}
