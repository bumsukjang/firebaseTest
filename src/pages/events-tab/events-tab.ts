import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EventsTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events-tab',
  templateUrl: 'events-tab.html',
})
export class EventsTabPage {
  requests = new Array();
  withinRequests = new Array();
  receivedRequests = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams, public db:DataServiceProvider, public auth:AuthServiceProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsTabPage');
  }

  ionViewDidEnter(){
    this.showEvents();
  }

  showEvents(){
    console.log("show Events");
    this.requests = new Array();
    this.receivedRequests = new Array();
    this.withinRequests = new Array();
    let prevDivider = "";
    let dividers = [
      {set: 1, name: "Today"}, 
      {set: 2, name: "Yeaderday"}, 
      {set: 7, name: "Week"}, 
      {set: 30, name: "Month"}, 
      {set: 30*2, name: "Two Monthes"}, 
      {set: 30*6, name: "six Monthes"}, 
      {set: 30*12, name: "Year"}];     
   
    this.db.getRequestsFrom(this.auth.currentUser.id).forEach(request => {
      request.fromUser = this.db.getUserProfile(request.fromUserId);
      request.toUser = this.db.getUserProfile(request.toUserId);
      let date = new Date(request.time);
      request.timeDisplay = date.toLocaleString();
      request.roomStatus = this.db.getChatRoom(request.id)?this.db.getChatRoom(request.id).status:null;
      request.eventActionName = this.getEventActionName(request.roomStatus, "from");;
      this.requests.push(request);
    });

    this.db.getRequestsWith(this.auth.currentUser.id).forEach(request => {
      request.fromUser = this.db.getUserProfile(request.fromUserId);
      request.toUser = this.db.getUserProfile(request.toUserId);
      let date = new Date(request.time);
      request.timeDisplay = date.toLocaleString();
      request.roomStatus = this.db.getChatRoom(request.id)?this.db.getChatRoom(request.id).status:null;
      request.eventActionName = this.getEventActionName(request.roomStatus, "with");;
      request.divider = "a long ago";
      dividers.forEach(divider =>{
        if(Date.now()-request.time < divider.set * 24 * 60 * 60 * 1000){
          request.divider = divider.name;
        }
      });  
      this.withinRequests.push(request);
    });

    this.db.getRequestsTo(this.auth.currentUser.id).forEach(request => {
      request.fromUser = this.db.getUserProfile(request.fromUserId);
      request.toUser = this.db.getUserProfile(request.toUserId);
      let date = new Date(request.time);
      request.timeDisplay = date.toLocaleString();
      request.roomStatus = this.db.getChatRoom(request.id)?this.db.getChatRoom(request.id).status:null;
      request.eventActionName = this.getEventActionName(request.roomStatus, "to");
      this.receivedRequests.push(request);
    })
    console.log(this.requests);
  }

  makeMeeting(request) {
    console.log(request);
    request.roomStatus = "opened";
    request.eventActionName = this.getEventActionName(request.roomStatus, "with");
    this.db.addChatRoom(request.id, this.auth.currentUser, request.fromUser, request.toUser);   
  }

  joinRoom(request){
    this.db.joinChatRoom(request);
    request.roomStatus = "joined";
    request.eventActionName = this.getEventActionName(request.roomStatus, "to");
  }

  getEventActionName(roomStatus, option){
    if(option == "from"){
      switch(roomStatus){
        case "opened" : return "개설됨";
        case "joined" : return "대화중"; 
        case "closed" : return "대화종료";
        case null : return "요청중"
      }
    } else if(option == "with"){
      switch(roomStatus){
        case "opened" : return "개설됨";
        case "joined" : return "대화중"; 
        case "closed" : return "대화종료";
        case null : return "소개하기"
      }
    } else if(option == "to"){
      switch(roomStatus){
        case "opened" : return "참여하기";
        case "joined" : return "대화중"; 
        case "closed" : return "대화종료";
      }
    }
    
  }
}
