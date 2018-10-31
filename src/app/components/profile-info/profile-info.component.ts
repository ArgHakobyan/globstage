/// <reference types="googlemaps" />
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { getFromLocalStorage } from '../../utils/local-storage';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ProfileInfoComponent implements OnInit {

  public detailsToggle;
  public showInfo = true;
  public editInfo = false;
  public showPersonal = false;
  public editContact = false;
  public showContact = true;
  public personalInfo = true;
  public information: FormGroup = new FormGroup({});
  public contact: FormGroup = new FormGroup({});
  public personal: FormGroup = new FormGroup({});
  public user: any = {};

  @ViewChild('country') public countryElement: ElementRef;

  constructor(
    private userService: UserService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {

    this.information = new FormGroup({
      user_gender: new FormControl(),
      user_date_of_birth: new FormControl(),
      user_marital_status: new FormControl(),
      user_country: new FormControl(),
      user_city: new FormControl(),
    });
    this.contact = new FormGroup({
      user_mobile: new FormControl(),
      user_twitter: new FormControl(),
      user_facebook: new FormControl(),
      user_skype: new FormControl(),
      user_website: new FormControl(),
    });
    this.personal = new FormGroup({
      activities: new FormControl(),
      interests: new FormControl(),
      favorite_books: new FormControl(),
      favorite_quotes: new FormControl(),
      favorite_sports: new FormControl(),
      favorite_munshids: new FormControl(),
      favorite_preachers: new FormControl(),
      about_me: new FormControl(),
    });
    this.userService.getUser(getFromLocalStorage('GLOBE_USER').id).subscribe((user: any) => {
      this.user = user;
      this.user.user_contact = JSON.parse(this.user.user_contact);
      this.user.user_interests = JSON.parse(this.user.user_interests);
      this.information = new FormGroup({
        user_gender: new FormControl(user.user_gender),
        user_date_of_birth: new FormControl(user.user_date_of_birth),
        user_marital_status: new FormControl(user.user_marital_status),
        user_country: new FormControl(user.user_country),
        user_city: new FormControl(user.user_city),
      });
      this.personal = new FormGroup({
        activities: new FormControl(user.user_interests.activities),
        interests: new FormControl(user.user_interests.interests),
        favorite_books: new FormControl(user.user_interests.favorite_books),
        favorite_quotes: new FormControl(user.user_interests.favorite_quotes),
        favorite_sports: new FormControl(user.user_interests.favorite_sports),
        favorite_munshids: new FormControl(user.user_interests.favorite_munshids),
        favorite_preachers: new FormControl(user.user_interests.favorite_preachers),
        about_me: new FormControl(user.user_interests.about_me),
      });
      this.contact = new FormGroup({
        user_mobile: new FormControl(user.user_contact.user_mobile),
        user_twitter: new FormControl(user.user_contact.user_twitter),
        user_facebook: new FormControl(user.user_contact.user_facebook),
        user_skype: new FormControl(user.user_contact.user_skype),
        user_website: new FormControl(user.user_contact.user_website),
      });
    });

  }

  show1Toggle() {
    this.detailsToggle = (this.detailsToggle === true) ? false : true;
  }

  editUserInfo() {
    this.showInfo = false;
    this.editInfo = true;

    this.mapsAPILoader.load().then(
      () => {

        // const autocomplete = new google.maps.places.Autocomplete(
        //   this.countryElement.nativeElement,
        //   {
        //     types: ['(regions)']
        //   });

        // autocomplete.addListener('place_changed', () => {
        //   this.ngZone.run(() => {
        //     const place: google.maps.places.PlaceResult = autocomplete.getPlace();
        //     if (place.geometry === undefined || place.geometry === null) {
        //       return;
        //     }
        //   });
        // });
      }
    );
  }
  cancelEditInfo() {
    this.showInfo = true;
    this.editInfo = false;
  }
  editUserContact() {
    this.editContact = true;
    this.showContact = false;
  }
  cancelEditContact() {
    this.editContact = false;
    this.showContact = true;
  }
  editUserPersonal() {
    this.showPersonal = true;
    this.personalInfo = false;
  }
  cancelEditPersonal() {
    this.showPersonal = false;
    this.personalInfo = true;
  }

  saveInfo(inf) {
    console.log(inf.value)
    this.userService.updateUserInfo(inf.value).subscribe(data => {
      this.user = data;
      this.showInfo = true;
      this.editInfo = false;
    });
  }
  saveContact(contact) {
    console.log(this.user)
    this.userService.updateUserContact(contact.value).subscribe(data => {
      this.user.user_contact = data;
      this.editContact = false;
      this.showContact = true;
    });
  }
  savePersonal(personal) {
    this.userService.updateUserPersonal(personal.value).subscribe(data => {
      this.user.user_interests = data;
      this.showPersonal = false;
      this.personalInfo = true;
    });
  }



}
