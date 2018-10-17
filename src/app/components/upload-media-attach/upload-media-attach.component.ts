import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Component, OnInit, EventEmitter, Output, Inject} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {FilesService} from '../../services/files.service';

@Component({
  selector: 'app-upload-media-attach',
  templateUrl: './upload-media-attach.component.html',
  styleUrls: ['./upload-media-attach.component.scss']
})
export class UploadMediaAttachComponent implements OnInit {

  @Output() onUpload = new EventEmitter();
  public filesToUpload = [];
  public urls = [];
  public uploading = false;

  constructor(
      private httpService: HttpService,
      private filesService: FilesService,
      public dialogRef: MatDialogRef<UploadMediaAttachComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
  }

  detectFiles(event) {
    this.urls = [];
    let files = event.target.files;
    console.log(event.target);
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  displaySelected(event) {
    console.log(event.target.files);
    this.filesToUpload = Array.from(event.target.files);
    for (let file of this.filesToUpload) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadAll() {
    this.uploading = true;
    let filesCount = this.filesToUpload.length;
    for (let file of this.filesToUpload) {
      this.filesService.upload(file).subscribe(res => {
            this.onUpload.emit(res);

          }, error => {

          }, () => {
            filesCount = filesCount - 1;
            if (filesCount === 0) {
              this.filesToUpload = [];
              this.dialogRef.close();
              this.uploading = false;
            }
          }
      );
    }
  }

  removeFromUploads(i) {
    console.log(i);
    this.filesToUpload.splice(i, 1);
    this.urls.splice(i, 1);
    console.log(this.filesToUpload);
  }

  clearQueue() {
    this.filesToUpload = [];
    this.dialogRef.close();
  }

}
