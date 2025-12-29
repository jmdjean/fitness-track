import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { WorkoutDetailsDialogComponent } from '../../shared/components/workout-details-dialog/workout-details-dialog.component';
import { IWorkout } from '../../shared/models/workout-exercises.model';
import { LoadingService } from '../../shared/services/loading.service';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
  standalone: false,
})
export class CurrentTrainingComponent implements OnInit {
  @Output() stopTraining = new EventEmitter<void>();
  remainingSeconds = 0;
  totalSeconds = 0;
  private timerId: number | null = null;
  workouts: IWorkout[] = [];
  readonly searchTerm = signal('');
  displayedColumns: Array<'actions' | 'name' | 'quantity'> = [
    'actions',
    'name',
    'quantity',
  ];

  constructor(
    private dialog: MatDialog,
    private workoutService: WorkoutService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.loadWorkouts(value);
  }

  totalExercises(workout: IWorkout): number {
    return workout.exercises.length;
  }

  openDetails(workout: IWorkout, event: Event): void {
    event.stopPropagation();
    this.dialog.open(WorkoutDetailsDialogComponent, {
      width: '520px',
      data: workout,
    });
  }

  deleteWorkout(workout: IWorkout, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar exclusao',
        message: `Tem certeza que deseja excluir o treino ${workout.name}?`,
        actionButtonText: 'Excluir',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.loadingService
        .track(this.workoutService.delete(workout.id))
        .subscribe(() => {
          this.workouts = this.workouts.filter((item) => item.id !== workout.id);
        });
    });
  }

  private loadWorkouts(searchTerm = ''): void {
    this.loadingService
      .track(this.workoutService.getAllByName(searchTerm).pipe(delay(1000)))
      .subscribe((data) => {
        this.workouts = data;
      });
  }
}
