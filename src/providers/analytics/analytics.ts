import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {globalUrl} from "../backend/backend";


export interface Ranking {
  dayOfWeek: number,
  tasksCompleted: number
}
/*
  Generated class for the AnalyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnalyticsProvider {
  private dayOfWeekTasksUrl = globalUrl + "/analysis/tasksPerDay";
  private resetAnalyticsUrl = globalUrl + "/analysis/resetAnalytics";

  constructor(public http: HttpClient) {
    console.log('Hello AnalyticsProvider Provider');
  }

  /**
   * Returns an array of "tasks completed" on each weekDay
   */
  tasksPerDay() {
    return this.http.get<Ranking[]>(this.dayOfWeekTasksUrl);
  }

  /**
   * Reset the "TasksCompleted" and "avgTime" of users in current primary group
   */
  resetAnalytics() {
    return this.http.get<{result: string}>(this.resetAnalyticsUrl);
  }

}
