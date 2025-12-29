import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';
import { NotificationHelperService } from '../../shared/services/notification-helper.service';
import { type IWorkout } from '../../shared/models/workout-exercises.model';
import {
  type WorkoutDoneCreatePayload,
  WorkoutService,
} from '../workout.service';

@Component({
  selector: 'app-finished-traning',
  templateUrl: './finished-traning.component.html',
  styleUrls: ['./finished-traning.component.scss'],
  standalone: false,
})
export class FinishedTraningComponent implements OnInit {
  workouts: IWorkout[] = [];
  selectedWorkoutId = '';
  exerciseRows: WorkoutExerciseRow[] = [];

  constructor(
    private workoutService: WorkoutService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  onWorkoutChange(workoutId: string): void {
    this.selectedWorkoutId = workoutId;
    const workout = this.workouts.find((item) => item.id === workoutId);
    if (!workout) {
      this.exerciseRows = [];
      return;
    }

    this.exerciseRows = workout.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.exercise,
      sets: exercise.sets,
      reps: exercise.reps,
      weightKg: 0,
      locked: false,
    }));
  }

  toggleRowLock(row: WorkoutExerciseRow): void {
    if (!row.locked) {
      if (!this.isRowValid(row)) {
        return;
      }
      row.locked = true;
      return;
    }

    row.locked = false;
  }

  canSave(): boolean {
    return (
      !!this.selectedWorkoutId &&
      this.exerciseRows.length > 0 &&
      this.exerciseRows.every((row) => row.locked && this.isRowValid(row))
    );
  }

  save(): void {
    if (!this.canSave()) {
      return;
    }

    const payload: WorkoutDoneCreatePayload = {
      workoutId: this.selectedWorkoutId,
      exercises: this.exerciseRows.map((row) => ({
        exerciseId: row.id,
        sets: row.sets,
        reps: row.reps,
        weightKg: row.weightKg,
      })),
    };

    this.loadingService
      .track(this.workoutService.createDone(payload))
      .subscribe({
        next: () => {
          this.notificationHelper.showSuccess('Treino finalizado com sucesso.');
          this.selectedWorkoutId = '';
          this.exerciseRows = [];
        },
        error: (request) => {
          this.notificationHelper.showError(
            request?.error?.error ?? 'Erro ao finalizar treino.'
          );
        },
      });
  }

  private isRowValid(row: WorkoutExerciseRow): boolean {
    return (
      Number.isFinite(row.sets) &&
      Number.isFinite(row.reps) &&
      Number.isFinite(row.weightKg) &&
      row.sets > 0 &&
      row.reps > 0 &&
      row.weightKg >= 0
    );
  }

  private loadWorkouts(): void {
    this.loadingService
      .track(this.workoutService.getAll().pipe(delay(1000)))
      .subscribe((data) => {
        this.workouts = data;
      });
  }
}

type WorkoutExerciseRow = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
  locked: boolean;
};
