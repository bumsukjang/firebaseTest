import { Observable } from 'rxjs/Observable';
/* import { HttpClient } from '@angular/common/http'; */
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
/*  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {
  
  
  rooms = new Array();
  users = new Array();
  friendLists = new Array();
  requests = new Array();
  messages = new Array();
  messageObservable: Observable<any>;
  chatListners = new Array();
  constructor(public db: AngularFireDatabase) {
    console.log('Hello DataServiceProvider Provider');

    //console.log('Hello DataService Provider');
    db.list('users').valueChanges().subscribe(val =>{
        //console.log("[data service] - constructor : users ");                
        this.users = val;
        //console.log(this.users);    
    });

    this.messageObservable = db.list('messages').snapshotChanges().map(actions =>{
      //console.log("[data service] - constructor : friendLists ");      
      return actions.map(action => ({
        id: action.key,
        data: action.payload.val()
      }));
    });
    this.messageObservable.subscribe(val =>{
      console.log("[data service] - constructor : messages ");                
      this.messages = val;
      this.broadcastMessage();   
  });

    db.list('requests').snapshotChanges().map(actions =>{
      //console.log("[data service] - constructor : friendLists ");      
      return actions.map(action => ({
        id: action.key,
        ...action.payload.val()
      }));
    }).subscribe(val => {                      
        this.requests = val;
        //console.log(this.friendLists);    
    });

    db.list('friendLists').snapshotChanges().map(actions =>{
        //console.log("[data service] - constructor : friendLists ");      
        return actions.map(action => ({
          withId: action.key,
          data : action.payload.val()
        }));
    }).subscribe(val => {                      
      console.log("friendLists changed");      
      this.friendLists = val;
      console.log(this.friendLists);    
    });
    
    db.list('chatRooms').snapshotChanges().map(actions => {
      return actions.map(action => ({
        id: action.key,
        ...action.payload.val()
      }));
    }).subscribe(val => {
      this.rooms = val;
    })
  }

  requestMeeting(userId, friendId, solomeId){        
    return this.db.list('requests').push({
      makerId : friendId,
      toUserId : solomeId,
      fromUserId : userId,
      time: Date.now()
    });
  }

  getRequestsFrom(userId){
    return this.requests.filter(request => {
      if(request != null){
        return (request.fromUserId == userId);
      }
    });
  }

  getRequestsWith(userId){
    return this.requests.filter(request => {
      if(request != null){
        return (request.makerId == userId);
      }
    });
  }

  getRequestsTo(userId){
    return this.requests.filter(request => {
      if(request != null){
        return (request.toUserId == userId);
      }
    })
  }

  getUsersList(options?){
    return this.users;
  }

  getUserProfile(userId){
    let userProfile = this.users.filter((user)=>{
      if(userId != null){
        return (user.id == userId);
      } else {
        return false;
      }
    });
    return userProfile[0];
  }

  addChatRoom(roomId, maker, requester, receiver) {
    this.db.object("chatRooms/"+roomId).set({
      members: [{id: requester.id}, 
        {id: receiver.id}, 
        {id: maker.id}],      
      makerId: maker.id,
      timestamp: Date.now(),
      status: "opened",
      messages: []
    });
  }

  joinChatRoom(request){
    this.db.object('chatRooms/'+request.id).update({
      status: "joined"
    })
  }

  getChatRoom(roomId){
    let rooms = this.rooms.filter(room =>{
      if(room != null){
        return (room.id == roomId);
      }
    });
    console.log(this.rooms);
    console.log("rooms");
    console.log(roomId);
    console.log(rooms);
    rooms.forEach(room =>{
      room.members.forEach(member => {
        member.profile = this.getUserProfile(member.id);
      });
      room.lastMessage = {
        created: room.timestamp,
        timeDisplay: new Date(room.timestamp).toLocaleTimeString(),
        text: "내용없음"
      }
      room.messages = new Array();
      this.getMessages(roomId).forEach(message =>{
          room.messages.push(message);
          room.lastMessage = message;
      });
    }); 
    return rooms[0];
  }
  getMessageObservable(){
    return this.messageObservable;
  }

  broadcastMessage(){
    this.chatListners.forEach(listner =>{
      console.log(listner);
      listner.messages = this.getMessages(listner.room.id);
    })
  }

  addChatLisnter(listner){
    this.chatListners.push(listner);
  }

  getProcessedMessages(messages, roomId){
    let processedMessages = new Array();
    console.log("messages");
    console.log(messages);
    if(messages.length > 0){
      if(messages[0].id == roomId){
        Object.keys(messages[0].data).forEach((messageId)=>{
          let message = messages[0].data[messageId];
          message.fromUser = this.getUserProfile(message.fromUserId);
          processedMessages.push(message);
        });
      }
    }
    return processedMessages;
  }

  getMessages(roomId){
    let messages = new Array();
    console.log("messages");
    console.log(this.messages);
    if(this.messages.length > 0){
      if(this.messages[0].id == roomId){
        Object.keys(this.messages[0].data).forEach((messageId)=>{
          let message = this.messages[0].data[messageId];
          message.fromUser = this.getUserProfile(message.fromUserId);
          messages.push(message);
        });
      }
    }
    return messages;
  }
  getChatRoomsFrom(userId){
    let rooms = new Array();
    this.getRequestsFrom(userId).forEach(request =>{
      let room = this.getChatRoom(request.id);
      if(room != null){
        room.withUser = this.getUserProfile(request.toUserId);
        rooms.push(room);
      }      
    });
    return rooms;
  }
  
  getChatRoomsTo(userId){
    let rooms = new Array();
    this.getRequestsTo(userId).forEach(request =>{
      let room = this.getChatRoom(request.id);
      if(room.status != "opened"){
        room.withUser = this.getUserProfile(request.fromUserId);
        console.log(room);
        rooms.push(room);
      }
    });
    console.log(rooms);
    return rooms;
  }

  sendMessage(userId, roomId, text){
    this.db.list('messages/'+roomId).push({
      roomId: roomId,
      fromUserId: userId,
      text: text,
      created: Date.now()
    })
  }

  getFriendList(userId, options?){
    //console.log("[data service] - getFriendList from " + userId);    
    let friendList = this.friendLists.filter((user) => {
      //console.log(user);
      if(user.withId != null){
        return (user.withId == userId);
      } else {
        return false;
      }
    });
    let friends = new Array();
    
    if(friendList.length > 0){
      Object.keys(friendList[0].data).forEach((friendId)=>{
        let friend = friendList[0].data[friendId];
        friends.push(friend);
      })
    }
    return friends;
  }

  getSolomeList(userId, options?){        
    // console.log("[data service] - getSolomeList from "+userId);
    // console.log("[data service] - getSolomeList : friends ");
    let solomes = new Array();
    let friends = this.getFriendList(userId);     
    friends.forEach(friend => {     
      //friend = friend.data[Object.keys(friend.data)[0]];
      // console.log("friend data");
      // console.log(friend);
      if(friend.status == "agreed"){
        this.getFriendList(friend.id).forEach(solome =>{
          solome.profile = this.getUserProfile(solome.id);
          solome.friend = this.getUserProfile(friend.id);
          if(solome.id != userId){
            if(friends.findIndex((friend) =>(
              friend.id == solome.id
            )) == -1 && 
            
            solome.isShow){
              solome.isRequested = false;
              solome.isReceived = false;
              if(this.getRequestsFrom(userId).findIndex(request => (request.toUserId == solome.id)) != -1){
                solome.isRequested = true;
              }
              if(this.getRequestsTo(userId).findIndex(request => (request.fromUserId == solome.id)) != -1){
                solome.isReceived = true;
              }
              solomes.push(solome);
              console.log("[data service] getSolomeList : push solome");
              console.log(solome);
            }
          }                
        });
      }      
    });
    return solomes.filter((solome, index, self) =>
    index === self.findIndex((s) => (
      s.id === solome.id 
    )));
  }

  setShow(userId, connection){
    this.db.object('friendLists/'+userId+'/'+connection.id).update({
      isShow: connection.isShow
    })
  }

  getRequestList(userId,friendId, options){

  }

  getAllRequestList(userId){

  }
  singUp(user){
    return this.addUser(user);
  }
  addUser(user){
    return this.db.object('users/'+(user.uid?user.uid:user.id)).update({
      id : user.uid?user.uid:user.id,
      email: user.email,
      picture_url: user.photoURL?user.photoURL:'assets/imgs/person.png',
      name: user.displayName?user.displayName:'',
      phoneNumber: user.phoneNumber?user.phoneNumber:''
    });
  }

  updateUserProfile(user){
    this.db.object('users/'+user.id).set(user.profile);
  }

  applyFriend(user, friend){
    this.db.object('friendLists/'+user.id+'/'+friend.id).update({
      id: friend.id,
      isShow: false,
      status: "applied"
    })
    this.db.object('friendLists/'+friend.id+'/'+user.id).update({
      id: user.id,
      isShow: false,
      status: "received"
    })
  }

  agreeFriend(user, friend){
    friend.status = "agreed";
    this.db.object("friendLists/"+user.id+"/"+friend.id).update({
      status:friend.status
    });
    this.db.object("friendLists/"+friend.id+"/"+user.id).update({
      status:friend.status
    });
  }

  rejectFriend(user, friend){
      
  }

  getFriendStatus(user, friend){

  }
}
