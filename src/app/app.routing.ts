import { Routes, RouterModule } from '@angular/router';
import { AreaListResolver } from './_resolvers/areaList.resolver';
import { Component404Component } from './_shared/404component/404.component';
import { AreaListComponent } from './_shared/areaList/areaList.component';
import { DraftsComponent } from './_shared/drafts/drafts.component';
import { CreatePostComponent } from './_shared/createPost/createPost.component';
import { LoginComponent } from './_shared/login/login.component';
import { NotificationArchiveComponent } from './_shared/notificationArchive/notificationArchive.component';
import { NotificationComponent } from './_shared/notification/notification.component';
import { RecoverPasswordComponent } from './_shared/recoverPassword/recoverPassword.component';
import { RecoverPassword2Component } from './_shared/recoverPassword2/recoverPassword2.component';
import { RecoverUsernameComponent } from './_shared/recoverUsername/recoverUsername.component';
import { RegisterComponent } from './_shared/register/register.component';
import { RegisterSuccessComponent } from './_shared/registerSuccess/registerSuccess.component';
import { PostViewComponent } from './_shared/postView/postView.component';
import { ProfileComponent } from './_shared/profile/profile.component';
import { ProfileViewComponent } from './_shared/profileView/profileView.component';
import { UserPostsComponent } from './_shared/userPosts/userPosts.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: '', component: AreaListComponent, canActivate: [AuthGuard], resolve: {areas: AreaListResolver} },
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
  { path: 'recover', redirectTo: '', pathMatch: 'full' }, //done
  { path: 'recover/password', component: RecoverPasswordComponent }, //done
  { path: 'recover/password/:trans', component: RecoverPassword2Component }, //done
  { path: 'recover/username', component: RecoverUsernameComponent }, //done
  { path: 'register', component: RegisterComponent }, //done
  { path: 'register/success', component: RegisterSuccessComponent },
  { path: 'user/:id', component: ProfileViewComponent },

  // otherwise redirect to 404
  { path: '**', component: Component404Component }
];

export const Routing = RouterModule.forRoot(appRoutes);
