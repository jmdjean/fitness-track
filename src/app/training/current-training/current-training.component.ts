import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { StopTrainingComponent } from '../stop-training/stop-training.component';

@Component({
    selector: 'app-current-training',
    templateUrl: './current-training.component.html',
    styleUrls: ['./current-training.component.scss'],
    standalone: false
})
export class CurrentTrainingComponent implements OnDestroy {
  @Output() stopTraining = new EventEmitter<void>();
  remainingSeconds = 0;
  totalSeconds = 0;
  private timerId: number | null = null;

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnDestroy() {
    this.clearTimer();
  }

  startTraining(totalSeconds: number) {
    this.totalSeconds = totalSeconds;
    this.remainingSeconds = totalSeconds;
    this.startOrResumeTimer();
  }

  onStop() {
    this.clearTimer();

    const dialogRef = this.dialog.open(StopTrainingComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((shouldStop: boolean) => {
      if (shouldStop) {
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.stopTraining.emit();
        return;
      }

      this.startOrResumeTimer();
    });
  }

  private startOrResumeTimer() {
    if (this.timerId !== null) {
      return;
    }

    this.timerId = window.setInterval(() => {
      this.remainingSeconds = Math.max(this.remainingSeconds - 1, 0);

      if (this.remainingSeconds === 0) {
        this.clearTimer();
        this.openFinishedDialog();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private openFinishedDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '360px',
      data: {
        title: 'Treino finalizado',
        message: 'Mais um treino concluido',
        actionButtonText: 'Finalizar',
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/finished-traning']);
    });
  }
}
