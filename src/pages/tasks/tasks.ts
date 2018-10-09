import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from '@angular/common/http';
import {TaskProvider} from "../../providers/task/task"
import {InputPage} from "../input/input";
import {Task} from "../../providers/task/task";
import {UserProvider} from "../../providers/user/user";
import {LanguageProvider} from "../../providers/language/language"

import { ModalController} from 'ionic-angular';
import {TaskdetailPage} from "../taskdetail/taskdetail";


/**
 * Navigation: From TabsPage
 */
@IonicPage()
@Component({
  selector: 'page-task',
  templateUrl: 'tasks.html'
})
export class TasksPage {
  publics:Task[]=[];
  publicCompletedTasks: Task[];
  privates:Task[]=[];
  privateCompletedTasks: Task[];
  change: string = "to-do";
  no = "No";
  yes = "Yes";
  deleteAlertBody = "Are you sure you want to delete all completed tasks?";
  deleteAlertTitle = "Confirm Delete";


  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient,
              private taskProvider: TaskProvider, private userProvider: UserProvider,
              private translate: LanguageProvider,public modalCtrl: ModalController, private alertCtrl: AlertController) {
    // this.userProvider.getUserById(localStorage.getItem('id')).subscribe((data: User) => {
    //   this.loggedInUser = data;
    // })
  }

  deleteCompletedTasks() {
    this.taskProvider.deleteCompletedTasks().subscribe();
    this.publicCompletedTasks = [];
    this.privateCompletedTasks = [];
  }

  /**
   * Show alert when user clicks on FAB to delete all completed tasks
   */
  showDeleteAlert() {
    let alert = this.alertCtrl.create({
      title: this.deleteAlertTitle,
      message: this.deleteAlertBody,
      buttons: [
        {
          text: this.no,
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.yes,
          handler: () => {
            this.deleteCompletedTasks();
          }
        }
      ]
    });
    alert.present();
  }


  /*
  Sort the tasks into two arrays: completed and not completed(todos)
  after GET request.
   */
  openItem(item: Task) {
    let modal = this.modalCtrl.create(TaskdetailPage, {
      "item":item
    });

    modal.onDidDismiss(data => {
      console.log(data);
      this.sortTasks();
    });
    modal.present();
  }

  /**
   * Pull to refresh
   * @param refresher
   */
  doRefresh(refresher) {
    setTimeout(() => {
      this.sortTasks();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  /**
   * Sort the tasks after retrieving from server
   */
  sortTasks() {
    this.taskProvider.getTasksCompletedPrivate().subscribe(data => {
      this.privateCompletedTasks = data;
    });
    this.taskProvider.getTasksCompletedPublic().subscribe(data => this.publicCompletedTasks = data);
    this.taskProvider.getTasksTodoPrivate().subscribe(data => this.privates = data);
    this.taskProvider.getTasksTodoPublic().subscribe(data => {
      this.publics = data;
      console.log(data);
    });
  }


  /*
  Go to the todo page when FAB is pressed
   */
  itemTapped() {
    this.navCtrl.push(InputPage, {
      //callback: this.callback
    });
  }

  /**
   * Mark an uncompleted task as completed
   * @param item - 0 for public task, 1 for private task
   */
  complete(item: Task, section: number) {
    item.done = 1;
    item.updatedAt = new Date();
    item.completedAt = new Date;
    item.completedDay = item.completedAt.getDay();
    this.taskProvider.updateTask(item).subscribe();
    // Delete from corresponding section
    if (section == 0) {
        let index = this.publics.indexOf(item, 0);
        if (index > -1) {
          this.publics.splice(index, 1);
        }
        this.publicCompletedTasks.push(item);
    } else {
      let index = this.privates.indexOf(item, 0);
      if (index > -1) {
        this.privates.splice(index, 1);
      }
      this.privateCompletedTasks.push(item);
    }
  }

  ionViewWillEnter(){
    this.translate.getTranslate().use(this.translate.getLan());
    this.sortTasks();// Todo add a 'pull to refresh' feature so app loads faster instead of calling this everytime
    this.translate.getTranslate().get('group.yes').subscribe(value => {
      this.yes= value;
    });
    this.translate.getTranslate().get('group.no').subscribe(value => {
      this.no= value;
    });
    this.translate.getTranslate().get('Task.deleteAlertTitle').subscribe(value => {
      this.deleteAlertTitle = value;
    });
    this.translate.getTranslate().get('Task.deleteAlertBody').subscribe(value => {
      this.deleteAlertBody = value;
    });
  }

  /**
   * Delete a task
   * @param item
   * @param section - 0. publicTodos, 1.privateTodos, 2. publicCompleted, 3. privateCompleted
   */
  delete(item: Task, section: number) {
    if (section == 0) {
      this.taskProvider.deleteTask(item.id).subscribe();
      let index = this.publics.indexOf(item, 0);
      if (index > -1) {
        this.publics.splice(index, 1);
      }
    } else if (section == 1) {
      this.taskProvider.deleteTask(item.id).subscribe();
      let index = this.privates.indexOf(item, 0);
      if (index > -1) {
        this.privates.splice(index, 1);
      }
    } else if (section == 2) {
      this.taskProvider.deleteTask(item.id).subscribe();
      let index = this.publicCompletedTasks.indexOf(item, 0);
      if (index > -1) {
        this.publicCompletedTasks.splice(index, 1);
      }
    } else if (section == 3) {
      this.taskProvider.deleteTask(item.id).subscribe();
      let index = this.privateCompletedTasks.indexOf(item, 0);
      if (index > -1) {
        this.privateCompletedTasks.splice(index, 1);
      }
    }
  }

  // /**
  //  * Deletion of private tasks
  //  * @param item - The private task to be deleted
  //  */
  // delete2(item) {
  //   this.taskProvider.deleteTask(item.id).subscribe();
  //   let index = this.privates.indexOf(item, 0);
  //   if (index > -1) {
  //     this.privates.splice(index, 1);
  //   }
  // }

  // /**
  //  * Deletion of completed task
  //  * @param item - item being deleted
  //  */
  // destroy(item) {
  //   this.taskProvider.deleteTask(item.id).subscribe();
  //   let index = this.completes.indexOf(item, 0);
  //   if (index > -1) {
  //     this.completes.splice(index, 1);
  //   }
  // }

  /**
   * Mark a completed item as 'todo'
   * @param item the time to be changed
   * @param section - 2. publicCompletedTasks, 3. privateCompletedTasks
   */
  unComplete(item: Task, section: number) {
    item.done = 0;
    item.completedDay = -1;
    item.completedAt = null;
    if (section == 2) {
      let index = this.publicCompletedTasks.indexOf(item, 0);
      if (index > -1) {
        this.publicCompletedTasks.splice(index, 1);
      }
      this.publics.push(item);
    } else if (section == 3) {
      let index = this.privateCompletedTasks.indexOf(item, 0);
      if (index > -1) {
        this.privateCompletedTasks.splice(index, 1);
      }
      this.privates.push(item);
    }
    this.taskProvider.updateTask(item).subscribe();
  }

}
