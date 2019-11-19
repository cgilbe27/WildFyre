import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import * as C from '../_models/constants'
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
      regex: /(\[img: \d\])/gm,
      replace: (match: string) => {
        const index = Number.parseInt(this.getImageMatchesByGroup(2, match, /(\[img: (\d)\])/gm)[0]);

        if (post) {
          if (!post.additional_images[index]) {
            return '';
          }
        }

        if (comment) {
          return comment.text;
        }

        if (post) {
          return `<a target="_blank" rel="noopener" href="${post.additional_images[index].image}">
          <img class="wfImages" alt="${post.additional_images[index].comment}" src="${post.additional_images[index].image}">
          </a>`;
        } else {
          return '';
        }
      }
    });
    return '<span class="markdown">' + md.render(value || '') + '</span>';
  }
}
