import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';

import {Query} from '../shared/query'
import {QueryService} from "../services/query.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query: Query;
  showQuery: boolean = true;
  queryId: string;
  errorMessage: string;

  errorQuery: boolean = false;

  showSearch: boolean = true;
  showLoader: boolean = false;
  showRedirect: boolean = false;

  timeLeft: number = 5;

  queryForm: FormGroup;
  @ViewChild('fform') feedbackFormDirective;


  constructor(private fb: FormBuilder, private queryService: QueryService,
    private router: Router
    ) {

    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.queryForm = this.fb.group({
      querytext: ['землеустройство харьков', [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ]
    });
  }

  onSubmit() {

    this.query = this.queryForm.value;
    // console.log(this.query);

    this.sendQuery();

    this.queryForm.reset({
      querytext: ''
    });
    this.feedbackFormDirective.resetForm();

  }

      //  {error: null,
      // message: "Start Bing Search ...",
      // id: "1aof6ekjq6xoifc",
      // query: "землеустройство харьков"}

  sendQuery(){
    this.showSearch = false;
    this.showLoader = true;
    this.errorMessage = '';

    this.queryService.postQuery(this.query)
      .subscribe(data => {
          this.errorQuery = false;
          this.showLoader = false;
          console.log('data');
          console.log(data);

          if(data.error){
            this.errorMessage = data.error;
            // console.log(data.error)
            this.showSearch = true;
          }

          if(data && data.id && data.id.length){
            this.queryId = data.id;
            this.showRedirect = true;
            this.startTimer();
          }
        },

        error => {
          this.errorQuery = true;
          this.showSearch = true;
          this.showLoader = false;
          this.showRedirect = false;

          this.errorMessage = error;
          // console.log(error)
        }
      );
  }

  startTimer(){
    let timerId;

    let tick = ()=> {
      this.timeLeft -= 1;
      if(this.timeLeft > 0) {
        timerId = setTimeout(tick, 1000)
      }
      else {
        this.router.navigate(['/query/', this.queryId]);
      };
    };

    timerId = setTimeout(tick, 1000);
  }




}
