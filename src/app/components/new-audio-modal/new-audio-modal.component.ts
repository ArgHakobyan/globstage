import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { AudioService } from '../../services/audio.service';
import { MatDialog } from '@angular/material';
import { UploadMediaAttachComponent } from "../../components/upload-media-attach/upload-media-attach.component";



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
  constructor(
    public dialogRef: MatDialogRef<NewAudioModalComponent>,
    public postServices: PostsService,
    public audioServices: AudioService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.audioForm = new FormGroup({
      audioInsertLink: new FormControl(),
      audioInsertName: new FormControl(),
    })
  }
  addAudio(name) {
    const cname = name.controls.audioInsertLink.value;
    const audio = name.controls.audioInsertName.value;
    if (this.audioForm.valid) {
      this.audioServices.addAudio(
        {
          'audio_name' : audio,
          'audio_link_url': cname,
          'privacy': 1
        }).subscribe();
    }
    this.audioServices.addAudio(JSON.parse(localStorage.getItem('GLOBE_USER')).id).subscribe(
      audios => {
        this.dialogRef.close();
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  addDownAudio() {
      this.audioServices.addAudio({
        'audio_name' : this.uploadedAudio.name,
        'audio_link_url': this.uploadedAudio.path,
        'privacy': 1
      }).subscribe(
      );
      this.dialogRef.close();
      console.log(this.uploadedAudio);

  }

  openDialogAttach() {
    const dialogRef = this.dialog.open(UploadMediaAttachComponent, {
      height: 'auto',
      width: '500px',
      data: {fileTypes: ['audio/*']}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.uploadedAudio = result;
      console.log(result);
    });
  }

}
