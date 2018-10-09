import { Component, ViewChild } from '@angular/core';
import chartJs from 'chart.js';

import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {User, UserProvider} from "../../providers/user/user";
import {AnalyticsProvider, Ranking} from "../../providers/analytics/analytics";
import {LanguageProvider} from "../../providers/language/language";
import {Group, GroupAuth} from "../../providers/group/group";

/**
 * Navigation: Click on the analytics button on OverviewPage
 * Usage: Provides statistics for current group about users and tasks relations
 */
@IonicPage()
@Component({
  selector: 'page-analytics',
  templateUrl: 'analytics.html',
})
export class AnalyticsPage {
  users: User[]; // all users
  sortedUsers: User[]; // users sorted by # tasks completed
  sortUsersByAvgTime: User[];
  tasksPerDay: Ranking[]; // Tasks completed on each day of the week
  Monday:string;
  Tuesday:string;
  Wednesday:string;
  Thursday:string;
  Friday:string;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('halfDoughnutCanvas') halfDoughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('radarCanvas') radarCanvas;
  @ViewChild('polarCanvas') polarCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('bubbleCanvas') bubbleCanvas;
  @ViewChild('mixedCanvas') mixedCanvas;

  barChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
              public analyticsProvider: AnalyticsProvider,public translate: LanguageProvider,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalyticsPage');
  }

  ionViewWillEnter() {
    this.translate.getTranslate().use(this.translate.getLan());
    this.translate.getTranslate().get('analytics.Monday').subscribe(value => {
      this.Monday=value
    });
    this.translate.getTranslate().get('analytics.Tuesday').subscribe(value => {
      this.Tuesday=value
    });
    this.translate.getTranslate().get('analytics.Wednesday').subscribe(value => {
      this.Wednesday=value
    });
    this.translate.getTranslate().get('analytics.Thursday').subscribe(value => {
      this.Thursday=value
    });
    this.translate.getTranslate().get('analytics.Friday').subscribe(value => {
      this.Friday=value
    });
    this.userProvider.getUsers().subscribe(data => {
      this.users =  data;
      this.sortedUsers = this.users.sort((a,b) => {
        return (b.tasksCompleted - a.tasksCompleted);
      })
      this.sortUsersByAvgTime = this.users.sort((a,b) => {
        return (b.avgTime - a.avgTime);
      })
    });
    this.analyticsProvider.tasksPerDay().subscribe( data => {
      this.tasksPerDay = data;
      console.log(data);
      this.barChart = this.getBarChart();
    })
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType,
    });
  }

  /**
   * Populate the bar chart with data obtained from backend and initalized in constructor
   */
  getBarChart() {
    const data = {
      labels: [this.Monday,this.Tuesday,this.Wednesday,this.Thursday,this.Friday],
      datasets: [{
        label: '# of Tasks',
        data: [this.tasksPerDay[0].tasksCompleted, this.tasksPerDay[1].tasksCompleted, this.tasksPerDay[2].tasksCompleted,
          this.tasksPerDay[3].tasksCompleted, this.tasksPerDay[4].tasksCompleted],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options);
  }

  /**
   * Confirm that user wants to reset analytics
   * @param team
   */
  showResetConfirm() {
    let alert = this.alertCtrl.create({
      title: "Confirm Reset",
      message: "Are you sure you would like to reset all analytics?",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Confirm",
          handler: () => {
            this.resetHandler();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Reset analytics after confirming action on the alertCtrl
   */
  resetHandler() {
    this.analyticsProvider.resetAnalytics().subscribe( data => {
    });
    for (let i = 0; i < this.sortedUsers.length; i++) {
      this.sortedUsers[i].tasksCompleted = 0;
    }
    for (let i = 0; i < this.sortUsersByAvgTime.length; i++) {
      this.sortUsersByAvgTime[i].avgTime = 0;
    }
  }

  /**
   * Only show the reset analytics button if user is an admin
   */
  isAdmin() {
    return localStorage.getItem('privilege') == 'admin' ? true : false;
  }


}
