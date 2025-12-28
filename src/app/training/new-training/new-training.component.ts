import { Component, OnInit, signal, type WritableSignal } from '@angular/core';
import { form, required, type FieldTree } from '@angular/forms/signals';
import { LoadingService } from '../../shared/services/loading.service';
import { ExerciseService } from '../../shared/services/exercise.service';
import { NotificationHelperService } from '../../shared/services/notification-helper.service';
import { WorkoutService } from '../workout.service';

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.scss'],
    standalone: false
})
export class NewTrainingComponent implements OnInit {
  readonly workoutModel = this.createWorkoutModel();
  readonly workoutForm = this.createWorkoutForm();
  exercises: WorkoutExerciseForm[] = [this.createExerciseRow()];
  availableExercises: string[] = [];

  constructor(
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  onExerciseChange(index: number, value: string): void {
    this.exercises[index].exercise = value;
  }

  onSetsChange(index: number, value: string): void {
    this.exercises[index].sets = this.normalizeNumber(value, 1, 50);
  }

  onRepsChange(index: number, value: string): void {
    this.exercises[index].reps = this.normalizeNumber(value, 1, 100);
  }

  addExerciseRow(): void {
    this.exercises = [...this.exercises, this.createExerciseRow()];
  }

  removeExerciseRow(index: number): void {
    if (this.exercises.length === 1) {
      this.exercises = [this.createExerciseRow()];
      return;
    }

    this.exercises = this.exercises.filter((_, i) => i !== index);
  }

  saveWorkout(): void {
    if (!this.isFormValid()) {
      return;
    }

    const payload = {
      name: this.workoutModel().name.trim(),
      exercises: this.exercises.map((exercise) => ({
        exercise: exercise.exercise,
        sets: exercise.sets,
        reps: exercise.reps,
      })),
    };

    this.loadingService
      .track(this.workoutService.create(payload))
      .subscribe({
        next: () => {
          this.resetForm();
        },
        error: (error) => {
          this.notificationHelper.showError(
            error?.error ?? 'Erro ao salvar treino.'
          );
        },
      });
  }

  private loadExercises(): void {
    this.exerciseService.getAll().subscribe((data) => {
      this.availableExercises = data;
    });
  }

  private createExerciseRow(): WorkoutExerciseForm {
    return {
      exercise: '',
      sets: 2,
      reps: 10,
    };
  }

  private normalizeNumber(value: string, min: number, max: number): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return min;
    }

    return Math.min(max, Math.max(min, Math.round(parsed)));
  }

  private isFormValid(): boolean {
    if (this.workoutForm().invalid()) {
      return false;
    }

    return this.exercises.every((exercise) => exercise.exercise);
  }

  private resetForm(): void {
    this.workoutModel.set({ name: '' });
    this.exercises = [this.createExerciseRow()];
  }

  private createWorkoutModel(): WritableSignal<WorkoutFormModel> {
    return signal({
      name: '',
    });
  }

  private createWorkoutForm(): FieldTree<WorkoutFormModel> {
    return form(this.workoutModel, (workout) => {
      required(workout.name);
    });
  }
}

type WorkoutExerciseForm = {
  exercise: string;
  sets: number;
  reps: number;
};

type WorkoutFormModel = {
  name: string;
};
