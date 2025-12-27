import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Field } from '@angular/forms/signals';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { BodyMetricsComponent } from './shared/components/body-metrics/body-metrics.component';
import { TagSpecComponent } from './shared/components/tag-spec/tag-spec.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { FormatMinutesPipe } from './shared/pipes/format-minutes.pipe';
import { FormatDurationPipe } from './shared/pipes/format-duration.pipe';
import { CurrentTrainingComponent } from './training/current-training/current-training.component';
import { FinishedTraningComponent } from './training/finished-traning/finished-traning.component';
import { NewTrainingComponent } from './training/new-training/new-training.component';
import { PastTrainingComponent } from './training/past-training/past-training.component';
import { StopTrainingComponent } from './training/stop-training/stop-training.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ConfirmDialogComponent,
    TagSpecComponent,
    LoadingSpinnerComponent,
    CurrentTrainingComponent,
    FinishedTraningComponent,
    FormatMinutesPipe,
    FormatDurationPipe,
    NewTrainingComponent,
    PastTrainingComponent,
    StopTrainingComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    Field,
    BodyMetricsComponent,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
