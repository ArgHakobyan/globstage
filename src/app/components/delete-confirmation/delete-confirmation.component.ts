import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material';
import { MatDialogRef } from '@angular/material';
import {PostsService} from '../../services/posts.service';


@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  @Input() post: any;
  @Output() onDelete = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private postService: PostsService,
  ) { }

  ngOnInit() {
  }

  deleteWallPost() {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
