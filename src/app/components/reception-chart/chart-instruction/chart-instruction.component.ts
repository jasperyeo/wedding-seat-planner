import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideArmchair } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideArmchair],
  selector: 'app-chart-instruction',
  standalone: true,
  templateUrl: './chart-instruction.component.html',
})
export class ChartInstructionComponent {
  readonly selectedGuestId = input.required<number | null>();
  readonly selectedGuestName = input<string | undefined>(undefined);
}
