import { Component, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Platform, platforms } from '../platforms.utils';
import { Properties } from '../properties.utils';

@Component({
  selector: 'app-share-button',
  template: `<a href="{{this.url}}" (click)="click($event)" target='_blank'>
              <div  (click)="click($event)"
                class="n2s-share-btn n2s-share-btn-{{platform.name}} n2s-{{direction}}-margin
                  {{textEnabled ? 'n2s-share-btn-with-text' : '' }}">
                <i class="ic fa fa-{{platform.logoOfficial}}"></i>
                <span class="n2s-shareText" *ngIf="textEnabled">
                  <span class="n2s-shareText-primary">{{platform.text}} </span>
                  <span class="n2s-shareText-secondary">{{addedText}}</span>
                </span>
              </div>
            </a>
            `,
  styleUrls: ['./share-button.css']
})
export class ShareButtonComponent implements OnInit {
  @Input() platformName: any;
  platform: Platform;
  @Input() textEnabled: boolean;
  @Input() addedText: string;
  @Input() direction = 'horizontal';
  @Input() properties: Properties;
  platforms: Platform[];
  url: string;

  constructor() { }

  ngOnInit() {
    this.platform = (platforms as any)[this.platformName];
    this.constructUrl();
  }

  click(event: any) {
    window.open(this.url, 'newwindow', 'width=1070, height=600');
    event.preventDefault();
  }

  constructUrl() {
    this.url = this.platform.url + this.properties.url;
    if (this.platform.properties) {
      for (const key in this.platform.properties) {
        if (this.platform.properties.hasOwnProperty(key)) {
          // if the property has been found.
          const val = (this.properties as any)[this.platform.properties[key]];
          if (val) {
            this.url += `&${key}=${val}`;
          }
        }
      }
    }
  }
}
