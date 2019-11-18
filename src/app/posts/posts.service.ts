import { Post } from './post.model';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return {
        posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      }),
      maxPosts: postData.maxPosts
    };
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const post = new FormData();
    post.append('title', title);
    post.append('content', content);
    post.append('image', image, title);

    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  editPost(id: string, title: string, content: string, image: File | string) {
    let post: Post | FormData;
    if (typeof(image) === 'object') {
      post = new FormData();
      post.append('id', id);
      post.append('title', title);
      post.append('content', content);
      post.append('image', image, title);
    } else {
      post = {
        id,
        title,
        content,
        imagePath: image
      };

    }
    console.log(post);
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
