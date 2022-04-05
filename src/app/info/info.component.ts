import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, AfterViewInit {

  // public searchText: string = '';
  @ViewChild('searchText') searchText!: ElementRef;
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
  public updatePostQL = gql`mutation ($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      body
    }
  }`

  //Filter post data start 
  public filter = gql`
  query Posts($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        id
        title
        body
      }
    }
  }`

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
    this.getAllPosts();
  }

  ngAfterViewInit() {
    this.search()
  }

  public getAllPosts() {
    this.apollo.watchQuery({
      query: this.getData,
    }).valueChanges.subscribe((res: any) => {
      if (res) {
        this.getAllData = res.data.posts.data;
        // this.toastr.success('Show Posts Succefully');
        console.log('res', res.data.posts.data);
      } else {
        this.toastr.error('Please Try Again');
      }
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
      if (data) {
        console.log('data :>> ', data);
        this.toastr.success('Added post successfully');
      } else {
        this.toastr.error('Please Try Again');
      }
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
    }).subscribe(del => {
      if (del) {
        this.toastr.success('Deleted Post successfully')
        console.log('delete', del)
      } else {
        this.toastr.error('Please Try Again', 'Post Not Deleted.');
      }
    })
  }

  //Update Post start
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
      if (update) {
        this.toastr.success('Update Post successfully.')
        console.log('update', update);
      } else {
        this.toastr.error('Please Try Again', 'Post Not Updated.')
      }
    });
  }
  //Update Post end

  public search() {


    fromEvent(this.searchText.nativeElement, 'keyup').pipe(debounceTime(1000), distinctUntilChanged()).subscribe((e: any) => {
      this.apollo.watchQuery({
        query: this.filter,
        variables: {
          options: {
            search: {
              q: this.searchText.nativeElement.value
            }
          }
        }
      }).valueChanges.subscribe((data: any) => {
        if (this.searchText.nativeElement.value == "") {
          this.getAllPosts();
        } else {
          this.getAllData = data.data.posts.data;
          console.log('data', data.data.posts.data);
        }
      })
    })




  }


}
