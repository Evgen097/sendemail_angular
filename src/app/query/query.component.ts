import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {QueryService} from "../services/query.service";
import { Router } from '@angular/router';

let obj =
    {
      "_id": "1aof46ojq6pyyqr",
      "query": "харьков землеустроительные работы1",
      "error": null,
      "date": "четверг, 27 декабря 2018 г., 16:44",
      "message": "Обработка завершена, получено: 2 соответствий",
      "sentmessages": 0,
      "webpages": [
        {
          "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0",
          "name": "Развитие семантических технологий информационно ...",
          "url": "http://tekhnosfera.com/razvitie-semanticheskih-tehnologiy-informatsionno-analiticheskih-sluzhb-v-korporativnom-i-administrativnom-upravlenii",
          "isFamilyFriendly": true,
          "displayUrl": "tekhnosfera.com/razvitie-semanticheskih-tehnologiy-informatsionno...",
          "snippet": "Введение. Глава 1. Общесистемный кризис корпоративного и административного управления ...",
          "dateLastCrawled": "2018-10-31T16:48:00.0000000Z",
          "language": "ru",
          "isNavigational": false
        },
        {
          "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.1",
          "name": "Диссертация на тему «Развитие семантических технологий ...",
          "url": "http://www.dissercat.com/content/razvitie-semanticheskikh-tekhnologii-informatsionno-analiticheskikh-sluzhb-v-korporativnom-i",
          "isFamilyFriendly": true,
          "displayUrl": "www.dissercat.com/content/razvitie-semanticheskikh-tekhnologii-in...",
          "snippet": "Выводы ко второй главе . 1. Становление и развитие фундаментальной информатики в России в начале шестидесятых годов и современное ее состояние способствовали возникновению так называемых отраслевых информатик ...",
          "dateLastCrawled": "2018-12-13T06:52:00.0000000Z",
          "language": "ru",
          "isNavigational": false
        },
        {
          "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0",
          "name": "Развитие семантических технологий информационно ...",
          "url": "http://tekhnosfera.com/razvitie-semanticheskih-tehnologiy-informatsionno-analiticheskih-sluzhb-v-korporativnom-i-administrativnom-upravlenii",
          "isFamilyFriendly": true,
          "displayUrl": "tekhnosfera.com/razvitie-semanticheskih-tehnologiy-informatsionno...",
          "snippet": "Введение. Глава 1. Общесистемный кризис корпоративного и административного управления ...",
          "dateLastCrawled": "2018-10-31T16:48:00.0000000Z",
          "language": "ru",
          "isNavigational": false
        },
        {
          "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.1",
          "name": "Диссертация на тему «Развитие семантических технологий ...",
          "url": "http://www.dissercat.com/content/razvitie-semanticheskikh-tekhnologii-informatsionno-analiticheskikh-sluzhb-v-korporativnom-i",
          "isFamilyFriendly": true,
          "displayUrl": "www.dissercat.com/content/razvitie-semanticheskikh-tekhnologii-in...",
          "snippet": "Выводы ко второй главе . 1. Становление и развитие фундаментальной информатики в России в начале шестидесятых годов и современное ее состояние способствовали возникновению так называемых отраслевых информатик ...",
          "dateLastCrawled": "2018-12-13T06:52:00.0000000Z",
          "language": "ru",
          "isNavigational": false
        }
      ],
      "emails": [],
      "emailstatistics": {}
    };



@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  query: any;
  error: any;
  emailStatisticsLenght: any;
  fetching: boolean = false;

  constructor(private location: Location, private queryService: QueryService,
              private router: Router) { }

  ngOnInit() {
    let id = this.location.path().split('/')[2];
    if(!id || !id.length){this.error = "Oшибка при парсинге query ID"; return;}

    this.queryService.getQuery(id)
      .subscribe(data => {
          if(data.error){this.error = data.error;return}

          if(data && data._id && data._id.length){
            this.query = data;
            this.emailStatisticsLenght = Object.keys(this.query.emailstatistics).length;
          }else {
            this.error = "Нет данных по данному запросу";
          }
          console.log(data)
        },
        error => {
          this.error = error;
          console.log(error)
        });
  }


  updeteQuery(){

    // начать повторы с интервалом 30 сек
    let time = 3000;
    var timer;
    timer = setInterval(()=> {
      this.queryService.getQuery(this.query._id)
        .subscribe(data => {

            if(data.error){this.error = data.error;return}

            if(data && data._id && data._id.length && data.fetchemails){
              clearInterval(timer);
              this.fetching = false;
              this.query = data;
              this.emailStatisticsLenght = Object.keys(this.query.emailstatistics).length;
            }
          },
          error => {clearInterval(timer); this.error = error;}
        );
    }, time);
  }


  fetchEmails(){
    this.fetching = true;

    this.queryService.putFindEmails(this.query._id)
      .subscribe(data => {
          if(data.error){
            this.fetching = false;
            this.error = data.error;
            return
          }
          this.updeteQuery();
        },
        error => {
          this.fetching = false;
          this.error = error;
        }
      );
  }

  deleteQuery(){
    this.queryService.deleteQuery(this.query._id)
      .subscribe(data => {
          if(data && data.error){
            this.error = data.error;
            return
          }
          this.router.navigate(['/queries/']);
        },
        error => {
          this.error = error;
        }
      );
  }

  sendEmails(){
    // let path = `query/:${this.query._id}/statistic/`;
    // console.log(path)
    this.router.navigate([`query/:${this.query._id}/statistic/`]);
    // this.router.navigate(['query/', this.query._id, '/statistic/']);
  }



}
