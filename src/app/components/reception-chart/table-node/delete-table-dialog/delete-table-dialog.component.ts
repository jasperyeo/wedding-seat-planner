import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { LucideTrash2 } from '@lucide/angular';
import { SeatTable } from '../../../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, LucideTrash2],
  selector: 'app-delete-table-dialog',
  standalone: true,
  templateUrl: './delete-table-dialog.component.html',
})
export class DeleteTableDialogComponent {
  readonly table = input.required<SeatTable>();
  readonly visible = input(false);

  readonly cancelled = output<void>();
  readonly confirmed = output<void>();

  protected cancel(): void {
    this.cancelled.emit();
  }

  protected confirm(): void {
    this.confirmed.emit();
  }
}
