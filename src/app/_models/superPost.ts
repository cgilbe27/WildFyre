import { Post } from './post';

export class SuperPost {
  static parse(obj: any) {
    return new SuperPost(
      obj.count,
      obj.next,
      obj.previous,
      (() => {
        const posts: Post[] = [];
        obj.results.forEach((post: any) => {
          posts.push(Post.parse(post));
        });
        // Sort posts
        posts.sort((a: Post, b: Post) => {
          return b.created.getTime() - a.created.getTime();
        });
        return posts;
      })()  // Call method
    );
  }

  constructor(
    public count: number,
    public next: string,
    public previous: string,
    public results: Post[]
  ) { }

  getError(): SuperPostError {
    return null;
  }
}

export class SuperPostError extends SuperPost {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null);
  }

  getError(): SuperPostError {
    return this;
  }
}
