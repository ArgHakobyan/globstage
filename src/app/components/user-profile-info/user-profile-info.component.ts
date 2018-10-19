import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {log} from 'util';

@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.scss']
})
export class UserProfileInfoComponent implements OnInit {

  public detailsToggle;
  user;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.route.parent.params.subscribe(param => {
      this.userService.getUserByUsername(param.id).subscribe(u => {
        this.user = u;
        this.user.user_contact = JSON.parse(this.user.user_contact);
        this.user.user_interests = JSON.parse(this.user.user_interests);
      });

    });


  }

  show1Toggle() {
    this.detailsToggle = (this.detailsToggle === true) ? false : true;
  }

}
