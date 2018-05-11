import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserListPage } from '../user-list/user-list';

/**
 * Generated class for the FriendTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-tab',
  templateUrl: 'friend-tab.html',
})
export class FriendTabPage {
  connections = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DataServiceProvider, public auth: AuthServiceProvider) {
    this.showConnections();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendTabPage');
  }

  setShow(connection){
    console.log("setShow()");
    console.log(connection);
    console.log(this.connections);
    this.db.setShow(this.auth.currentUser.id, connection);
    //this.connections.forEach(connection =>{
    //this.db.object("friendLists/"+this.auth.currentUser.id+"/"+connection.id).update({isShow:connection.isShow});      
    //});
  }

  addFriend(){
    this.navCtrl.push(UserListPage);
  }

  agreeFriend(connection){
    this.db.agreeFriend(this.auth.currentUser, connection);
    // connection.status = "agreed";
    // this.db.object("friendLists/"+this.auth.currentUser.id+"/"+connection.id).update({
    //   status:connection.status
    // });
    // this.db.object("friendLists/"+connection.id+"/"+this.auth.currentUser.id).update({
    //   status:connection.status
    // });
  }

  showConnections(){
    let friends = this.db.getFriendList(this.auth.currentUser.id);
    friends.forEach(friend =>{
      friend.profile = this.db.getUserProfile(friend.id);
      friend.friends = this.db.getFriendList(friend.id);
    })
    console.log(friends);
    this.connections = friends;
    console.log("show connections");
    console.log(this.connections);
    
  }
}
