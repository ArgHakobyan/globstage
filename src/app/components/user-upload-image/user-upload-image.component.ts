import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileUploader} from 'ng2-file-upload';
import {HttpClient} from '@angular/common/http';
import {getFromLocalStorage, setToLocalStorage} from '../../utils/local-storage';
import {appConfig} from '../../app.config';
import {Headers} from 'ng2-file-upload/file-upload/file-uploader.class';


const URL = appConfig.apiUrl + '/files';

@Component({
  selector: 'app-user-upload-image',
  templateUrl: './user-upload-image.component.html',
  styleUrls: ['./user-upload-image.component.scss']
})
export class UserUploadImageComponent implements OnInit {
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public croppedImageFile: any;
  public infoToggle;
  public uploadedImage;
  public selectedImage;
  URL = appConfig.apiUrl + '/files';

  public uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: false,
    headers: [{'name': 'Authorization', 'value': `Bearer ${getFromLocalStorage('GLOBE_AUTH').token}`}]
  });


  constructor(private httpService: HttpClient,
              public dialogRef: MatDialogRef<UserUploadImageComponent>,
              private http: HttpClient,
              ) {
  }

  ngOnInit() {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(response);
      this.uploadedImage = JSON.parse(response).path;
    };
  }

  updateUploadImage() {
    this.httpService.put(`${appConfig.apiUrl }/users/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`, {'user_photo': this.uploadedImage}).subscribe(a => {
      const localUser: any = getFromLocalStorage('GLOBE_USER');
      localUser.user_photo = this.uploadedImage;
      setToLocalStorage('GLOBE_USER', localUser);
      this.dialogRef.close();
    });
  }

  showInfoToggle() {
    this.infoToggle = (this.infoToggle === true) ? false : true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(image: string) {
    this.croppedImage = image;
  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed() {
    // show message
  }

  imageCroppedFile(image) {
    console.log(image);
    this.croppedImageFile = image;

  }

  uploadThumb() {
    let formData: FormData = new FormData();
    formData.append('file', this.croppedImageFile, 'avatar.jpeg');
    this.http.post(this.URL, formData)
      .map(res => res)
      .catch(error => error)
      .subscribe(
        (data: any) => {
          console.log('success');
          this.http.put(`${appConfig.apiUrl }/users/${JSON.parse(localStorage.getItem('GLOBE_USER')).id}`, {'user_photo': data.path}).subscribe(a => {
          const localUser: any = getFromLocalStorage('GLOBE_USER');
          localUser.user_photo = data.path;
          setToLocalStorage('GLOBE_USER', localUser);
          this.dialogRef.close({'user_photo': data.path});
        });
      },
        error => console.log(error)
      );
  }
}
