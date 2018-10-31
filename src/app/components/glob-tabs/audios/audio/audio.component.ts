import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {AudioService} from '../../../../services/audio.service';
import {getFromLocalStorage} from '../../../../utils/local-storage';
import { DeleteConfirmationComponent } from '../../../../components/delete-confirmation/delete-confirmation.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit {
  audios = [];
  public userAudio;
  @Input() audio;
  @Output() deleteAudio = new EventEmitter();
  constructor(public audioServices: AudioService, public dialog: MatDialog) { }

  ngOnInit() {
    this.userAudio = getFromLocalStorage('GLOBE_USER');
  }

  delete(id) {
      this.audioServices.deleteAudio(id).subscribe( res => {
        this.deleteAudio.emit(id);
      });
  }

  openDialogDelete() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(this.audio.id);
      }
    });
  }



}
