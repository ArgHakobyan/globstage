import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FriendsService } from "../../services/friends.service";
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {

  @Input() friend;
  @Output() delFriend = new EventEmitter();
  friendRequests: any[];
  constructor(
    private friendService: FriendsService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  deleteFriend() {
    this.friendService.deleteFriend(this.friend.id).subscribe((res: any[]) => {
      this.friendRequests = res;
      this.delFriend.emit(res);
    });
    this.snackBar.open('Friend deleted', 'ok', { duration: 3000 });
  }

}
