import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { TrainingStatus } from '../../shared/enums/training-status.enum';
import { TrainingGetAll } from '../../shared/models/training-get-all.model';
import { LoadingService } from '../../shared/services/loading.service';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-finished-traning',
  templateUrl: './finished-traning.component.html',
  styleUrls: ['./finished-traning.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  standalone: false,
})
export class FinishedTraningComponent implements OnInit {
  displayedColumns: Array<keyof TrainingGetAll | 'actions' | 'expand'> = [
    'expand',
    'actions',
    'status',
    'exerciseDate',
    'timeCompleted',
    'quantidadeExercicios',
  ];
  trainings: TrainingGetAll[] = [];
  trainingStatus = TrainingStatus;
  expandedElement: TrainingGetAll | null = null;

  constructor(
    private treinoService: TrainingService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  toggleRow(element: TrainingGetAll): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  deleteTraining(training: TrainingGetAll, event: Event): void {
    event.stopPropagation();
    const trainingDateFormatted = this.formatDate(training.exerciseDate);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir o treino de ${trainingDateFormatted}?`,
        actionButtonText: 'Excluir',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trainings = this.trainings.filter((t) => t.id !== training.id);
      }
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private loadTrainings(): void {
    this.loadingService
      .track(this.treinoService.getAll().pipe(delay(1000)))
      .subscribe((data) => {
        this.trainings = data;
      });
  }
}
