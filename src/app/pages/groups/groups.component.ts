import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NewGroupModalComponent} from '../../components/new-group-modal/new-group-modal.component';
import {GroupService} from '../../services/group.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {SearchService} from '../../services/search.service';


@Component({
  selector: 'app-group',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  entryComponents: [
    NewGroupModalComponent],
})
export class GroupsComponent implements OnInit {
  groups;
  public searchGroup: FormGroup;
  group: any[];

  constructor(
    public dialog: MatDialog,
    public groupService: GroupService,
    public formbuilder: FormBuilder,
    private router: Router,
    public searchService: SearchService,

  ) {
  }

  ngOnInit() {
    this.groupService.getGroups().subscribe(res => {
      this.groups = res;
    });

    this.searchGroup = new FormGroup({
      groupName: new FormControl('', Validators.required)
    });
    this.searchGroup = this.formbuilder.group({
      groupName: ['', Validators.required]
    });
  }

  openDialogGroup() {
    const dialogRef = this.dialog.open(NewGroupModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  searchGroups(searchGroup){
    let search = searchGroup.controls['groupName'].value;
    this.searchService.searchGroups(search).subscribe((res) => {
      this.groups = res;
    });
  }

}
