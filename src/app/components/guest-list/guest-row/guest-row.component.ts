import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LucideArmchair, LucideGripVertical, LucideInfo } from '@lucide/angular';
import { Guest } from '../../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDrag, CdkDragHandle, LucideArmchair, LucideGripVertical, LucideInfo],
  selector: 'app-guest-row',
  standalone: true,
  templateUrl: './guest-row.component.html',
})
export class GuestRowComponent {
  readonly guest = input.required<Guest>();
  readonly isSelected = input(false);

  readonly selectRequested = output<number>();
  readonly infoRequested = output<Guest>();

  protected selectGuest(): void {
    this.selectRequested.emit(this.guest().id);
  }
}
