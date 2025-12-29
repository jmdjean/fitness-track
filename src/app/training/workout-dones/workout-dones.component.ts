import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { type WorkoutDone } from '../../shared/models/workout-done.model';
import { LoadingService } from '../../shared/services/loading.service';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-workout-dones',
  templateUrl: './workout-dones.component.html',
  styleUrls: ['./workout-dones.component.scss'],
  standalone: false,
})
export class WorkoutDonesComponent implements OnInit {
  workouts: WorkoutDone[] = [];
  displayedColumns: Array<'name' | 'quantity'> = ['name', 'quantity'];

  constructor(
    private workoutService: WorkoutService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  totalExercises(workout: WorkoutDone): number {
    return workout.exercises.length;
  }

  private loadWorkouts(): void {
    this.loadingService
      .track(this.workoutService.getDones().pipe(delay(1000)))
      .subscribe((data) => {
        this.workouts = data;
      });
  }
}
