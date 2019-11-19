// Angular Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule,
  MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatTabsModule } from '@angular/material';
import { NgModule } from '@angular/core';

// Core Components
import { AppComponent } from './app.component';
import { Component404Component } from './_shared/404component/404.component';
import { CreatePostComponent } from './_shared/createPost/createPost.component';
import { DraftsComponent } from './_shared/drafts/drafts.component';
import { HomeComponent } from './_shared/home/home.component';
import { LoginComponent } from './_shared/login/login.component';
import { NavBarComponent } from './_shared/navBar/navBar.component';
import { NotificationArchiveComponent } from './_shared/notificationArchive/notificationArchive.component';
import { NotificationComponent } from './_shared/notification/notification.component';
import { PostViewComponent } from './_shared/postView/postView.component';
import { ProfileComponent } from './_shared/profile/profile.component';
import { ProfileViewComponent } from './_shared/profileView/profileView.component';
import { RecoverComponent } from './_shared/recover/recover.component';
import { RecoverPasswordComponent } from './_shared/recoverPassword/recoverPassword.component';
import { RegisterComponent } from './_shared/register/register.component';
import { RegisterSuccessComponent } from './_shared/registerSuccess/registerSuccess.component';
import { UserPostsComponent } from './_shared/userPosts/userPosts.component';

// Core Dialogs
import { AvatarDialogComponent } from './_dialogs/avatar.dialog.component';
import { BioDialogComponent } from './_dialogs/bio.dialog.component';
import { ConfirmDeletionDialogComponent } from './_dialogs/confirmDeletion.dialog.component';
import { EmailDialogComponent } from './_dialogs/email.dialog.component';
import { FlagDialogComponent } from './_dialogs/flag.dialog.component';
import { LogoutDialogComponent  } from './_dialogs/logout.dialog.component';
import { PasswordDialogComponent } from './_dialogs/password.dialog.component';
import { PictureDialogComponent } from './_dialogs/picture.dialog.component';
import { PicturesDialogComponent } from './_dialogs/pictures.dialog.component';
import { ShareDialogComponent } from './_dialogs/share.dialog.component';
import { YouTubeDialogComponent } from './_dialogs/youtube.dialog.component';

// Core Modules
import { NgxMasonryModule } from './_modules/ngx-masonry/ngx-masonry.module';
import { ShareModule } from './_modules/ng2share/share.module';

// Core Pipes
import { MarkedPipe } from './_pipes/marked.pipe';

// Core Services
import { AreaService } from './_services/area.service';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { CommentService } from './_services/comment.service';
import { FlagService } from './_services/flag.service';
import { HttpService } from './_services/http.service';
import { NavBarService } from './_services/navBar.service';
import { NotificationService } from './_services/notification.service';
import { PostService } from './_services/post.service';
import { ProfileService } from './_services/profile.service';
import { ReasonService } from './_services/reason.service';
import { RegistrationService } from './_services/registration.service';
import { RouteService } from './_services/route.service';
import { Routing } from './app.routing';

// Third Party Modules
import { Angulartics2Module } from 'angulartics2';
import { ClipboardModule } from 'ngx-clipboard';
import 'hammerjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReCaptchaModule } from 'angular2-recaptcha';

@NgModule({
  imports: [
    // Core Modules
    NgxMasonryModule,

    // Modules
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    Routing,

    // Third Party Modules
    ClipboardModule,
    NgxPaginationModule,
    ReCaptchaModule,
    ShareModule,

    // forRoot
    Angulartics2Module.forRoot()
  ],
  declarations: [
    // Components
    AppComponent,
    Component404Component,
    DraftsComponent,
    CreatePostComponent,
    HomeComponent,
    LoginComponent,
    NavBarComponent,
    NotificationArchiveComponent,
    NotificationComponent,
    PostViewComponent,
    ProfileComponent,
    ProfileViewComponent,
    RecoverComponent,
    RecoverPasswordComponent,
    RegisterComponent,
    RegisterSuccessComponent,
    UserPostsComponent,

    // Dialogs
    AvatarDialogComponent,
    BioDialogComponent,
    ConfirmDeletionDialogComponent,
    EmailDialogComponent,
    FlagDialogComponent,
    LogoutDialogComponent,
    PasswordDialogComponent,
    PictureDialogComponent,
    PicturesDialogComponent,
    ShareDialogComponent,
    YouTubeDialogComponent,

    // Pipes
    MarkedPipe
    ],
  providers: [
    AreaService,
    AuthGuard,
    AuthenticationService,
    CommentService,
    FlagService,
    HttpService,
    NavBarService,
    NotificationService,
    PostService,
    ProfileService,
    ReasonService,
    RegistrationService,
    RouteService
  ],
  entryComponents: [
    AvatarDialogComponent,
    BioDialogComponent,
    ConfirmDeletionDialogComponent,
    EmailDialogComponent,
    FlagDialogComponent,
    LogoutDialogComponent,
    PasswordDialogComponent,
    PictureDialogComponent,
    PicturesDialogComponent,
    ShareDialogComponent,
    YouTubeDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
