import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { DietService, type DietResponse } from './diet.service';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss'],
  standalone: false,
})
export class DietComponent implements OnInit {
  entries: Array<{ key: string; value: string }> = [];

  constructor(
    private dietService: DietService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadDiet();
  }

  generateDiet(): void {
    this.loadingService
      .track(this.dietService.generate())
      .subscribe((data) => {
        this.entries = this.normalizeEntries(data);
      });
  }

  private loadDiet(): void {
    this.loadingService
      .track(this.dietService.getLatest())
      .subscribe((data) => {
        this.entries = this.normalizeEntries(data);
      });
  }

  private normalizeEntries(data: DietResponse): Array<{ key: string; value: string }> {
    if (!data || typeof data !== 'object') {
      return [];
    }

    return Object.entries(data).map(([key, value]) => ({
      key: this.humanizeKey(key),
      value: this.stringifyValue(value),
    }));
  }

  private humanizeKey(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private stringifyValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.stringifyValue(item)).join(', ');
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
