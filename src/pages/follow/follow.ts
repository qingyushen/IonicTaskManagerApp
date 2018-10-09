import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {LanguageProvider} from "../../providers/language/language";
import {TaskProvider, Task} from "../../providers/task/task";
import {FollowDetailPage} from "../followdetail/followdetail";
import {User, UserProvider} from "../../providers/user/user";

/**
 * Navigation: Second tab in TabsPage
 * Usage: Shows the tasks that are followed by the user
 */
@IonicPage()
@Component({
  selector: 'page-follow',
  templateUrl: 'follow.html',
})
export class FollowPage {

  //toMe: Set<string> = new Set<string>(); // Followed tasks assigned to me
  followedAndAssignedToMe: Task[] = [];
  followedAndAssignedToMeCompleted: Task[];
  followedAndAssignedToOthers: Task[] = [];
  followedAndAssignedToOthersCompleted: Task[] = [];
 // toOther: Set<string> = new Set<string>(); // Followed tasks assigned to others
  todos: Task[] = []; // All followed tasks on the page
  loggedInUser: User; // The user who is logged in and using the app
  change: string = "to-do";

  /**
   * Do translation to selected language and set the loggedInUser variable
   * @param navCtrl
   * @param userProvider
   * @param taskProvider
   * @param navParams
   * @param translate
   * @param modalCtrl
   */
  constructor(public navCtrl: NavController, public  userProvider: UserProvider, public taskProvider: TaskProvider,
              public navParams: NavParams, public translate: LanguageProvider, public modalCtrl: ModalController) {

    this.translate.getTranslate().use(this.translate.getLan()); // translation
    this.userProvider.getUserById(localStorage.getItem('id')).subscribe((data: User) => {
      this.loggedInUser = data;
    })
  }

  isAuthor(task: Task) {
    if(task.authorID == localStorage.getItem('id')) {
      return true;
    }
    return false;
  }

  isAssignedTo(task: Task) {
    if (task.assignedToID.toString() == localStorage.getItem('id')) {
      return true;
    }
    return false;
  }

  /**
   * Sort the tasks after retrieving from server
   */
  getFollow() {
    this.taskProvider.getFollowedOthersCompleted().subscribe(data => this.followedAndAssignedToOthersCompleted = data);
    this.taskProvider.getFollowedOthersTodo().subscribe(data => this.followedAndAssignedToOthers = data);
    this.taskProvider.getFollowedSelfCompleted().subscribe(data => this.followedAndAssignedToMeCompleted = data);
    this.taskProvider.getFollowedSelfTodo().subscribe(data => this.followedAndAssignedToMe = data);
  }

  /**
   * Navigate to a specific task
   * @param item
   */
  openItem(item: Task) {
    let modal = this.modalCtrl.create(FollowDetailPage, {
      "task": item,
    });
    modal.onDidDismiss(data => {
      this.getFollow() // Todo change this
    });
    modal.present()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowPage');
  }

