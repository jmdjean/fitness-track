import { Component } from '@angular/core';
import { ExamService, type ExamUploadResponse } from '../exam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { NotificationHelperService } from '../../shared/services/notification-helper.service';

@Component({
  selector: 'app-import-exam',
  templateUrl: './import-exam.component.html',
  styleUrls: ['./import-exam.component.scss'],
  standalone: false,
})
export class ImportExamComponent {
  selectedFile: File | null = null;
  selectedFileName = '';
  uploadResult: ExamUploadResponse | null = null;

  constructor(
    private examService: ExamService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;

    this.selectedFile = file;
    this.selectedFileName = file?.name ?? '';
    this.uploadResult = null;
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.notificationHelper.showWarning('Selecione um arquivo para enviar.');
      return;
    }

    this.loadingService
      .track(this.examService.uploadExam(this.selectedFile))
      .subscribe({
        next: (response) => {
          this.uploadResult = response;
          this.notificationHelper.showSuccess('Exame enviado com sucesso.');
        },
        error: (request) => {
          this.notificationHelper.showError(
            request?.error?.error ?? 'Erro ao enviar o exame.'
          );
        },
      });
  }
}
