import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsTabPage } from './chats-tab';

@NgModule({
  declarations: [
    ChatsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatsTabPage),
  ],
})
export class ChatsTabPageModule {}
