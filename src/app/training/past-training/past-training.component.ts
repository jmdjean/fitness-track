import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { type WorkoutDone } from '../../shared/models/workout-done.model';
import { LoadingService } from '../../shared/services/loading.service';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss'],
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
export class PastTrainingComponent implements OnInit {
  workouts: WorkoutDone[] = [];
  expandedElement: WorkoutDone | null = null;
  displayedColumns: Array<'expand' | 'name' | 'quantity'> = [
    'expand',
    'name',
    'quantity',
  ];

  constructor(
    private workoutService: WorkoutService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  toggleRow(workout: WorkoutDone): void {
    this.expandedElement = this.expandedElement === workout ? null : workout;
  }

  totalExercises(workout: WorkoutDone): number {
    return workout.exercises.length;
  }

  displayName(workout: WorkoutDone): string {
    return workout.name || workout.workoutId;
  }

  private loadWorkouts(): void {
    this.loadingService
      .track(this.workoutService.getDones().pipe(delay(1000)))
      .subscribe((data) => {
        this.workouts = data;
      });
  }
}
