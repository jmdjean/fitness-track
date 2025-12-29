import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IWorkout } from '../../models/workout-exercises.model';

@Component({
  selector: 'app-workout-details-dialog',
  templateUrl: './workout-details-dialog.component.html',
  styleUrls: ['./workout-details-dialog.component.scss'],
  standalone: false,
})
export class WorkoutDetailsDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<WorkoutDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWorkout
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
