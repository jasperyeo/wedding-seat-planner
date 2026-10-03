import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideDownload, LucidePlus } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideDownload, LucidePlus],
  selector: 'app-chart-toolbar',
  standalone: true,
  templateUrl: './chart-toolbar.component.html',
})
export class ChartToolbarComponent {
  readonly tableCount = input.required<number>();
  readonly seatedGuestsCount = input.required<number>();

  readonly addTableRequested = output<void>();
  readonly exportRequested = output<void>();
}
