import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Guest, SeatTable } from '../../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-table-node',
  standalone: true,
  templateUrl: './table-node.component.html',
})
export class TableNodeComponent {
  readonly table = input.required<SeatTable>();
  readonly guests = input.required<Guest[]>();
  readonly selectedGuestId = input.required<number | null>();

  readonly assignRequested = output<number>();

  protected guestsAt(): Guest[] {
    return this.guests().filter(guest => guest.tableId === this.table().id);
  }

  protected seatCount(): number {
    return this.guestsAt().length;
  }

  protected assignSelected(): void {
    if (this.selectedGuestId() === null) return;
    if (this.seatCount() >= this.table().capacity) return;
    this.assignRequested.emit(this.table().id);
  }
}
