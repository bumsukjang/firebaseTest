import { TabsPage } from './../tabs/tabs';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signupError: string;
  loginError: string;
	form: FormGroup;
  credentials;
  constructor(public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public db:DataServiceProvider, public auth: AuthServiceProvider) {
    this.form = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      name: ['', Validators.compose([])],
      age: ['', Validators.compose([])],
      gender: ['', Validators.compose([])],
			description: ['', Validators.compose([])]
    });
  }

  signup() {
    console.log("[singUp] : singup");
    
		let data = this.form.value;
		this.credentials = {
			email: data.email,
			password: data.password
    };
		this.auth.signUp(this.credentials).then(
      (user) => {
        this.auth.signInWithEmail(this.credentials)
		  	.then(() => {		
            this.db.singUp(user).then(()=>{
              this.navCtrl.push(TabsPage);
            });
            //this.navCtrl.setRoot(TabsPage);
          },
          error => this.loginError = error.message
			  );    
        
      },
			error => this.signupError = error.message
		);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

}
