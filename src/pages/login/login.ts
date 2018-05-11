import { TabsPage } from './../tabs/tabs';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignUpPage } from '../sign-up/sign-up';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
	registerCredentials = { email: 'bsjang@bs-soft.co.kr', password: '1q2w3e4r' };
	loginForm: FormGroup;
	loginError: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl:AlertController, private loadingCtrl: LoadingController
    , private auth: AuthServiceProvider, public fb: FormBuilder, public db: DataServiceProvider) {

    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: '로그인 중입니다.',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showMessage(title, text) {
		this.loading.dismiss();
	 
		let alert = this.alertCtrl.create({
		  title: title,
		  subTitle: text,
		  buttons: ['OK']
		});
		alert.present();
  }
  
  logout() {
		this.auth.signOut();
	}

	signup(){
		console.log("[loginPage] signup");
		this.navCtrl.push(SignUpPage);
  }
	
	loginWithGoogle(){
		this.showMessage("개발중","구글계정연동");
		/* this.auth.signInWithGoogle().then(
			(user) => {					
				console.log("[loingPage] login : success");
				console.log(user);	
				user = user.user;
				console.log(this.db.getUserProfile(user.id));
				if(!this.db.getUserProfile(user.id)){
					console.log(user);
					this.db.addUser(user);
					this.auth.updateUser(user);
				} else {
					this.auth.updateUser(this.db.getUserProfile(user.id));
				}
								
				this.navCtrl.setRoot(TabsPage);
			},
			(error) => {
				this.loginError = error.message;
			}
		); */
	}

	loginWithFacebook(){
		this.showMessage("개발중","페이스북 계정 연동");
		/* this.auth.signInWithFacebook().then(
			(user) => {					
				console.log("[loingPage] login : success");
				console.log(user);	
				if(!this.db.getUserProfile(user.id)){
					user = user.user;
					this.db.addUser(user).then(()=>{
						this.auth.updateUser(this.db.getUserProfile(user.id));
					});
				} else {
					this.auth.updateUser(this.db.getUserProfile(user.id));
				}
			},
			(error) => {
				this.loginError = error.message;
			}
		); */
	}

  login(){
		this.showLoading();
		this.auth.signInWithEmail(this.registerCredentials)
		.then(
			(user) => {					
				console.log("[loingPage] login : success");
				console.log(user);	
				
				this.auth.updateUser(this.db.getUserProfile(user.id));				
				this.navCtrl.setRoot(TabsPage);
			},
			(error) => {
				this.loginError = error.message;
	  		this.loading.dismiss();
			}
    );
  }
}
