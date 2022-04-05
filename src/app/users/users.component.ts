import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit , AfterViewInit{

  public userAllData: any;
  public id: any;
  public name: any;
  public username: any;
  public email: any; 
  public createUser!: FormGroup;
  public updateUserF!: FormGroup;
  @ViewChild('searchText') searchText!: ElementRef;


  //show all users
  public getUsers = gql`query Query {
  users {
    data {
      id
      name
      username
      email
    }
     meta {
          totalCount
        }
  }
  }`


  //Create user
  public createUsers = gql`mutation(
    $input: CreateUserInput!
  ) {
    createUser(input: $input) {
      id
      name
      username
      email
    }
  }`

  constructor(private apollo: Apollo, private fb:FormBuilder) { 
    this.createUser = this.fb.group({
      name: '',
      username: '',
      email: ''
    });

    this.updateUserF = this.fb.group({
      name: '',
      username: '',
      email:''
    })
  }

  ngOnInit(): void {
    this.getUsersData();
  }

  ngAfterViewInit(): void{
    this.search();
  }

  public getUsersData():void {
    this.apollo.watchQuery({
      query: this.getUsers
    }).valueChanges.subscribe((res: any) => {
      this.userAllData = res.data.users.data;
      console.log('res', res.data.users.data)
    })
  }


  //Show single data for
  public open(id: string): void {
    this.userAllData.find((e: any) => {
      if (e.id == id) {
        this.id = e.id;
        this.name = e.name;
        this.username = e.username;
        this.email=e.email;
      }
    });
  }

//Create User
  public addUser(): void{
    this.apollo.mutate({
      mutation: this.createUsers,
      variables: {
        input: {
          name: this.createUser.value.name,
          username: this.createUser.value.username,
          email:this.createUser.value.email
        }
      }
    }).subscribe((res: any) => {
      console.log('res', res)
    })
  }

  //delete post
  public deletePost = gql`mutation ($id: ID!)   {
    deleteUser(id: $id)
  }`
  public delPost(id: any): void {
    this.apollo.mutate({
      mutation: this.deletePost,
      variables: {
        id: id
      }
    }).subscribe(del => {
      console.log('del', del)
      // if (del) {
      //   this.toastr.success('Deleted Post successfully')
      //   console.log('delete', del)
      // } else {
      //   this.toastr.error('Please Try Again', 'Post Not Deleted.');
      // }
    })
  }


  //Update user
  public updateUserQL = gql`mutation ($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      username
      email
    }
  }`

  public userId: any;
  public getPostId(id: any): void {
    this.userId = id;
    this.open(id);
    this.updateUserF = this.fb.group({
      name: this.name,
      username: this.username,
      email:this.email
    })
  }

  public updateUser(id: any): void {
    this.apollo.mutate({
      mutation: this.updateUserQL,
      variables: {
        id: id,
        input: {
          name: this.updateUserF.value.name,
          username: this.updateUserF.value.username,
          email: this.updateUserF.value.email
        }
      }
    }).subscribe(update => {
      console.log('update', update);
      // if (update) {
      //   this.toastr.success('Update Post successfully.')
      //   console.log('update', update);
      // } else {
      //   this.toastr.error('Please Try Again', 'Post Not Updated.')
      // }
    });
  }
  //Update Post end



  //search user

  public filter = gql`
  query Users($options: PageQueryOptions) {
    users(options: $options) {
      data {
        id
       name
       username
       email
      }
    }
  }`
  public search(): void {
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
          this.getUsersData();
        } else {
          this.userAllData = data.data.users.data;
          console.log('data', data.data.users.data);
        }
      });
    });
  }
}
