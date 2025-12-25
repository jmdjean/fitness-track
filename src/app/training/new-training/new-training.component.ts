import { Component, EventEmitter, Output } from '@angular/core';
import { ExerciseName } from '../../shared/enums/exercise-name.enum';
import { SelectedExercise } from '../../shared/models/selected-exercise.model';

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.scss'],
    standalone: false
})
export class NewTrainingComponent {
  @Output() startTraining = new EventEmitter<SelectedExercise[]>();

  selectedExerciseNames: ExerciseName[] = [];
  selectedExercises: SelectedExercise[] = [];

  availableExercises = Object.values(ExerciseName).map((exercise) => ({
    value: exercise,
    label: this.formatLabel(exercise),
  }));

  onExercisesChange(selectedNames: ExerciseName[]) {
    this.selectedExerciseNames = selectedNames;
    const existing = new Map(this.selectedExercises.map((item) => [item.name, item]));

    this.selectedExercises = selectedNames.map((name) => {
      const current = existing.get(name);
      return current ? current : { name, reps: 10 };
    });
  }

  onRepsChange(exercise: SelectedExercise, value: string) {
    const parsed = Number(value);
    const normalized = Number.isFinite(parsed) ? Math.min(100, Math.max(1, Math.round(parsed))) : 1;
    exercise.reps = normalized;
  }

  onStartTraining() {
    this.startTraining.emit(this.selectedExercises);
  }

  get estimatedSeconds(): number {
    const totalReps = this.selectedExercises.reduce((sum, exercise) => sum + exercise.reps, 0);
    return totalReps * 9;
  }

  removeExercise(exerciseName: ExerciseName) {
    this.selectedExerciseNames = this.selectedExerciseNames.filter((item) => item !== exerciseName);
    this.selectedExercises = this.selectedExercises.filter((item) => item.name !== exerciseName);
  }

  formatLabel(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
