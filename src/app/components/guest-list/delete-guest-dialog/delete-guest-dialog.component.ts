import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { LucideTrash2 } from '@lucide/angular';
import { Guest } from '../../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, LucideTrash2],
  selector: 'app-delete-guest-dialog',
  standalone: true,
  templateUrl: './delete-guest-dialog.component.html',
})
export class DeleteGuestDialogComponent {
  readonly guest = input<Guest | null>(null);
  readonly visible = input(false);

  readonly kept = output<void>();
  readonly confirmed = output<void>();

  protected keepGuest(): void {
    this.kept.emit();
  }

  protected confirmDelete(): void {
    this.confirmed.emit();
  }
}
