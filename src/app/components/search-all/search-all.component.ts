import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialogRef} from '@angular/material';



@Component({
  selector: 'app-search-all',
  templateUrl: './search-all.component.html',
  styleUrls: ['./search-all.component.scss']
})
export class SearchAllComponent implements OnInit {

  selected1 = 'users';
  query;
  type = 'users';
  constructor(
      private router: Router,
      public dialogRef: MatDialogRef<SearchAllComponent>
  ) { }

  ngOnInit() {
  }

  searchResult(query, type){
    this.router.navigate([`search`, { q: query, type: type }]);
    this.dialogRef.close();
  }

}
