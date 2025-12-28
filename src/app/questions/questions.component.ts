import { Component, signal, type WritableSignal } from '@angular/core';
import { form, required, type FieldTree } from '@angular/forms/signals';
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
  readonly questionModel = this.createQuestionModel();
  readonly questionForm = this.createQuestionForm();
  responseMessage = '';

  constructor(
    private questionService: QuestionService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  hasError(field: FieldTree<unknown>, kind: string): boolean {
    return field().errors().some((error) => error.kind === kind);
  }

  shouldShowError(field: FieldTree<unknown>): boolean {
    const state = field();
    return state.touched() && state.invalid();
  }

  submit(): void {
    if (this.questionForm().invalid()) {
      this.questionForm.question().markAsTouched();
      return;
    }

    const { question } = this.questionModel();
    this.loadingService
      .track(this.questionService.create({ question }))
      .subscribe({
        next: (response) => {
          this.responseMessage = this.formatResponse(response);
          this.questionModel.set({ question: '' });
        },
        error: (error) => {
          this.responseMessage = '';
          this.notificationHelper.showError(
            error?.error ?? 'Erro ao enviar pergunta.'
          );
        },
      });
  }

  private createQuestionModel(): WritableSignal<QuestionFormModel> {
    return signal({
      question: '',
    });
  }

  private createQuestionForm(): FieldTree<QuestionFormModel> {
    return form(this.questionModel, (question) => {
      required(question.question);
    });
  }

  private formatResponse(response: unknown): string {
    if (typeof response === 'string') {
      return response;
    }

    if (response && typeof response === 'object' && 'message' in response) {
      const message = (response as { message?: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Pergunta enviada com sucesso.';
  }
}

type QuestionFormModel = {
  question: string;
};
