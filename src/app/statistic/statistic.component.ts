import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {QueryService} from "../services/query.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  error: any;
  query: any;
  showMessage: string = '';
  sentEmails: number = 100;

  constructor(private location: Location, private queryService: QueryService,
              private router: Router) { }

  ngOnInit() {
    let id = this.location.path().split('/')[2].replace(':', '');
    if(!id || !id.length){this.error = "Oшибка при парсинге query ID"; return;}
    console.log(id)

    this.queryService.getQuery(id)
      .subscribe(data => {
        try {
          if(data.error){this.error = data.error;return}
          if(data && data._id && data._id.length){
            this.query = data;
            this.startEmailing();
          }else {this.error = "Нет данных по данному запросу";}
          console.log(data)
        }catch (e) {this.error = e;}
        },
        error => {
          this.error = error;
          console.log(error)
        });
  }

  startEmailing(){
    this.queryService.putStartEmailing(this.query._id)
      .subscribe(data => {
          this.showingMessage('data.message')
          try {
            if(data.error){this.error = data.error;return}
            if(data && data.message && data.message.length){
              this.showingMessage(data.message);
              this.getStatistic();
            }else {this.error = "Нeвозможно начять отправку писем";}
            console.log(data)
          }catch (e) {this.error = e;}
        },
        error => {
          this.error = error;
          console.log(error)
        });
  }

  getStatistic(){

    // начать повторы с интервалом 30 сек
    let time = 3000;
    var timer;
    timer = setInterval(()=> {
      this.queryService.getStatistic(this.query._id)
        .subscribe(data => {
            try {
              if(data.error){this.error = data.error;return}
              console.log(data)
              this.sentEmails = parseInt( data.sentemails );
              if(this.sentEmails >= this.query.emails.length) clearInterval(timer);

            }catch(e){this.error = e}
          },
          error => {clearInterval(timer); this.error = error;}
        );
    }, time);


  }



  showingMessage(message){
    this.showMessage = message;
    setTimeout( ()=>{
      this.showMessage = '';
    }, 2000 )
  }

}
