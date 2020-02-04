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

const appRoutes: Routes = [
  { path: 'reading-task/:id', component: ReadingTaskComponent },
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full'
  }
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// noinspection AngularInvalidImportedOrDeclaredSymbol
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ScheduleComponent,
    DataTableComponent,
    ReadingTaskComponent,
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
    RouterModule.forRoot(appRoutes),
    CdTimerModule,
    PerfectScrollbarModule
  ],
  providers: [
    ElectronService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
