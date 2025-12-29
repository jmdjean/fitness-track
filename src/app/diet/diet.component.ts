import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { DietService, type DietResponse } from './diet.service';

type DietPlan = {
  days: Array<{
    day: string;
    meals: Array<{
      name: string;
      items: Array<{ name: string; quantity: string }>;
      totalCalories: number;
    }>;
    notes?: string;
  }>;
  goal?: string;
  notes?: string[];
  profile?: {
    age?: number;
    sex?: string;
    heightCm?: number;
    weightKg?: number;
  };
  targets?: {
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  };
};

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss'],
  standalone: false,
})
export class DietComponent implements OnInit {
  plan: DietPlan | null = null;
  updatedAt = '';
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
        this.applyDiet(data);
      });
  }

  private loadDiet(): void {
    this.loadingService
      .track(this.dietService.getLatest())
      .subscribe((data) => {
        this.applyDiet(data);
      });
  }

  private applyDiet(data: DietResponse): void {
    if (!data || typeof data !== 'object') {
      this.plan = null;
      this.updatedAt = '';
      return;
    }

    const payload = data as { plan?: DietPlan; updatedAt?: string };
    this.plan = payload.plan ?? null;
    this.updatedAt = payload.updatedAt ?? '';
  }
}
