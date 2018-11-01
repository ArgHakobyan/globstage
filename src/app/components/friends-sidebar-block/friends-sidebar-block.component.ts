import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { FriendsService } from '../../services/friends.service';


@Component({
  selector: 'app-friends-sidebar-block',
  templateUrl: './friends-sidebar-block.component.html',
  styleUrls: ['./friends-sidebar-block.component.scss']
})
export class FriendsSidebarBlockComponent implements OnInit, OnChanges {

  public friends;
  public follower;
  public groups;
  @Input() userId;
  @Input() user;
  friendsOnline: any[];
  allFriendsVisible = false;

  constructor(private friendService: FriendsService) { }

  ngOnInit() {
    console.log(this.user);
    
    this.friendService.getFriends(this.userId).subscribe(res => {
      this.friends = res;
    });
  }

  ngOnChanges() {
    this.friendService.getFriends(this.userId).subscribe(res => {
      this.friends = res;
    });
  }

  showAllFriends() {
    this.allFriendsVisible = true;
  }

  showFourFriends() {
    this.allFriendsVisible = false;
  }


}
