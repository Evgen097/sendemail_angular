import { Component, OnInit } from '@angular/core';
import {QueryService} from "../services/query.service";

class Query {
    query: string;
    id: string;
    error: boolean;
    date: string;
    message: string
}

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})
export class QueriesComponent implements OnInit {
  queries: Array<Query>;
  error: any;

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.queryService.getQueries()
      .subscribe(data => {
          this.queries = data;
          // console.log(this.queries)
        },

        error => {
          this.error = error;
          // console.log(error)
        });
  }

}
