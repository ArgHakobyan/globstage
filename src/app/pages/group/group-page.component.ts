import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewGroupModalComponent } from '../../components/new-group-modal/new-group-modal.component';
import { GroupService } from '../../services/group.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { getLocale } from 'ngx-bootstrap/chronos/locale/locales';
import { getFromLocalStorage } from '../../utils/local-storage';


@Component({
  selector: 'app-group',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.scss']
})
export class GroupPageComponent implements OnInit {
  group;
  group_id;
  subscribe = false;
  followers = true;

  constructor(
    public groupService: GroupService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.group_id = params.id;
      this.groupService.getGroup(this.group_id).subscribe(res => {
        this.group = res;
        console.log(res); 
        if (this.group.followers && this.group.followers.filter(e =>  e.user_id === getFromLocalStorage('GLOBE_USER').id).length > 0) {
          this.subscribe = true;
        }
        }
      );
    });


  }

  subscribeToGroup() {
    this.groupService.subscribeToGroup(this.group_id).subscribe(res => {
      this.snackBar.open('You subscribing to group.', 'ok', { duration: 3000 });
      this.subscribe = true;
    });
  }
  deleteSubsGroup() {
    this.groupService.deleteSubsGroup(this.group_id).subscribe(res => {
      this.snackBar.open('You unsubscribing to group.', 'ok', { duration: 3000 });
      this.subscribe = false;
    });
  }

  openDialogGroup() {
    const dialogRef = this.dialog.open(NewGroupModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
