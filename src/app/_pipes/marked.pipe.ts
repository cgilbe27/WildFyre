import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import * as C from '../_models/constants';
import * as marked from 'markdown-it';
import markdownItRegex from 'markdown-it-regex';

const md = new marked('default', {
  linkify: true,
  html: false,
  xhtmlOut: true
 });

@Pipe({
  name: 'marked'
})
export class MarkedPipe implements PipeTransform {
  getImageMatchesByGroup(index: number, str: string, reg: RegExp): string[] {
    let match: any;
    const matches: string[] = [];
    // Find any occurence of image markdown
    while ((match = reg.exec(str))) {
      if (match[index] !== undefined) {
        matches.push(match[index]);
      }
    }
    return matches;
  }

  transform(value: string, post: Post, comment: Comment): string {
    md.use(markdownItRegex, {
      name: 'customImage',
      regex: C.WF_IMAGE_REGEX_NO_CAPTURE,
      replace: (match: string) => {
        const i = parseInt(this.getImageMatchesByGroup(2, match, C.WF_IMAGE_REGEX)[0], 10);

        if (comment) {
          return comment.text;
        }

        if (post) {
          if (!post.additional_images[i]) {
            return '';
          }

          return `<a target="_blank" rel="noopener" href="${post.additional_images[i].image}">
          <img class="wfImages" alt="${post.additional_images[i].comment}" src="${post.additional_images[i].image}">
          </a>`;
        } else {
          return '';
        }
      }
    });

    return `<span class="markdown">${md.render(value || '', {})}</span>`;
  }
}
