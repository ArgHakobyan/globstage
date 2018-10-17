import { MatDialogRef } from '@angular/material';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import {HttpService} from '../../services/http.service';
import {getFromLocalStorage} from '../../utils/local-storage';
import {appConfig} from '../../app.config';



const URL = `${appConfig.apiUrl}/files`;


@Component({
  selector: 'app-upload-media-attach',
  templateUrl: './upload-media-attach.component.html',
  styleUrls: ['./upload-media-attach.component.scss']
})
export class UploadMediaAttachComponent implements OnInit {


  urls = new Array<string>();

  public uploader: FileUploader = new FileUploader({
    url: URL, disableMultipart: false,
    headers: [{
      'name': 'Authorization',
      'value': `Bearer ${getFromLocalStorage('GLOBE_AUTH').token}`
    }]});

  @Output() onUpload = new EventEmitter();



  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public uploadedImage;

  constructor(
    private httpService: HttpService,
    public dialogRef: MatDialogRef<UploadMediaAttachComponent>
  ) { }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
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
        }
        reader.readAsDataURL(file);
      }
    }
  }



  ngOnInit() {
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log(response);
          this.uploadedImage =  response;
        this.onUpload.emit(response);
        this.dialogRef.close(response);
      };
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
