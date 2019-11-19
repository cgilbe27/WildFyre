import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MatIconModule, MatListModule, MatSnackBar, MatMenuModule, MatProgressSpinnerModule, MatCardModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { MarkedPipe } from '../_pipes/marked.pipe';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';
import { PostViewComponent } from './postView.component';
import { ClipboardModule } from 'ngx-clipboard';

describe('PostViewComponent', () => {
    let comp: PostViewComponent;
    let fixture: ComponentFixture<PostViewComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        const routerStub = {
          url: '/areas/fun/78270840618'
        };
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const postStub = {};
        const commentStub = {};
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {}
        };
        const authenticationServiceStub = {
            token: 'token'
        };
        const commentServiceStub = {
            deleteComment: () => ({})
        };
        const flagServiceStub = {
            currentComment: {},
            currentPost: {},
            openDialog: () => ({})
        };
        const postServiceStub = {
            getPost: () => {
              return Observable.of(
                new Array<Post>(
                  new Post(1,
                    new Author(1, 'test', null, 'test', false), false, false, '2017-07-22T12:03:23.465373Z', false, 'test', null, [],
                      new Array<Comment>(
                        new Comment(1,
                          new Author(1, 'test', null, 'test', false), '2017-07-22T12:03:23.465373Z', 'test', null)))
                )
              );
            },
            comment: () => ({
                subscribe: () => ({})
            }),
            subscribe: () => ({
                subscribe: () => ({})
            }),
            deletePost: () => ({})
        };
        const profileServiceStub = {
          getSelf: () => {
            return Observable.of(
              new Author(1, 'Test User', null, 'test', false)
            );
          }
        };
        const routeServiceStub = {};
        const navBarServiceStub = {};
        TestBed.configureTestingModule({
            declarations: [ PostViewComponent, MarkedPipe ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Post, useValue: postStub },
                { provide: Comment, useValue: commentStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: CommentService, useValue: commentServiceStub },
                { provide: FlagService, useValue: flagServiceStub },
                { provide: NavBarService, useValue: navBarServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: RouteService, useValue: routeServiceStub }
            ],
            imports: [ MatListModule, MatMenuModule, MatCardModule, ClipboardModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule,
              FormsModule, BrowserAnimationsModule, RouterTestingModule ],
        });
        fixture = TestBed.createComponent(PostViewComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('.mainText'));
        el = de.nativeElement;
    });

    it('should set post text', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(el.textContent).toBe('test\n');
      });
    }));

    it('should set comment text', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.commentText')).nativeElement.textContent).toBe('test\n');
      });
    }));

});
