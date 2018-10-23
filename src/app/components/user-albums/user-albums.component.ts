import { Component, OnInit } from '@angular/core';
import {NewAlbumModalComponent} from '../new-album-modal/new-album-modal.component';
import {MatDialog} from '@angular/material';
import {AlbumService} from '../../services/album.service';
import { Router, ActivatedRoute} from '@angular/router';



@Component({
  selector: 'app-albums',
  templateUrl: './user-albums.component.html',
  styleUrls: ['./user-albums.component.scss']
})
export class UserAlbumsComponent implements OnInit {

  albums = [];

  constructor(
    public dialog: MatDialog,
    public albumService: AlbumService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.route.parent.params.subscribe( params => {
      this.albumService.getUserAlbums(params.id).subscribe((albums: any[]) => {
        this.albums = albums;
      });
    });
  }

}
