import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationHelperService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
