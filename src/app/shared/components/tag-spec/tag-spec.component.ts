import { Component, Input } from '@angular/core';

type TagSpecVariant = 'low' | 'growing' | 'neutral';

@Component({
    selector: 'app-tag-spec',
    templateUrl: './tag-spec.component.html',
    styleUrls: ['./tag-spec.component.scss'],
    standalone: false
})
export class TagSpecComponent {
  @Input() text = '';
  @Input() variant: TagSpecVariant = 'neutral';
  @Input() icon: string | null = null;
}
