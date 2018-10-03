import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CommonModule} from '@angular/common';
import {AlertModule} from 'ngx-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {HttpService} from './services/http.service';
import {UserService} from './services/user.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {GlobTabsComponent} from './components/glob-tabs/glob-tabs.component';
import {WallComponent} from './components/wall/wall.component';
import {PostComponent} from './components/wall/post/post.component';
import {HeaderComponent} from './components/header/header.component';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgChatModule} from './components/ng-chat/ng-chat.module';
import {GlobeAdapter} from './services/chatAdapter';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FileUploadModule} from 'ng2-file-upload';
import {PostsService} from './services/posts.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpInterceptorService} from './services/http-interceptor.service';
import {ChatService} from './services/chat.service';
import 'hammerjs';
import { NgxGalleryModule } from 'ngx-gallery';
import { EmbedVideoService } from './services/embed-video.service';
import { WallSmilesComponent } from './components/wall/wall-smiles/wall-smiles.component';
import {MatInputModule} from '@angular/material/input';

import {
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {NewAlbumModalComponent} from './components/new-album-modal/new-album-modal.component';
import {NewAudioModalComponent} from './components/new-audio-modal/new-audio-modal.component';
import {NewVideoModalComponent} from './components/new-video-modal/new-video-modal.component';
import {ProfileInfoComponent} from './components/profile-info/profile-info.component';
import {NewsComponent} from './components/news/news.component';
import {ContactComponent} from './components/contact/contact.component';
import {AgmCoreModule} from '@agm/core';
import {GroupsComponent} from './pages/groups/groups.component';
import {HomeMenuComponent} from './components/home-menu/home-menu.component';
import {ProfileImageComponent} from './components/profile-image/profile-image.component';
import {NewGroupModalComponent} from './components/new-group-modal/new-group-modal.component';
import {NotesComponent} from './pages/notes/notes.component';
import {NewNotesModalComponent} from './components/new-notes-modal/new-notes-modal.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {UserUploadImageComponent} from './components/user-upload-image/user-upload-image.component';
import {UploadMediaAttachComponent} from './components/upload-media-attach/upload-media-attach.component';
import {PostBoxComponent} from './components/wall/post-box/post-box.component';
import {FriendsComponent} from './pages/friends/friends.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';
import {SearchComponent} from './pages/search/search.component';
import {SearchAllComponent} from './components/search-all/search-all.component';
import {UserProfileComponent} from './pages/user-profile/user-profile.component';
import {UserGlobTabsComponent} from './components/user-glob-tabs/user-glob-tabs.component';
import {UserProfileInfoComponent} from './components/user-profile-info/user-profile-info.component';
import {UserProfileImageComponent} from './components/user-profile-image/user-profile-image.component';
import {MessagesComponent} from './pages/messages/messages.component';
import {CommentsComponent} from './components/wall/post/comments/comments.component';
import {FriendsService} from './services/friends.service';
import {GroupService} from './services/group.service';
import {CommentService} from './services/comment.service';
import {SearchService} from './services/search.service';
import {VideoService} from './services/video.service';
import {AudioService} from './services/audio.service';
import {FriendsSidebarBlockComponent} from './components/friends-sidebar-block/friends-sidebar-block.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {UserCropImageComponent} from './components/user-crop-image/user-crop-image.component';
import {VideosComponent} from './components/glob-tabs/videos/videos.component';
import {VideoComponent} from './components/glob-tabs/videos/video/video.component';
import {AudiosComponent} from './components/glob-tabs/audios/audios.component';
import {AudioComponent} from './components/glob-tabs/audios/audio/audio.component';
import {UserVideosComponent} from './components/user-glob-tabs/user-videos/user-videos.component';
import {UserAudiosComponent} from './components/user-glob-tabs/user-audios/user-audios.component';
import {FriendRequestsComponent} from './components/friend-requests/friend-requests.component';
import {FriendRequestComponent} from './components/friend-requests/friend-request/friend-request.component';
import {FriendComponent} from './components/friend/friend.component';
import {UserFriendComponent} from './pages/user-friend/user-friend.component';
import {GroupPageComponent} from './pages/group/group-page.component';
import {AttachmentsComponent} from './components/wall/post/attachments/attachments.component';
import {PrivacyPolicyComponent} from './pages/privacy-policy/privacy-policy.component';
import {AlbumsComponent} from './components/albums/albums.component';
import {UserAlbumsComponent} from './components/user-albums/user-albums.component';
import {ProfileMapComponent} from './components/profile-map/profile-map.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
import {ConfigService} from './services/config.service';
import {AuthGuard} from './auth.guard';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { NewPasswordModalComponent } from './components/new-password-modal/new-password-modal.component';
// import { CreatePasswordModalComponent } from './components/create-password-modal/create-password-modal.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { PostEmojifyPipe } from './pipes/post-emojify.pipe';
import { UserProfileMapComponent } from './components/user-profile-map/user-profile-map.component';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'forgot', component: ForgotComponent},
  {
    path: 'profile', component: ProfileComponent, children: [
      {path: '', component: ProfileMapComponent},
      {path: 'info', component: ProfileInfoComponent},
      {path: 'albums', component: AlbumsComponent},
      {path: 'audios', component: AudiosComponent},
      {path: 'videos', component: VideosComponent},
      {path: 'news', component: NewsComponent},
    ],
    canActivate: [AuthGuard]
  },

  {path: 'group/:id', component: GroupPageComponent, canActivate: [AuthGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [AuthGuard]},
  {path: 'notes', component: NotesComponent, canActivate: [AuthGuard]},
  {path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'privacy', component: PrivacyComponent, canActivate: [AuthGuard]},
  {path: 'privacy-policy', component: PrivacyPolicyComponent, canActivate: [AuthGuard]},
  {path: 'friends', component: FriendsComponent, canActivate: [AuthGuard]},
  {path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
  {
    path: 'user-profile/:id', component: UserProfileComponent, children: [
      {path: '', component: UserProfileMapComponent},
      {path: 'info', component: UserProfileInfoComponent},
      {path: 'albums', component: UserAlbumsComponent},
      {path: 'audios', component: UserAudiosComponent},
      {path: 'videos', component: UserVideosComponent},
    ],
    canActivate: [AuthGuard]
  },
  {path: 'user-friend/:id', component: UserFriendComponent, canActivate: [AuthGuard]},
  {path: 'album/:id', component: AlbumPageComponent, canActivate: [AuthGuard]},
];


export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return fromPromise(System.import(`../assets/i18n/${lang.toLowerCase()}.json`));
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    GlobTabsComponent,
    WallComponent,
    PostComponent,
    HeaderComponent,
    NewAlbumModalComponent,
    NewAudioModalComponent,
    NewVideoModalComponent,
    ProfileInfoComponent,
    NewsComponent,
    ContactComponent,
    GroupsComponent,
    HomeMenuComponent,
    ProfileImageComponent,
    NewGroupModalComponent,
    NotesComponent,
    NewNotesModalComponent,
    SettingsComponent,
    UserUploadImageComponent,
    UploadMediaAttachComponent,
    PostBoxComponent,
    FriendsComponent,
    PrivacyComponent,
    SearchComponent,
    SearchAllComponent,
    UserProfileComponent,
    UserGlobTabsComponent,
    UserProfileInfoComponent,
    UserProfileImageComponent,
    MessagesComponent,
    CommentsComponent,
    FriendsSidebarBlockComponent,
    UserCropImageComponent,
    VideosComponent,
    VideoComponent,
    AudiosComponent,
    AudioComponent,
    UserVideosComponent,
    UserAudiosComponent,
    FriendRequestsComponent,
    FriendRequestComponent,
    FriendComponent,
    UserFriendComponent,
    GroupPageComponent,
    AttachmentsComponent,
    PrivacyPolicyComponent,
    UserAlbumsComponent,
    AlbumsComponent,
    ProfileMapComponent,
    AlbumPageComponent,
    VideoPlayerComponent,
    WallSmilesComponent,
    NewPasswordModalComponent,
    ForgotComponent,
    PostEmojifyPipe,
    UserProfileMapComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    MatSelectModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatStepperModule,
    MatIconModule,
    MatDatepickerModule,
    NgChatModule,
    MatCheckboxModule,
    FileUploadModule,
    ImageCropperModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCZ-8jW9x7sh66bIizdlYbWSa5AHZ3Bi2E',
      libraries: ['places']
    }),
    NgxGalleryModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    // EmbedVideo.forRoot(),
    HttpModule
  ],
  providers: [
    AuthService,
    HttpService,
    UserService,
    GlobeAdapter,
    PostsService,
    FriendsService,
    VideoService,
    AudioService,
    GroupService,
    CommentService,
    SearchService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    ChatService,
    ConfigService,
    EmbedVideoService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NewAlbumModalComponent,
    NewAudioModalComponent,
    NewVideoModalComponent,
    NewGroupModalComponent,
    NewGroupModalComponent,
    NewNotesModalComponent,
    NewPasswordModalComponent,
    UserUploadImageComponent,
    UserCropImageComponent,
    UploadMediaAttachComponent,
    SearchAllComponent,
    AttachmentsComponent,
    FriendsSidebarBlockComponent,
    AttachmentsComponent,
    VideoPlayerComponent
  ]
})
export class AppModule {
}
