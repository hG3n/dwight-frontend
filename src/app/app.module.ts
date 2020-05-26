import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {FlexLayoutModule} from "@angular/flex-layout";
import {SliderComponent} from './slider/slider.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { VolumeControlComponent } from './volume-control/volume-control.component';
import {PortalModule} from "@angular/cdk/portal";
import {DragDropModule} from "@angular/cdk/drag-drop";


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        SliderComponent,
        VolumeControlComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        FlexLayoutModule,
        HammerModule,
        PortalModule,
        DragDropModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
