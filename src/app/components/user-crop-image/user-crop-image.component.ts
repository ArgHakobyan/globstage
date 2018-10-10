import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {appConfig} from '../../app.config';
import {getFromLocalStorage, setToLocalStorage} from '../../utils/local-storage';
import {UserService} from '../../services/user.service';
import {HttpClient} from '@angular/common/http';
import {MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-user-crop-image',
  templateUrl: './user-crop-image.component.html',
  styleUrls: ['./user-crop-image.component.scss']
})

export class UserCropImageComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageFile: any;
  URL = appConfig.apiUrl + '/files';
  public profileImage;
  public uploader: FileUploader = new FileUploader({url: this.URL, disableMultipart: false});

  constructor(
    private userService: UserService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UserCropImageComponent>
  ) {
  }

  ngOnInit() {
    this.profileImage = getFromLocalStorage('GLOBE_USER').user_photo;
    console.log(this.profileImage);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(image) {
    // console.log(image);
    this.croppedImage = image;

  }

  imageCroppedFile(image) {
    console.log(image);
    this.croppedImageFile = image;

  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed() {
    // show message
  }

  updateUploadImage() {
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
