import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LanguageProvider } from "../../providers/language/language";
import { ScrollHideConfig } from '../scroll-hide';
import {TaskProvider,Task,Updates} from "../../providers/task/task";

/**
 * Generated class for the UpdatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-updates',
  templateUrl: 'updates.html',
})
export class UpdatesPage {
  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
  Tasks:Task[]=[];
  items:Updates[]=[];
  status:string;
  time:string;
  curHour:number;
  curMin:number;
  curDay:number;
  upHour:number;
  upMin:number;
  upDay:number;
  days:string;
  hours:string;
  mins:string;
  Updated:string;
  Completed:string;
  Created:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public translate: LanguageProvider,public taskprovider:TaskProvider) {
    this.translate.getTranslate().setDefaultLang(this.translate.getLan())
    this.translate.getTranslate().get('updates.day').subscribe(value => {
      this.days=value
    });
    this.translate.getTranslate().get('updates.hour').subscribe(value => {
      this.hours=value
    });
    this.translate.getTranslate().get('updates.min').subscribe(value => {
      this.mins=value
    });
    this.translate.getTranslate().get('updates.updated').subscribe(value => {
      this.Updated=value
    });
    this.translate.getTranslate().get('updates.created').subscribe(value => {
      this.Created=value
    });
    this.translate.getTranslate().get('updates.completed').subscribe(value => {
      this.Completed=value
    });
  }


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      // while(this.items.length!=0){
      //   this.items.pop();
      // }
      this.items = [];
      this.getUpdate();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ionViewWillEnter(){
    this.translate.getTranslate().use(this.translate.getLan());
    this.getUpdate()
  }
  getUpdate(){
    this.taskprovider.getTeamUpdates().subscribe((data:Task[]) => {
        this.Tasks=data;
        for(let t=0;t<this.Tasks.length;t++){
          console.log(this.Tasks[t].bodyText+this.Tasks[t].done)
          const day=new Date(this.Tasks[t].dateTime).getDate().toString(); // todo change this to be like analytics
          const month=new Date(this.Tasks[t].dateTime).getMonth().toString();
          const year=new Date(this.Tasks[t].dateTime).getFullYear().toString();
          this.upHour=new Date(this.Tasks[t].updatedAt).getHours();
          this.upMin=new Date(this.Tasks[t].updatedAt).getMinutes();
          this.upDay=new Date(this.Tasks[t].updatedAt).getDay();
          const date=year+"-"+month+"-"+day;
          this.curHour=new Date().getHours();
          this.curMin=new Date().getMinutes();
          this.curDay=new Date().getDay();
          const gapDay=Math.abs(this.curDay-this.upDay);
          const gapMin=Math.abs(this.curMin-this.upMin);
          const gapHour=Math.abs(this.curHour-this.upHour);
          if(this.Tasks[t].done>=2){
            this.status=this.Updated
          }
          else{
            if(this.Tasks[t].done<=0){
              this.status=this.Created
            }
            else{
              this.status=this.Completed
            }
          }

          if(gapDay==0){
            const type=this.status+gapHour.toString()+this.hours+ gapMin.toString()+this.mins;
            const Up:Updates={
              author:this.Tasks[t].assignedToName,
              content:this.Tasks[t].bodyText,
              icon:"calendar",
              time:{title:date,subtitle:type}
            };
            this.items.push( Up )
          }
          else {
            const type=this.status+gapDay.toString()+this.days+gapHour.toString()+this.hours+ gapMin.toString()+this.mins;
            const Up: Updates = {
              author:this.Tasks[t].assignedToName,
              content:this.Tasks[t].bodyText,
              icon:"calendar",
              time:{title:date,subtitle:type}
            };
            this.items.push( Up )
          }

        }
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatesPage');
  }

}
