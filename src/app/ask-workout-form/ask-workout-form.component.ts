import { Component } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { NotificationHelperService } from '../shared/services/notification-helper.service';
import {
  formatResponse,
  normalizeRawEntries,
  type ResponseRawEntries,
} from '../shared/utils/question-response.util';
import { WorkoutService } from '../training/workout.service';

@Component({
  selector: 'app-ask-workout-form',
  templateUrl: './ask-workout-form.component.html',
  styleUrls: ['./ask-workout-form.component.scss'],
  standalone: false,
})
export class AskWorkoutFormComponent {
  question = '';
  responseMessage = '';
  responseRawEntries: ResponseRawEntries = [];

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
        next: (response: unknown) => {
          this.responseMessage = formatResponse(response);
          this.responseRawEntries = normalizeRawEntries(
            (response as { raw?: unknown })?.raw
          );
        },
        error: (request) => {
          this.responseMessage = '';
          this.responseRawEntries = [];
          this.notificationHelper.showError(
            request?.error?.error ?? 'Erro ao enviar pergunta.'
          );
        },
      });
  }
}
