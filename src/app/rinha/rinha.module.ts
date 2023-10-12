import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './container/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './container/home/home.component';
import { RinhaRoutingModule } from './rinha-routing.module';
import { ViewerComponent } from './container/viewer/viewer.component';
import { JsonListComponent } from './components/json-list/json-list.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';



@NgModule({
  declarations: [
    FormComponent,
    HomeComponent,
    ViewerComponent,
    JsonListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RinhaRoutingModule,
    NgxJsonViewerModule
  ],
  exports: [FormComponent]
})
export class RinhaModule { }
