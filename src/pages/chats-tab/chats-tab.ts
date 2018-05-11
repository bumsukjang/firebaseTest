import { DataServiceProvider } from './../../providers/data-service/data-service';
import { ChatRoomPage } from './../chat-room/chat-room';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ChatsTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats-tab',
  templateUrl: 'chats-tab.html',
})
export class ChatsTabPage {
  chatRooms = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, public db:DataServiceProvider, public auth:AuthServiceProvider) {
  }

  ionViewDidEnter(){

    console.log('ionViewDidEnter ChatsTabPage');
    this.showRooms();
  }

  showRooms(){
    this.chatRooms = this.db.getChatRoomsFrom(this.auth.currentUser.id);
    let chatRoomsTo = this.db.getChatRoomsTo(this.auth.currentUser.id);
    console.log(chatRoomsTo);
    chatRoomsTo.forEach(chatRoom =>{
      this.chatRooms.push(chatRoom);
    });
    console.log(this.chatRooms);
  }
  
  enterRoom(room){
    this.navCtrl.push(ChatRoomPage,{
      room: room
    });
  }

  doRefresh(refresher) {
    this.showRooms();
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }

}
