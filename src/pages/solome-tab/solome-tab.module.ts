import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolomeTabPage } from './solome-tab';

@NgModule({
  declarations: [
    SolomeTabPage,
  ],
  imports: [
    IonicPageModule.forChild(SolomeTabPage),
  ],
})
export class SolomeTabPageModule {}
