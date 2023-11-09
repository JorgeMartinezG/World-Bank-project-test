import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapComponent } from "./map/map.component"
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";


@NgModule({
  imports:      [ BrowserModule, FormsModule, LeafletModule, HttpClientModule],
  declarations: [ AppComponent, MapComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
