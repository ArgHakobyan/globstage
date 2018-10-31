import {Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { MatSnackBar } from '@angular/material';
import { getFromLocalStorage } from '../../utils/local-storage';
import { ChatService } from '../../services/chat.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile-image',
  templateUrl: './user-profile-image.component.html',
  styleUrls: ['./user-profile-image.component.scss']
})
export class UserProfileImageComponent implements OnInit, OnChanges {

  @Input() userId;
  @Input() user;
  public username;
  isFriend = false;
  following = false;
  blocking = false;

  constructor(
    private friendService: FriendsService,
    public snackBar: MatSnackBar,
    private chatService: ChatService,
    public translate: TranslateService,
  ) {
  }

  ngOnInit() {
    console.log(this.user);
    
    if (this.user.friends && this.user.friends.filter(u => u.id === getFromLocalStorage('GLOBE_USER').id).length > 0) {
      this.isFriend = true;
    }

    this.username = getFromLocalStorage('GLOBE_USER').username;
    // console.log(this.username + ' ' + this.user.username);


    // if (this.user.friends && this.user.friends.filter(u => u.id === getFromLocalStorage('GLOBE_USER').id)[0] && this.user.friends.filter(u => u.id === getFromLocalStorage('GLOBE_USER').id)[0].subscription === 1) {
    //   this.following = true;
    // }

    if (this.user.follow) {
      this.following = true;
    }
    if (this.user.user_blocked) {
      this.blocking = true;
    } else {
      this.blocking = false;
    }

  }

  ngOnChanges() {
    if (this.user.friends && this.user.friends.filter(u => u.id === getFromLocalStorage('GLOBE_USER').id).length > 0) {
      this.isFriend = true;
    } else {
      this.isFriend = false;
    }


    if (this.user.friends && this.user.friends.filter(u => u.id === getFromLocalStorage('GLOBE_USER').id)[0] && this.user.friends.filter(u => u.id === getFromLocalStorage('GLOBE_USER').id)[0].subscription === 1) {
      this.following = true;
    } else {
      this.following = false;
    }

  }

  @HostListener('sendMessage')
  sendMessage() {
    this.chatService.toggle(this.user);
  }

  addFriend() {
    this.friendService.addFriend(this.user.id).subscribe(res => {
          this.isFriend = true;
        this.snackBar.open(`Friend request sent to ${this.user.user_name}.`, 'ok', {duration: 3000});
    },
      error => {
        this.snackBar.open(`You already sent a friend request to ${this.user.user_name}.`, 'ok', {duration: 3000});
      });
  }



  removeFriend() {
    this.friendService.deleteFriend(this.user.id).subscribe(res => {
      this.snackBar.open(`You deleted ${this.user.user_name} from your friends list.`, 'ok', {duration: 3000});
      this.isFriend = false;
    });
  }

  addFollow() {
    this.friendService.addFollow({
      author_id: getFromLocalStorage('GLOBE_USER').id, user_id: getFromLocalStorage('GLOBE_USER').id,
      follow_to: this.user.id, to: 'user'
    }).subscribe(res => {
      this.snackBar.open(`You are following ${this.user.user_name}  now.`, 'ok', {duration: 3000});
      this.following = true;
    });
  }

  deleteFollow() {
    this.friendService.deleteFollow(this.user.id, 'user').subscribe(res => {
      this.snackBar.open(`You are not following ${this.user.user_name} now.`, 'ok', {duration: 3000});
      this.following = false;
    });
  }

  blockUser() {
    this.friendService.blockUser(this.user.id).subscribe(res => {
      this.snackBar.open(`You have blocked ${this.user.user_name}.`, 'ok', {duration: 3000});
      this.blocking = true;
    });
  }

  unblockUser() {
    this.friendService.unblockUser(this.user.id).subscribe(res => {
      this.snackBar.open(`You have unlocked ${this.user.user_name}.`, 'ok', {duration: 3000});
      this.blocking = false;
    });
  }

}

