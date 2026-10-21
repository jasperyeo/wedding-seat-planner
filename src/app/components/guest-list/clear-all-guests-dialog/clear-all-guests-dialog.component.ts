import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { LucideTrash2 } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, LucideTrash2],
  selector: 'app-clear-all-guests-dialog',
  standalone: true,
  templateUrl: './clear-all-guests-dialog.component.html',
})
export class ClearAllGuestsDialogComponent {
  readonly visible = input(false);
  readonly guestCount = input.required<number>();

  readonly cancelled = output<void>();
  readonly confirmed = output<void>();

  protected cancel(): void {
    this.cancelled.emit();
  }

  protected confirm(): void {
    this.confirmed.emit();
  }
}