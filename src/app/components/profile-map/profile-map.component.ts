import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from '../../utils/local-storage';
import {FormArray} from '@angular/forms';
import { FriendsService } from '../../services/friends.service';


declare var navigator;


@Component({
  selector: 'app-profile-map',
  templateUrl: './profile-map.component.html',
  styleUrls: ['./profile-map.component.scss']
})
export class ProfileMapComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  public userProfile: any;
  public user;
  public placeList;
  infowindow;
  myLocation;
  placeMarkers = [];
  public friends;
  public userId;
  public check;
  checked: boolean;

  selectedPlaces = [
    {icon: 'restaurant', value: 'restaurant', checked: false},
    {icon: 'hotel', value: 'lodging', checked: false},
    {icon: 'local_cafe', value: 'cafe', checked: false},
    {icon: 'local_bar', value: 'bar', checked: false},
    {icon: 'account_balance', value: 'bank', checked: false},
    {icon: 'local_parking', value: 'parking', checked: false},
    {icon: 'local_grocery_store', value: 'store', checked: false},
    {icon: 'local_gas_station', value: 'gas_station', checked: false},
    {icon: 'local_hospital', value: 'hospital', checked: false}
  ];

  constructor(private userService: UserService, private friendService: FriendsService) {

  }

  ngOnInit() {
    this.user = getFromLocalStorage('GLOBE_USER');
    this.userService.getUser(getFromLocalStorage('GLOBE_USER').id).subscribe((user: any) => {
      this.userProfile = user;
      setToLocalStorage('GLOBE_USER', user);
    });

    this.placeList = new FormArray([

    ]);

    this.userId = getFromLocalStorage('GLOBE_USER').id;
    this.initMap();

    this.userService.getPrivacy().subscribe((ret: any) => {
      console.log(ret.location);
      this.check = !!ret.location;
    });

  }

  get selectedOptions() { // right now: ['1','3']
    return this.selectedPlaces
        .filter(place => place.checked)
        .map(place => place.value);
  }

  initMap() {
    console.log('Rendering the Map');
    let userId = this.userId;
    if (navigator.geolocation) {

      console.log('Navigation ON');
      navigator.geolocation.getCurrentPosition(position => {
        this.myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map = new google.maps.Map(this.gmapElement.nativeElement, {
          center: this.myLocation,
          zoom: 14,
          gestureHandling: 'cooperative',
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [{
            'featureType': 'all',
            'elementType': 'all',
            // 'stylers': [{'invert_lightness': true}, {'saturation': 10}, {'lightness': 30}, {'gamma': 0.5}, {'hue': '#435158'}]
          }]
        });

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          map: this.map,
          animation: google.maps.Animation.BOUNCE,
        });
        this.userService.updLocation(this.myLocation).subscribe();
        console.log(this.myLocation);

      });

      this.friendService.getFriends(userId).subscribe((res: any[]) => {
        this.friends = res;
        for (let i = 0; i < res.length; i++) {
          if (res[i].user_location) {
            const location = new google.maps.LatLng(res[i].user_location.split(',')[0], res[i].user_location.split(',')[1]);
            let icon = {
              url: '../../../assets/imgs/friend-marker.png',
              scaledSize: new google.maps.Size(50, 50),
            };
            let infowindow = new google.maps.InfoWindow({
              content: res[i].user_name + ' ' + res[i].user_last_name
            });
            const marker = new google.maps.Marker({
              position: location,
              map: this.map,
              animation: google.maps.Animation.BOUNCE,
              icon: icon,
              title: 'Hello World!'
            });
            marker.addListener('click', function() {
              infowindow.open(this.map, marker);
            });

          }

        }
      });


    } else {
      this.myLocation = new google.maps.LatLng(42, 42);
      console.log('Navigation OFF');
      this.map = new google.maps.Map(this.gmapElement.nativeElement, {
        center: this.myLocation,
        zoom: 12,
        gestureHandling: 'cooperative',
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
          'featureType': 'all',
          'elementType': 'all',
          // 'stylers': [{'invert_lightness': true}, {'saturation': 10}, {'lightness': 30}, {'gamma': 0.5}, {'hue': '#435158'}]
        }]
      });

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(42, 42),
        map: this.map,
        animation: google.maps.Animation.BOUNCE,
      });
    }
  }

  callback = (results, status) => {

    for (let i = 0; i < this.placeMarkers.length; i++) {
      this.placeMarkers[i].setMap(null);
    }
    this.placeMarkers = [];
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        let marker = new google.maps.Marker({
          map: this.map,
          position: results[i].geometry.location
        });
        this.placeMarkers.push(marker);
        google.maps.event.addListener(marker, 'click',  () => {
          this.infowindow.setContent(results[i].name);
          this.infowindow.open(this.map, marker);
        });

      }
    }
  }

  updateMap(e) {
    console.log(e);
    this.infowindow = new google.maps.InfoWindow();
    let service = new google.maps.places.PlacesService(this.map);

    service.nearbySearch({
      location: this.myLocation,
      radius: 5000,
      type: e.value
    }, this.callback);
  }

  onInputChange(event: any) {
    console.log(event);
    let mn = event.checked;
    if (event.checked === true) {
      mn = 1;
    } else {
      mn = 0;
    }
    this.userService.reqLocationMap(mn).subscribe(ret => {
      console.log(ret);
    });
  }
}