  ionViewWillEnter() {
    this.translate.getTranslate().use(this.translate.getLan())
    this.getFollow();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getFollow();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  // DEPRECATED Sept 9th 2018
  // /**
  //  * Seperate the followed tasks into the two sets: toMe and toOther for displaying in view
  //  */
  // getFollow() {
  //   //this.toMe = new Set<string>();
  //   //this.toOther = new Set<string>();
  //   this.followedAndAssignedToOthers = [];
  //   this.followedAndAssignedToMe = [];
  //   this.taskProvider.getFollows().subscribe((data: Task[]) => {
  //     this.todos = data;
  //     console.log(data);
  //     for (let i = 0; i <= data.length; i++) {
  //       if (data[i] == null) {
  //         continue;
  //       }
  //       else {
  //         if (data[i].assignedToName == localStorage.getItem('name')) {
  //           //this.toMe.add(data[i].bodyText)
  //           this.followedAndAssignedToMe.push(data[i]);
  //         }
  //         else {
  //           this.followedAndAssignedToOthers.push(data[i]);
  //           //this.toOther.add(data[i].bodyText)
  //         }
  //       }
  //     }
  //     //console.log(this.toOther)
  //   })
  //
  // }

  /**
   * Unfollow a task
   * @param item - Task to be unfollowed
   * @param section - either in the toMe or toOthers section of page
   *//*
  unfollow(item: Task, section: number) {
    // Delete from the HTML view arrays
    if (section == 0) {
      //this.toMe.delete(item);
      let index = this.followedAndAssignedToMe.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToMe.splice(index, 1);
      }
    } else if (section == 1) {
      //this.toOther.delete(item);
      let index = this.followedAndAssignedToOthers.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToOthers.splice(index, 1);
      }
    }

    for (let t = 0; t <= this.todos.length; t++) {
      if (this.todos[t] != null && this.todos[t] == item) {
        let index = this.todos[t].followedBy.indexOf(this.loggedInUser, 0);
        if (index > -1) {
          this.todos[t].followedBy.splice(index, 1);
        }
        let users: number[] = [];
        let x = Number(localStorage.getItem('id'));
        users.push(x);
        this.taskProvider.deleteFollower(this.todos[t].id.toString(), users).subscribe();
        break;
      }
    }
  }*/

  /**
   * Mark an uncompleted followed task as completed
   * @param item - Task to be completed
   * @param section - either in the toMe or toOthers section of page
   */
  complete(item: Task, section: number) {
    // Delete from the HTML view arrays
    if (section == 0) {
      //this.toMe.delete(item);
      let index = this.followedAndAssignedToMe.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToMe.splice(index, 1);
      }
      this.followedAndAssignedToMeCompleted.push(item);
    } else if (section == 1) {
      //this.toOther.delete(item);
      let index = this.followedAndAssignedToOthers.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToOthers.splice(index, 1);
      }
      this.followedAndAssignedToOthersCompleted.push(item);
    }

    item.done = 1;
    item.updatedAt = new Date();
    item.completedAt = new Date;
    item.completedDay = item.completedAt.getDay();
    this.taskProvider.updateTask(item).subscribe();
  }

  /**
   * Mark a completed item as 'todo'
   * @param item the time to be changed
   */
  unComplete(item: Task, section: number) {
    item.done = 0;
    item.completedDay = -1;
    item.completedAt = null;
    if (section == 0) {
      //this.toMe.delete(item);
      let index = this.followedAndAssignedToMeCompleted.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToMeCompleted.splice(index, 1);
      }
      this.followedAndAssignedToMe.push(item);
    } else if (section == 1) {
      //this.toOther.delete(item);
      let index = this.followedAndAssignedToOthersCompleted.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToOthersCompleted.splice(index, 1);
      }
      this.followedAndAssignedToOthers.push(item);
    }
    this.taskProvider.updateTask(item).subscribe();
  }

  /**
   * Delete a followed task
   * @param item - Task to be deleted
   * @param section - either in the toMe or toOthers section of page
   */
  delete(item: Task, section: number) {
    // If task is in toMe or toOther, do corresponding deletion
    if (section == 0) {
      let index = this.followedAndAssignedToMe.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToMe.splice(index, 1);
      }
    } else if (section == 1) {
      let index = this.followedAndAssignedToOthers.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToOthers.splice(index, 1);
      }
    } else if (section == 2) {
      let index = this.followedAndAssignedToMeCompleted.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToMeCompleted.splice(index, 1);
      }
    } else if (section == 3) {
      let index = this.followedAndAssignedToOthersCompleted.indexOf(item, 0);
      if (index > -1) {
        this.followedAndAssignedToOthersCompleted.splice(index, 1);
      }
    }
    this.taskProvider.deleteTask(item.id).subscribe();
    // Loop through the tasks to find which should be deleted
    // for (let t = 0; t <= this.todos.length; t++) {
    //   if (this.todos[t] != null && this.todos[t] == item) {
    //     let index = this.todos[t].followedBy.indexOf(this.loggedInUser, 0);
    //     if (index > -1) {
    //       this.todos[t].followedBy.splice(index, 1);
    //     }
    //     this.taskProvider.deleteTask(this.todos[t].id).subscribe();
    //     break;
    //   }
    // }
  }


}
