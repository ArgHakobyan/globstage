import { Component, OnInit, Input } from '@angular/core';
import { FriendsService } from "../../services/friends.service";
import { getFromLocalStorage } from "../../utils/local-storage";


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  @Input() friend;
  searchFriend:any = [];
  friends: any[];
  friendRequests: any[];

  constructor(private friendService: FriendsService,) { }


  ngOnInit() {
    this.friendService.getFriends(getFromLocalStorage('GLOBE_USER').id).subscribe((res: any[]) => {
      this.friends = res;
      this.searchFriend = this.friends;
      console.log(res);
    });


    this.friendService.getFriendRequests().subscribe((res: any[]) => {
      this.friendRequests = res;
      console.log(res);
    });

  }

  friendAdded(id){
    console.log(id);
    this.friends.push(this.friendRequests.filter(a => {
      return  a.id === id;
    })[0].user);

    this.friendRequests = this.friendRequests.filter(a => {
      return  a.id !== id;
    });
  }

  searchFriends(e) {
    this.searchFriend = this.friends.filter(res => {
      console.log(res);
      return res.user_name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
   })
  }

  friendDelete(id){
    this.friendService.getFriends(getFromLocalStorage('GLOBE_USER').id).subscribe((res: any[]) => {
      this.friends = res;
      this.searchFriend = this.friends;
      console.log(res);
    });
  }


}
