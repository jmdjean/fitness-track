import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { type AuthSession } from '../auth/auth.types';
import {
  type WorkoutLastWeekCaloriesResponse,
  type WorkoutLastWeekCountResponse,
  type WorkoutLastWeekMaxWeightResponse,
  WorkoutService,
} from '../training/workout.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: false,
})
export class WelcomeComponent implements OnInit {
  readonly userName$: Observable<string>;
  workoutsThisWeek = 0;
  caloriesThisWeek = 0;
  maxWeightExerciseName = '';
  maxWeightKg = 0;

  constructor(
    private authService: AuthService,
    private workoutService: WorkoutService
  ) {
    this.userName$ = this.authService.session$.pipe(
      map((session) => this.resolveUserName(session))
    );
  }

  ngOnInit(): void {
    this.loadWeeklyWorkouts();
    this.loadWeeklyCalories();
    this.loadWeeklyMaxWeight();
  }

  private resolveUserName(session: AuthSession | null): string {
    const user = session?.user;
    if (!user) {
      return 'usuǭrio';
    }

    if (typeof user === 'string') {
      return user;
    }

    return user.name ?? user.email ?? 'usuǭrio';
  }

  private loadWeeklyWorkouts(): void {
    this.workoutService.getLastWeekCount().subscribe({
      next: (data: WorkoutLastWeekCountResponse) => {
        this.workoutsThisWeek = data.count ?? 0;
      },
      error: () => {
        this.workoutsThisWeek = 0;
      },
    });
  }

  private loadWeeklyCalories(): void {
    this.workoutService.getLastWeekCalories().subscribe({
      next: (data: WorkoutLastWeekCaloriesResponse) => {
        this.caloriesThisWeek = data.totalCalories ?? 0;
      },
      error: () => {
        this.caloriesThisWeek = 0;
      },
    });
  }

  private loadWeeklyMaxWeight(): void {
    this.workoutService.getLastWeekMaxWeightExercise().subscribe({
      next: (data: WorkoutLastWeekMaxWeightResponse) => {
        this.maxWeightExerciseName = data.exerciseName ?? '';
        this.maxWeightKg = data.maxWeightKg ?? 0;
      },
      error: () => {
        this.maxWeightExerciseName = '';
        this.maxWeightKg = 0;
      },
    });
  }
}
