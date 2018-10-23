import {Component, OnInit} from '@angular/core';
import {NewAudioModalComponent} from '../../new-audio-modal/new-audio-modal.component';
import {MatDialog} from '@angular/material';
import {AudioService} from '../../../services/audio.service';
import { Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';



@Component({
  selector: 'app-audios',
  templateUrl: './user-audios.component.html',
  styleUrls: ['./user-audios.component.scss'],
  entryComponents: [
    NewAudioModalComponent],
})
export class UserAudiosComponent implements OnInit {
  audios = [];

  constructor(
    public dialog: MatDialog,
    public audioServices: AudioService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe( params => {
      this.audioServices.getUserAudios(params.id).subscribe((audios: any[]) => {
        this.audios = audios;
        console.log(audios);
      });
    });

  }

  openDialogAudio() {
    const dialogRef = this.dialog.open(NewAudioModalComponent, {
      height: '350px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
