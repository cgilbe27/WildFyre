import { By } from '@angular/platform-browser';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatProgressSpinnerModule, MatSlideToggleModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { MarkedPipe } from '../_pipes/marked.pipe';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { RouteService } from '../_services/route.service';
import { DraftsComponent } from './drafts.component';
import { NgxMasonryModule } from '../_modules/ngx-masonry/ngx-masonry.module';
import { NgxPaginationModule } from 'ngx-pagination';

describe('DraftsComponent', () => {
    let comp: DraftsComponent;
    let fixture: ComponentFixture<DraftsComponent>;

    beforeEach(() => {
        const routerStub = {
          url: '/posts'
        };
        const authenticationServiceStub = {
            token: 'token'
        };
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const postServiceStub = {
            getOwnPosts: () => {
                return Observable.of(
                  new Array<Post>(
                    new Post(1,
                      new Author(1, 'test', null, 'test', false), false, false, '2017-07-22T12:03:23.465373Z', false, 'test', null, [],
                        new Array<Comment>(
                          new Comment(1,
                            new Author(1, 'test', null, 'test', false), '2017-07-22T12:03:23.465373Z', 'test', null)))
                  )
                );
            }
        };
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {},
            getAreaRep: () => ({
                subscribe: () => ({})
            })
        };
        const routeServiceStub = {};

        const navBarServiceStub = {};

        TestBed.configureTestingModule({
            declarations: [ DraftsComponent, MarkedPipe ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: NavBarService, useValue: navBarServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: RouteService, useValue: routeServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MatCardModule, MatProgressSpinnerModule, MatSlideToggleModule, FormsModule, NgxMasonryModule, NgxPaginationModule ],
        });
        fixture = TestBed.createComponent(DraftsComponent);
        comp = fixture.componentInstance;
    });

    it('should set user posts', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.funPosts'))
        .nativeElement.textContent).toBe('test Sat Jul 22 2017 08:03:23 GMT-0400 (Eastern Daylight Time)');
      });
    }));

});
