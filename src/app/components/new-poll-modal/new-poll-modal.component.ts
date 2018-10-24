import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import {PostsService} from '../../services/posts.service';
import {AudioService} from '../../services/audio.service';
import {MatDialog} from '@angular/material';
import {UploadMediaAttachComponent} from '../../components/upload-media-attach/upload-media-attach.component';


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
  questions: FormArray;
  uploadedAudio;
  pollPost = [];

  // public questions = [1,2];


  constructor(
      public dialogRef: MatDialogRef<NewPollModalComponent>,
      public postServices: PostsService,
      public audioServices: AudioService,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.pollForm = new FormGroup({
      pollTitle: new FormControl(),
      questions: new FormArray([
        new FormControl(null),
        new FormControl(null),
      ]),
    });
  }

  addPoll(name) {
    const title = name.controls.pollTitle.value;
    if (this.pollForm.valid) {
      const questions = [];
      for (let i = 0; i < this.pollForm.controls.questions['controls'].length; i++) {
        if (this.pollForm.controls.questions['controls'][i].value) {
          questions.push(this.pollForm.controls.questions['controls'][i].value);
        }
      }

      this.postServices.addPoll({
            'posttype': 'vote',
            'title': title,
            'questions': questions
          }
          ).subscribe(res => {
            this.dialogRef.close(res);
        this.pollPost = [];

      });
      
    }

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

  addInput() {
    this.questions = this.pollForm.get('questions') as FormArray;
    this.questions.push(new FormControl());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      name: '',
      description: '',
      price: ''
    });
  }

  copy() {
    // this.questions.push(this.questions.length + 1)
  }

}
