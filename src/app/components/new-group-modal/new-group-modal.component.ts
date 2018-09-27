import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { GroupService} from '../../services/group.service';
import {subscribeToArray} from 'rxjs/internal-compatibility';
import {getFromLocalStorage} from '../../utils/local-storage';
@Component({
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.scss']
})
export class NewGroupModalComponent implements OnInit {

  public groupName;
  constructor(
      public dialogRef: MatDialogRef<NewGroupModalComponent>,
      public groupService: GroupService
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createGroup() {
    console.log(this.groupName);
    this.groupService.createGroup({group_name: this.groupName, group_author: getFromLocalStorage('GLOBE_USER').id}).subscribe(res => {
    this.onNoClick();
    });
  }

}
