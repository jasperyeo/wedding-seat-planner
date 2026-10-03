import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { LucideTrash2, LucideX } from '@lucide/angular';
import { Guest } from '../../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, LucideTrash2, LucideX],
  selector: 'app-guest-info-dialog',
  standalone: true,
  templateUrl: './guest-info-dialog.component.html',
})
export class GuestInfoDialogComponent {
  readonly guest = input<Guest | null>(null);
  readonly visible = input(false);

  readonly closed = output<void>();
  readonly deleteRequested = output<Guest>();

  protected close(): void {
    this.closed.emit();
  }

  protected requestDelete(guest: Guest): void {
    this.deleteRequested.emit(guest);
  }
}
