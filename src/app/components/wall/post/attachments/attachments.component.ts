import {Component, Input, OnInit} from '@angular/core';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {

  @Input() attachments;
  @Input() post;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  imageAttaches;
  constructor() { }

  ngOnInit() {

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    if (this.post.attachments && this.post.attachments.length > 0) {
      this.imageAttaches  = this.post.attachments.filter(a => a.type === 'image');
      if (this.imageAttaches && this.imageAttaches.length > 1) {
        this.imageAttaches.forEach(a => {
          this.galleryImages.push({big: a.path, small: a.path, medium: a.path });
        });
      }

    }

  }

}
