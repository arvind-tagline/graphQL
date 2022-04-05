import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  public searchText: string = '';
  public createPost!: FormGroup;
  public updatePostF!: FormGroup;
  public getAllData: any;
  public title: string = '';
  public id: string = '';
  public body: string = '';
  public postId: any;


  //Show api post
  public getData = gql`
  query {
      posts{
        data {
          id
          title
          body
        }
        meta {
          totalCount
        }
      }
    }`


  //create Post 
  public crePost = gql`mutation(
    $input: CreatePostInput!
  ) {
    createPost(input: $input) {
      id
      title
      body
    }
  }`

  //delete Post
  public deletePost = gql`mutation ($id: ID!)   {
    deletePost(id: $id)
  }`

  //Update Post
  public updatePostQL = gql`
  
  mutation (
  $id: ID!,
  $input: UpdatePostInput!
) {
  updatePost(id: $id, input: $input) {
    id
    body
  }
}
`
  constructor(private apollo: Apollo, private fb: FormBuilder, private toastr: ToastrService) {
    this.createPost = this.fb.group({
      title: '',
      body: ''
    });

    this.updatePostF = this.fb.group({
      title: '',
      body: ''
    });
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: this.getData,
    }).valueChanges.subscribe((res: any) => {
      this.getAllData = res.data.posts.data;
      this.toastr.success('Show Posts Succefully');
      console.log('res', res.data.posts.data);
    });
  }


  // Show data by id
  public open(id: string) {
    this.getAllData.find((e: any) => {
      if (e.id == id) {
        this.title = e.title;
        this.id = e.id;
        this.body = e.body;
      }
    });
  }

  //Create post
  public addPost() {
    this.apollo.mutate({
      mutation: this.crePost,
      variables: {
        input: {
          title: this.createPost.value.title,
          body: this.createPost.value.body
        }
      }
    }).subscribe(data => {
      console.log('data :>> ', data);
    })
    console.log('this.create', this.createPost.value)
  }


  //delete post
  public delPost(id: any) {
    this.apollo.mutate({
      mutation: this.deletePost,
      variables: {
        id: id
      }
    }).subscribe(data => {
      console.log('data', data)
    })
  }

  public getPostId(id: any) {
    this.postId = id;
    this.open(id);
    this.updatePostF = this.fb.group({
      title: this.title,
      body: this.body
    })
  }

  public updatePost(id: any) {
    this.apollo.mutate({
      mutation: this.updatePostQL,
      variables: {
      id: id,
        input: {
          body: this.updatePostF.value.body
        }
      }
    }).subscribe(update => {
      console.log('update', update);
    });
  }
}
