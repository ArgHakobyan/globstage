import { Component, OnInit } from '@angular/core';
import { FriendsService } from "../../services/friends.service";
import {getFromLocalStorage} from "../../utils/local-storage";


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  friends: any[];
  friendRequests: any[];
  
  constructor(private friendService: FriendsService,) { }


  ngOnInit() {
    this.friendService.getFriends(getFromLocalStorage('GLOBE_USER').id).subscribe((res: any[]) => {
      this.friends = res;
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

  // friendDelete(id){
  //   this.friends.push(this.friendRequests.filter(a => {
  //     return  a.id === id;
  //   })[0]);

  //   this.friendRequests = this.friendRequests.filter(a => {
  //     return  a.id !== id;
  //   });    
  // }


}
