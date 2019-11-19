import { Routes, RouterModule } from '@angular/router';
import { Component404Component } from './_shared/404component/404.component';
import { DraftsComponent } from './_shared/drafts/drafts.component';
import { CreatePostComponent } from './_shared/createPost/createPost.component';
import { HomeComponent } from './_shared/home/home.component';
import { LoginComponent } from './_shared/login/login.component';
import { NotificationArchiveComponent } from './_shared/notificationArchive/notificationArchive.component';
import { NotificationComponent } from './_shared/notification/notification.component';
import { RecoverComponent } from './_shared/recover/recover.component';
import { RecoverPasswordComponent } from './_shared/recoverPassword/recoverPassword.component';
import { RegisterComponent } from './_shared/register/register.component';
import { RegisterSuccessComponent } from './_shared/registerSuccess/registerSuccess.component';
import { PostViewComponent } from './_shared/postView/postView.component';
import { ProfileComponent } from './_shared/profile/profile.component';
import { ProfileViewComponent } from './_shared/profileView/profileView.component';
import { UserPostsComponent } from './_shared/userPosts/userPosts.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'areas/:area/:id', component: PostViewComponent },
  { path: 'areas/:area/:id/:comments', component: PostViewComponent },
  { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'create/:id', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'drafts', component: DraftsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'notifications/:index', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'notifications/archive/:index', component: NotificationArchiveComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: UserPostsComponent, canActivate: [AuthGuard] },
  { path: 'posts/:index', component: UserPostsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'recover', component: RecoverComponent },
  { path: 'recover/password/:trans', component: RecoverPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/success', component: RegisterSuccessComponent },
  { path: 'user/:id', component: ProfileViewComponent },

  // otherwise redirect to 404
  { path: '**', component: Component404Component }
];

export const Routing = RouterModule.forRoot(appRoutes);
