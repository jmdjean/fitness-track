import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule],
  exports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule],
})
export class MaterialModule {}
