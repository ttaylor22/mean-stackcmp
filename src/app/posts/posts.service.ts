import { Post } from './post.model';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
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
      const savePost: Post = {
        id: responseData.post.id,
        title,
        content,
        imagePath: responseData.post.imagePath
      };
      this.posts.push(savePost);
      this.postsUpdated.next([...this.posts]);
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
      const index = this.posts.findIndex(p => p.id === id);
      const savePost: Post = {
        id,
        title,
        content,
        imagePath: image as string
      };
      if (index === -1) {
        this.posts.push(savePost);
      } else {
        this.posts[index] = savePost;
      }
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
