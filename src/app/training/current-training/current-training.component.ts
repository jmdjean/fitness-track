import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { IWorkout } from '../../shared/models/workout-exercises.model';
import { LoadingService } from '../../shared/services/loading.service';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  standalone: false,
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Output() stopTraining = new EventEmitter<void>();
  remainingSeconds = 0;
  totalSeconds = 0;
  private timerId: number | null = null;
  workouts: IWorkout[] = [];
  expandedElement: IWorkout | null = null;
  displayedColumns: Array<'expand' | 'name' | 'quantity' | 'actions'> = [
    'expand',
    'name',
    'quantity',
    'actions',
  ];

  constructor(
    private dialog: MatDialog,
    private workoutService: WorkoutService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  ngOnDestroy(): void {}

  toggleRow(workout: IWorkout): void {
    this.expandedElement = this.expandedElement === workout ? null : workout;
  }

  totalExercises(workout: IWorkout): number {
    return workout.exercises.length;
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

  private loadWorkouts(): void {
    this.loadingService
      .track(this.workoutService.getAll().pipe(delay(1000)))
      .subscribe((data) => {
        this.workouts = data;
      });
  }
}
