import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

/**
 * Generated class for the ChatRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  @ViewChild(Content) content: Content;

  room;
  message = "";
  messages = new Array();
  userId;
  mo;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db:DataServiceProvider, public auth:AuthServiceProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomPage');
    this.userId = this.auth.currentUser.id;
    this.room = this.db.getChatRoom(this.navParams.get("room").id);
    console.log(this.room);
    this.mo = this.db.getMessageObservable();
    this.mo.subscribe(val =>{
      this.showMessages();
    });
  }

  ionViewDidEnter(){
    this.content.scrollToBottom(0);
    
  }

  showMessages(){
    this.messages = this.db.getMessages(this.room.id);
    this.messages.forEach(message =>{
      message.fromUser = this.db.getUserProfile(message.fromUserId);
    });
    this.content.scrollToBottom(0);
  }

  sendMessage(){
    this.db.sendMessage(this.auth.currentUser.id, this.room.id, this.message);
    this.message = "";
  }

}
