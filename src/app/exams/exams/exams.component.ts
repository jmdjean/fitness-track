import { Component, OnInit } from '@angular/core';
import { ExamService, type ExamByUserResponse } from '../exam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { NotificationHelperService } from '../../shared/services/notification-helper.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
  standalone: false,
})
export class ExamsComponent implements OnInit {
  examData: ExamByUserResponse | null = null;

  constructor(
    private examService: ExamService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  ngOnInit(): void {
    this.loadExamData();
  }

  private loadExamData(): void {
    this.loadingService.track(this.examService.getByUser()).subscribe({
      next: (response) => {
        this.examData = response;
      },
      error: (request) => {
        this.notificationHelper.showError(
          request?.error?.error ?? 'Erro ao buscar exames.'
        );
      },
    });
  }
}
