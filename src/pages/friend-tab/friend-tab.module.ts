import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendTabPage } from './friend-tab';

@NgModule({
  declarations: [
    FriendTabPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendTabPage),
  ],
})
export class FriendTabPageModule {}
