import { Routes, RouterModule } from '@angular/router';
import { AreaListResolver } from './_resolvers/areaList.resolver';
import { CreatePostResolver } from './_resolvers/createPost.resolver';
import { PostResolver } from './_resolvers/post.resolver';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { Component404Component } from './_shared/404component/404.component';
import { AreaListComponent } from './_shared/areaList/areaList.component';
import { DraftsComponent } from './_shared/drafts/drafts.component';
import { CreatePostComponent } from './_shared/createPost/createPost.component';
import { LoginComponent } from './_shared/login/login.component';
import { ImageUploadComponent } from './_shared/imageUpload/imageUpload.component';
import { NotificationArchiveComponent } from './_shared/notificationArchive/notificationArchive.component';
import { NotificationsComponent } from './_shared/notifications/notifications.component';
import { PasswordComponent } from './_shared/password/password.component';
import { RecoverPasswordComponent } from './_shared/recoverPassword/recoverPassword.component';
import { RecoverPassword2Component } from './_shared/recoverPassword2/recoverPassword2.component';
import { RecoverUsernameComponent } from './_shared/recoverUsername/recoverUsername.component';
import { RegisterComponent } from './_shared/register/register.component';
import { RegisterSuccessComponent } from './_shared/registerSuccess/registerSuccess.component';
import { PostViewComponent } from './_shared/postView/postView.component';
import { ProfileComponent } from './_shared/profile/profile.component';
import { UserPostsComponent } from './_shared/userPosts/userPosts.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: '', component: AreaListComponent, canActivate: [AuthGuard], resolve: {areas: AreaListResolver} },
  { path: 'areas/:area', component: PostViewComponent, resolve: {areas: PostResolver}  },
  { path: 'areas/:area/:id', component: PostViewComponent, resolve: {areas: PostResolver}  },
  { path: 'areas/:area/:id/:comments', component: PostViewComponent },
  { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard], resolve: {areas: CreatePostResolver} },
  { path: 'create/:id', component: CreatePostComponent, canActivate: [AuthGuard], resolve: {areas: CreatePostResolver} },
  { path: 'drafts', component: DraftsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'notifications/:index', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'notification/archive', component: AreaListComponent, canActivate: [AuthGuard], resolve: {areas: AreaListResolver} },
  { path: 'notification/archive/:index', component: AreaListComponent, canActivate: [AuthGuard], resolve: {areas: AreaListResolver} },
  { path: 'posts', component: UserPostsComponent, canActivate: [AuthGuard] },
  { path: 'posts/:index', component: UserPostsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], resolve: {areas: ProfileResolver} }, //done
  { path: 'recover', redirectTo: '', pathMatch: 'full' }, //done
  { path: 'recover/password', component: RecoverPasswordComponent }, //done
  { path: 'recover/password/:trans', component: RecoverPassword2Component }, //done
  { path: 'recover/username', component: RecoverUsernameComponent }, //done
  { path: 'register', component: RegisterComponent }, //done
  { path: 'register/success', component: RegisterSuccessComponent },
  { path: 'tools/image-upload', component: ImageUploadComponent },
  { path: 'tools/password', component: PasswordComponent },
  { path: 'user/:id', component: ProfileComponent, resolve: {areas: ProfileResolver} },

  // otherwise redirect to 404
  { path: '**', component: Component404Component }
];

export const Routing = RouterModule.forRoot(appRoutes);
