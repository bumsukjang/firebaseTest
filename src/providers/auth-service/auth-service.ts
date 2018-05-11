import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';

import * as firebase from 'firebase/app';

import { DateTime } from 'ionic-angular';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class User{
	id: string;
	password: string;
	name: string;
	gender: string;
	work: string;
	relationship_status: string;
	email: string;
	location: string;
	languages: string[];
	age_range: number[];
	education: string;
	sports: string[];
	books: string[];
	foods: string[];
	movies: string[];
	interested_in: string[];
	hometown: string;
	inspirational_people: string[];
	meeting_for: string;
	religion: string;
	updated_time: DateTime;
	photoUrl: string;

	constructor(id, name){
		this.id = id;
		this.name = name;
	}
	
}

@Injectable()
export class AuthServiceProvider {
  public currentUser;
  constructor( public afAuth: AngularFireAuth
    , public db: AngularFireDatabase) {
    console.log('Hello AuthServiceProvider Provider');
    console.log('Hello AuthService Provider');
		afAuth.authState.subscribe(user => {
			console.log("[auth-service] constructor : authState subscribe user");
			console.log(user);
			console.log(user != null);
			if(user != null){
				this.currentUser = user;
				this.currentUser.id = user.uid;
				this.db.object('users/'+user.uid).valueChanges().subscribe(newUser =>{
					console.log("Auth State Changed!!");
					console.log(newUser);
					if(newUser != null){
						this.updateUser(newUser);
					}
				});
			}
		});	
  }
  public updateUser(userProfile) {
		this.currentUser.profile = userProfile;
	}
	
	/**
	 * signInWithEmail(registerCredentis)
	 */
	public signInWithEmail(registerCredentials) {		
		// console.log("[auth-service] signInWithEmail : try login with email");
		// console.log(this.currentUser);
		return this.afAuth.auth.signInWithEmailAndPassword(registerCredentials.email, registerCredentials.password);
	}

	public signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);

	}
	
	public getUserInfo() : User {
		console.log("[Auth] getUserInfo");
		console.log(this.currentUser);
		return this.currentUser;
	}

	public signInWithFacebook(){
		return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
	}
	public signInWithGoogle(){
		return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}
	 
	public logout() {		
		this.afAuth.auth.signOut();
		return Observable.create(observer => {
			this.currentUser = null;
			observer.next(true);
			observer.complete();
		});
	}
	authenticated(): boolean{
		return this.currentUser !== null;
	}

	getEmail(){
		return this.currentUser && this.currentUser.email;
	}

	public signOut(): Promise<void>{
		this.updateUser(null);
		return this.afAuth.auth.signOut();
	}
}
