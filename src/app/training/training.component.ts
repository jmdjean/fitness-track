import { Component, ViewChild } from '@angular/core';
import { SelectedExercise } from '../shared/models/selected-exercise.model';
import { CurrentTrainingComponent } from './current-training/current-training.component';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent {
  selectedIndex = 0;
  isTrainingStarted = false;

  @ViewChild(CurrentTrainingComponent)
  currentTrainingComponent?: CurrentTrainingComponent;

  onStartTraining(_selectedExercises: SelectedExercise[]) {
    this.selectedIndex = 1;
    this.isTrainingStarted = true;
    const estimatedSeconds = this.estimateSeconds(_selectedExercises);
    this.currentTrainingComponent?.startTraining(estimatedSeconds);
  }

  onStopTraining() {
    this.selectedIndex = 0;
    this.isTrainingStarted = false;
  }

  private estimateSeconds(exercises: SelectedExercise[]): number {
    const totalReps = exercises.reduce((sum, exercise) => sum + exercise.reps, 0);
    return totalReps * 9;
  }
}
