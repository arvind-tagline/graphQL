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
  public getAllData: any;
  public title: string = '';
  public id: string = '';
  public body: string = '';

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

  constructor(private apollo: Apollo, private fb: FormBuilder, private toastr: ToastrService) { }

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
}
