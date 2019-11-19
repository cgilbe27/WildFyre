import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogRef, MatMenuModule, MatSlideToggleModule, MatSnackBarModule } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AreaService } from '../_services/area.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { CreatePostComponent } from './createPost.component';
import { RouteService } from '../_services/route.service';
import { MarkedPipe } from '../_pipes/marked.pipe';

describe('CreatePostComponent', () => {
    let comp: CreatePostComponent;
    let fixture: ComponentFixture<CreatePostComponent>;

    beforeEach(() => {
        const mdDialogStub = {
            open: () => ({
                afterClosed: () => ({
                    subscribe: () => ({})
                })
            })
        };
        const routerStub = {
            navigate: () => ({})
        };
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {}
        };
        const navBarServiceStub = {};
        const postServiceStub = {
            createPost: () => ({
                subscribe: () => {
                  return Observable.of('s');
                }
            })
        };
        const mdDialogRefStub = {
            close: () => {
              return 's';
            }
        };
        const routeServiceStub = {
            addNextRoute: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ CreatePostComponent, MarkedPipe ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MatDialog, useValue: mdDialogStub },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: NavBarService, useValue: navBarServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: MatDialogRef, useValue: mdDialogRefStub },
                { provide: RouteService, useValue: routeServiceStub }
            ],
            imports: [ MatMenuModule, MatSlideToggleModule, FormsModule, MatSnackBarModule ],
        });
        fixture = TestBed.createComponent(CreatePostComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should create', inject([PostService], (postService: PostService) => {
      spyOn(postService, 'createPost').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

});
