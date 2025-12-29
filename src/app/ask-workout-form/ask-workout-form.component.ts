import { Component } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { NotificationHelperService } from '../shared/services/notification-helper.service';
import { WorkoutService } from '../training/workout.service';

@Component({
  selector: 'app-ask-workout-form',
  templateUrl: './ask-workout-form.component.html',
  styleUrls: ['./ask-workout-form.component.scss'],
  standalone: false,
})
export class AskWorkoutFormComponent {
  question = '';
  responseText = '';
  responseRaw: string[] = [];

  constructor(
    private workoutService: WorkoutService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  onSendClick(): void {
    const question = this.question.trim();
    if (!question) {
      return;
    }

    this.loadingService
      .track(this.workoutService.askDonesQuestion({ question }))
      .subscribe({
        next: (response) => {
          this.responseText = response?.data?.[0] ?? '';
          this.responseRaw = this.normalizeRaw(response?.raw);
          this.question = '';
        },
        error: (request) => {
          this.responseText = '';
          this.responseRaw = [];
          this.notificationHelper.showError(
            request?.error?.error ?? 'Erro ao enviar pergunta.'
          );
        },
      });
  }

  private normalizeRaw(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      return raw.map((item) => (typeof item === 'string' ? item : JSON.stringify(item)));
    }

    if (raw === null || raw === undefined) {
      return [];
    }

    return [typeof raw === 'string' ? raw : JSON.stringify(raw)];
  }
}
