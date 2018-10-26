import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {AudioService} from '../../../../services/audio.service';
import {getFromLocalStorage} from '../../../../utils/local-storage';


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
  constructor(public audioServices: AudioService) { }

  ngOnInit() {
    this.userAudio = getFromLocalStorage('GLOBE_USER');
  }

  delete(id) {
    this.audioServices.deleteAudio(id).subscribe( res => {
      this.deleteAudio.emit(id);
    });
  }



}
