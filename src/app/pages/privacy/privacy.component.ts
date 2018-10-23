import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  public infoPrivacy: FormGroup;
  public notification: any;
  public location: any;

  constructor(private userService: UserService) {
    this.infoPrivacy = new FormGroup({
      write_messages: new FormControl('1'),
      sees_other_records: new FormControl('1'),
      can_post: new FormControl('1'),
      can_comment: new FormControl('1'),
      basic_info: new FormControl('1'),
      see_guests: new FormControl('1'),
      notification: new FormControl('1'),
      location: new FormControl('1')
    });

   }

  ngOnInit() {
    this.userService.getPrivacy().subscribe((res: any) => {
      this.infoPrivacy = new FormGroup({
        write_messages: new FormControl(res.write_messages ? res.write_messages.toString() : '1'),
        sees_other_records: new FormControl(res.sees_other_record ? res.sees_other_record.toString() : '1'),
        can_post: new FormControl(res.can_post ? res.can_post.toString() : '1'),
        can_comment: new FormControl(res.can_comment ? res.can_comment.toString() : '1'),
        basic_info: new FormControl(res.basic_info ? res.basic_info.toString() : '1'),
        see_guests: new FormControl(res.see_guests ? res.see_guests.toString() : '1'),
        notification: new FormControl(res.notification ? res.notification.toString() : '1'),
        location: new FormControl(res.location ? res.location.toString() : '0'),

      });
      console.log(res);
      console.log(this.infoPrivacy);
    });
  }

  onChange() {
    this.userService.savePrivacy(this.infoPrivacy.value).subscribe(res => {
      console.log(res);
    });
  }

  onChange1() {
    this.userService.reqNot(this.infoPrivacy.value).subscribe(result => {
      console.log(result);
    });
  }

  onChange2() {
    this.userService.reqLocation(this.infoPrivacy.value).subscribe(ret => {
      console.log(ret);
    });
  }
}
