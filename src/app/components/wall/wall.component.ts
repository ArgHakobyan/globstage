import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {  HttpService} from '../../services/http.service';
import { PostsService } from '../../services/posts.service';
import { getFromLocalStorage } from '../../utils/local-storage';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],

})
export class WallComponent implements OnInit, OnChanges {
  wallPosts = [];
  @Input() wallId;
  @Input() groupId;
  constructor(
    private http: HttpService,
    private postsService: PostsService
  ) {

    }

  ngOnInit() {
    this.updateWall();
  }

  ngOnChanges() {
    this.updateWall();
  }

  updateWall() {
    if (this.wallId) {
      this.postsService.getWallPosts(this.wallId).subscribe(
        posts => {
          this.wallPosts = posts.body;
        }
      );
    }
    if (this.groupId) {
      this.postsService.getGroupPosts(this.groupId).subscribe(
        posts => {
          this.wallPosts = posts.body;
        }
      );
    }
  }

  messageDeleted(e) {
    this.wallPosts = this.wallPosts.filter(p => p.id !== e.id);
  }
}
