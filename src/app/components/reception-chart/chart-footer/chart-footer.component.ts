import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideChevronDown],
  selector: 'app-chart-footer',
  standalone: true,
  templateUrl: './chart-footer.component.html',
})
export class ChartFooterComponent {
  readonly remainingGuestsCount = input.required<number>();

  readonly viewUnseatedRequested = output<void>();
}
