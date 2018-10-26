import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() userId;
  public user;
  public userBlocked;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private titleService: Title
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.getUserByUsername(params.id).subscribe(user => {
          this.user = user;
            this.titleService.setTitle( this.user.user_name + ' ' +  this.user.user_last_name + ' | GlobStage');
        },
        error => {
          this.userBlocked = true;
        });
    });
  }

}
