import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideArmchair, LucideCheck, LucideUsers, LucideUtensils } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideArmchair, LucideCheck, LucideUsers, LucideUtensils],
  selector: 'app-summary-strip',
  standalone: true,
  templateUrl: './summary-strip.component.html',
})
export class SummaryStripComponent {
  readonly totalGuests = input.required<number>();
  readonly confirmedGuests = input.required<number>();
  readonly seatedGuests = input.required<number>();
  readonly tableCount = input.required<number>();
  readonly seatingProgress = input.required<number>();
}