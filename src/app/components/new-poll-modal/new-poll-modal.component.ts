import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { AudioService } from '../../services/audio.service';
import { MatDialog } from '@angular/material';
import { UploadMediaAttachComponent } from "../../components/upload-media-attach/upload-media-attach.component";



@Component({
  selector: 'app-new-poll-modal',
  templateUrl: './new-poll-modal.component.html',
  styleUrls: ['./new-poll-modal.component.scss'],
  entryComponents: [
    UploadMediaAttachComponent],
})
export class NewPollModalComponent implements OnInit {
  audiosPosts = [];
  pollForm: FormGroup;
  uploadedAudio;
  pollPost = [];

  constructor(
    public dialogRef: MatDialogRef<NewPollModalComponent>,
    public postServices: PostsService,
    public audioServices: AudioService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.pollForm = new FormGroup({
      pollTitle: new FormControl(),
      Questions1: new FormControl(),
      Questions2: new FormControl()
    })
  }
  addPoll(name) {
    const title = name.controls.pollTitle.value;
    const quest1 = name.controls.Questions1.value;
    const quest2 = name.controls.Questions2.value;
    
    if (this.pollForm.valid) {
      this.postServices.addPoll(
        {
          'posttype':'vote',
          'title' : title,
          'questions' : {
            '1': quest1,
            '2': quest2,
          }
        }).subscribe(res =>{
          this.pollPost = [];
        });
    }
    this.postServices.addPoll(JSON.parse(localStorage.getItem('GLOBE_USER')).id).subscribe(
      audios => {
      });
      this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialogAttach() {
    const dialogRef = this.dialog.open(UploadMediaAttachComponent, {
      height: 'auto',
      width: '350px',
    });

    
  }

}
