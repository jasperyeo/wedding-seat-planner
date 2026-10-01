import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { LucideCalendarDays, LucideDownload, LucideMapPin } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCalendarDays, LucideDownload, LucideMapPin],
  selector: 'app-wedding-heading',
  standalone: true,
  styleUrl: './wedding-heading.component.scss',
  templateUrl: './wedding-heading.component.html',
})
export class WeddingHeadingComponent {
  readonly exportRequested = output<void>();
}
