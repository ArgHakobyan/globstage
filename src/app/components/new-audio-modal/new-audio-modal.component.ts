import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { AudioService } from '../../services/audio.service';
import { MatDialog } from '@angular/material';
import { UploadMediaAttachComponent } from '../../components/upload-media-attach/upload-media-attach.component';
import {FilesService} from '../../services/files.service';



@Component({
  selector: 'app-new-audio-modal',
  templateUrl: './new-audio-modal.component.html',
  styleUrls: ['./new-audio-modal.component.scss'],
  entryComponents: [
    UploadMediaAttachComponent],
})
export class NewAudioModalComponent implements OnInit {
  audiosPosts = [];
  audioForm: FormGroup;
  uploadedAudio;
  @Output() onUpload = new EventEmitter();
  public filesToUpload = [];
  public urls = [];
  public uploading = false;
  constructor(
    public dialogRef: MatDialogRef<NewAudioModalComponent>,
    public postServices: PostsService,
    public audioServices: AudioService,
    public dialog: MatDialog,
    private filesService: FilesService,
  ) { }

  ngOnInit() {
    this.audioForm = new FormGroup({
      audioInsertLink: new FormControl(),
      audioInsertName: new FormControl(),
    });
  }
  addAudio(name) {
    const audioLink = name.controls.audioInsertLink.value;
    const audioTitle = name.controls.audioInsertName.value;
    if (this.audioForm.valid) {
      this.audioServices.addAudio(
        {
          'posttype': 'audio',
          'post_title' : audioTitle,
          'post_link': audioLink,
          'post_privacy': 1
        }).subscribe( res => {
          this.dialogRef.close(res);
        });
    }

  }

  displaySelected(event) {
    console.log(event.target.files);
    this.filesToUpload = Array.from(event.target.files);
    this.audioForm.controls['audioInsertName'].setValue(this.filesToUpload[0].name);
  }

  uploadAll() {
    this.uploading = true;
    let filesCount = this.filesToUpload.length;
    for (let file of this.filesToUpload) {
      this.filesService.upload(file).subscribe( (res: any) => {
            this.onUpload.emit(res);
            this.audioForm.controls['audioInsertLink'].setValue(res.path);
          }, error => {

          }, () => {
            filesCount = filesCount - 1;
            if (filesCount === 0) {
              this.filesToUpload = [];
              // this.dialogRef.close();
              this.uploading = false;
            }
          }
      );
    }
  }

  removeFromUploads(i) {
    this.filesToUpload.splice(i, 1);
    this.urls.splice(i, 1); 
  }

  clearQueue() {
    this.filesToUpload = [];
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
