import { DataServiceProvider } from './../../providers/data-service/data-service';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

/**
 * Generated class for the SolomeTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-solome-tab',
  templateUrl: 'solome-tab.html',
})
export class SolomeTabPage {
  solomes = new Array();
	requests;

	friendIds = new Array();;
	solomeIds = new Array();;

	showLogs: boolean = true;
  showToast: boolean = false;
  
  constructor(public navCtrl: NavController
    , public auth: AuthServiceProvider
    , public db: DataServiceProvider
    , public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolomeTabPage');
		console.log(this.auth.currentUser);
		if(this.auth.currentUser != null){
			if(!this.auth.currentUser.profile){
				this.toastCtrl.create({
					message: "사용자 정보를 추가하세요",
					duration: 3000,
					position: 'top'
				}).present();
			}
			console.log('[home.ts]-current user');
			console.log(this.auth.currentUser);
    }
  }
  
  ionViewDidEnter(){
   this.showSolomes();
  }

  noWantShow(solome){
    console.log(solome);
  }

  requestMeeting(solome){
    console.log(solome);
    solome.isRequested = true;
    this.db.requestMeeting(this.auth.currentUser.id, solome.friend.id, solome.id);
  }

  showSolomes(){
		console.log("home.ts - showSolomes - this.solomes from "+this.auth.currentUser.id);
		this.solomes = this.db.getSolomeList(this.auth.currentUser.id);
		if(this.solomes.length == 0){
			if(!this.showToast){
				this.toastCtrl.create({
					message: "솔로미가 없습니다.친구를 추가하거나 새로운 친구를 초대하세요.",
					duration: 3000,
					position: 'middle'
				}).present();
				this.showToast = true;
			}
		}
	}
}
