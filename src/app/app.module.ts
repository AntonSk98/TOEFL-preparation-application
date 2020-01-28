import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScheduleComponent } from './schedule/schedule.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableComponent } from './datatable/data-table.component';
import {ElectronService} from 'ngx-electron';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";


// noinspection AngularInvalidImportedOrDeclaredSymbol
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ScheduleComponent,
    DataTableComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    NgxDatatableModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot()
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
