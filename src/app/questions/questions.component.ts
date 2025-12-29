import { Component } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { NotificationHelperService } from '../shared/services/notification-helper.service';
import {
  formatResponse,
  normalizeRawEntries,
  type ResponseRawEntries,
} from '../shared/utils/question-response.util';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  standalone: false,
})
export class QuestionsComponent {
  question = '';
  responseMessage = '';
  responseRawEntries: ResponseRawEntries = [];

  constructor(
    private questionService: QuestionService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  submit(): void {
    const question = this.question.trim();
    if (!question) {
      return;
    }

    this.loadingService
      .track(this.questionService.create({ question }))
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
          console.log(request);
          this.notificationHelper.showError(
            request?.error?.error ?? 'Erro ao enviar pergunta.'
          );
        },
      });
  }

  onSendClick(): void {
    this.submit();
  }
}
