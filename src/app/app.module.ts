import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScheduleComponent } from './schedule/schedule.component';
import {MatTableModule} from '@angular/material/table';
import { DataTableComponent } from './datatable/data-table.component';
import {ElectronService} from 'ngx-electron';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ReadingTaskComponent } from './reading-task/reading-task.component';
import { RouterModule, Routes } from '@angular/router';
import {CdTimerModule} from 'angular-cd-timer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ListeningTaskComponent } from './listening-task/listening-task.component';
import {NgxAudioPlayerModule} from 'ngx-audio-player';
import {APP_BASE_HREF} from '@angular/common';
import { SpeakingTaskComponent } from './speaking-task/speaking-task.component';
import { WritingTaskComponent } from './writing-task/writing-task.component';

const appRoutes: Routes = [
  { path: 'reading-task/:id', component: ReadingTaskComponent },
  { path: 'listening-task/:id/:type/:title', component: ListeningTaskComponent },
  { path: 'speaking-task/:id/:type', component: SpeakingTaskComponent },
  { path: 'writing-task/:id/:type/:title', component: WritingTaskComponent },
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full'
  }
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ScheduleComponent,
    DataTableComponent,
    ReadingTaskComponent,
    ListeningTaskComponent,
    SpeakingTaskComponent,
    WritingTaskComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    MatTableModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    CdTimerModule,
    PerfectScrollbarModule,
    NgxAudioPlayerModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    ElectronService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
