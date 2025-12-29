import { AsyncPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Field } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthContextInterceptor } from './auth/auth-context.interceptor';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { QuestionsComponent } from './questions/questions.component';
import { BodyMetricsComponent } from './shared/components/body-metrics/body-metrics.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { TagSpecComponent } from './shared/components/tag-spec/tag-spec.component';
import { WorkoutDetailsDialogComponent } from './shared/components/workout-details-dialog/workout-details-dialog.component';
import { WorkoutDonesComponent } from './training/workout-dones/workout-dones.component';
import { AskWorkoutFormComponent } from './ask-workout-form/ask-workout-form.component';
import { FormatDurationPipe } from './shared/pipes/format-duration.pipe';
import { FormatMinutesPipe } from './shared/pipes/format-minutes.pipe';
import { CurrentTrainingComponent } from './training/current-training/current-training.component';
import { FinishedTraningComponent } from './training/finished-traning/finished-traning.component';
import { NewTrainingComponent } from './training/new-training/new-training.component';
import { PastTrainingComponent } from './training/past-training/past-training.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ConfirmDialogComponent,
    WorkoutDetailsDialogComponent,
    WorkoutDonesComponent,
    TagSpecComponent,
    LoadingSpinnerComponent,
    AskWorkoutFormComponent,
    CurrentTrainingComponent,
    FinishedTraningComponent,
    FormatMinutesPipe,
    FormatDurationPipe,
    NewTrainingComponent,
    PastTrainingComponent,
    QuestionsComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    Field,
    BodyMetricsComponent,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthContextInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
