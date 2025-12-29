import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { QuestionsComponent } from './questions/questions.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CurrentTrainingComponent } from './training/current-training/current-training.component';
import { FinishedTraningComponent } from './training/finished-traning/finished-traning.component';
import { NewTrainingComponent } from './training/new-training/new-training.component';
import { WorkoutDonesComponent } from './training/workout-dones/workout-dones.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AskWorkoutFormComponent } from './ask-workout-form/ask-workout-form.component';
import { DietComponent } from './diet/diet.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'questions', component: QuestionsComponent },
  { path: 'ask-workout-form', component: AskWorkoutFormComponent },
  { path: 'new-training', component: NewTrainingComponent },
  { path: 'current-training', component: CurrentTrainingComponent },
  { path: 'finished-traning', component: FinishedTraningComponent },
  { path: 'workout-dones', component: WorkoutDonesComponent },
  { path: 'diet', component: DietComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
