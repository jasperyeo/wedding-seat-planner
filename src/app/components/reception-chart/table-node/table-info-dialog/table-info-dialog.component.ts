import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { LucideTrash2 } from '@lucide/angular';
import { Guest, SeatTable } from '../../../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, LucideTrash2],
  selector: 'app-table-info-dialog',
  standalone: true,
  templateUrl: './table-info-dialog.component.html',
})
export class TableInfoDialogComponent {
  readonly table = input.required<SeatTable>();
  readonly guests = input.required<Guest[]>();
  readonly visible = input(false);

  readonly closed = output<void>();
  readonly deleteRequested = output<void>();

  protected close(): void {
    this.closed.emit();
  }

  protected requestDelete(): void {
    this.deleteRequested.emit();
  }
}
