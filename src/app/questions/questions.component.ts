import { Component } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { NotificationHelperService } from '../shared/services/notification-helper.service';
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
  responseRawEntries: Array<{ key: string; value: string }> = [];

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
        next: (response) => {
          this.responseMessage = this.formatResponse(response);
          this.responseRawEntries = this.extractRawEntries(response);
          this.question = '';
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

  private formatResponse(response: any): string {
    if (typeof response === 'string') {
      return response;
    }

    if (response && typeof response === 'object' && 'message' in response) {
      const message = (response as { message?: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }

    if(response && response.data[0]){
      return response.data[0];
    }

    return 'Pergunta enviada com sucesso.';
  }

  private extractRawEntries(response: any): Array<{ key: string; value: string }> {
    if (!response || typeof response !== 'object') {
      return [];
    }

    const list = Array.isArray(response.data) ? response.data : null;
    if (list && list.length && typeof list[0] === 'object' && list[0] !== null) {
      return Object.entries(list[0]).map(([key, value]) => ({
        key,
        value: this.stringifyValue(value),
      }));
    }

    return Object.entries(response).map(([key, value]) => ({
      key,
      value: this.stringifyValue(value),
    }));
  }

  private stringifyValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
