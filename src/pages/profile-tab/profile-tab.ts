import { DataServiceProvider } from './../../providers/data-service/data-service';
import { LoginPage } from './../login/login';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfileTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-tab',
  templateUrl: 'profile-tab.html',
})
export class ProfileTabPage {
  user;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider, public db: DataServiceProvider) {
    this.user = auth.currentUser;
    console.log("user : ");
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileTabPage');
  }

  saveSetting(){
    console.log("[contact] saveSetting : user setting info:");
    console.log(this.user);
    this.db.updateUserProfile(this.user);
  }

  upload(event) {
    //this.afStorage.upload('/upload/to/this-path', event.target.files[0]);  
  }

  logout(){
    this.auth.logout();
    this.navCtrl.parent.viewCtrl._nav.setRoot(LoginPage);
  }

}
