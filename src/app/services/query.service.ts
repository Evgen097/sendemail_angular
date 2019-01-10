import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import {Query} from '../shared/query'
import {Observable} from "rxjs/Observable";
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QueryService {
  query: Query;

  constructor(private http: HttpClient) { }

  getQueries(): Observable<any> {
    return this.http.get<any>(baseURL + 'queries');
  }

  getQuery(id: string): Observable<any> {
    return this.http.get<any>(baseURL + 'query/' + id);
  }

  getStatistic(id: string): Observable<any> {
    return this.http.get<any>(`${baseURL}query/${id}/statistic`);
  }

  postQuery(query: Query): Observable<any> {
    return this.http.post<any>(baseURL + 'queries', query);
  }

  putFindEmails(id: string): Observable<any> {
    return this.http.put<any>(baseURL + '/query/findemails', {id: id});
  }

  putStartEmailing(id: string): Observable<any> {
    return this.http.put<any>(`${baseURL}/query/:${id}/startemailing`, {id: id});
  }

  deleteQuery(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.http.delete<any>( `${baseURL}/queries/${id}`, httpOptions);
  }


}
























