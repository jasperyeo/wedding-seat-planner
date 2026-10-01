import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideArmchair, LucideChevronDown, LucideDownload, LucidePlus } from '@lucide/angular';
import { Guest, SeatTable } from '../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'planner-layout-contents' },
  imports: [LucideArmchair, LucideChevronDown, LucideDownload, LucidePlus],
  selector: 'app-reception-chart',
  standalone: true,
  templateUrl: './reception-chart.component.html',
})
export class ReceptionChartComponent {
  readonly guests = input.required<Guest[]>();
  readonly tables = input.required<SeatTable[]>();
  readonly selectedGuestId = input.required<number | null>();

  readonly addTableRequested = output<void>();
  readonly exportRequested = output<void>();
  readonly assignGuestRequested = output<number>();
  readonly unseatedGuestsRequested = output<void>();

  protected guestsAt(tableId: number): Guest[] {
    return this.guests().filter(guest => guest.tableId === tableId);
  }

  protected seatCount(tableId: number): number {
    return this.guestsAt(tableId).length;
  }

  protected selectedGuestName(): string | undefined {
    return this.guests().find(guest => guest.id === this.selectedGuestId())?.name;
  }

  protected assignSelected(tableId: number): void {
    if (this.selectedGuestId() === null) return;
    const table = this.tables().find(item => item.id === tableId);
    if (!table || this.seatCount(tableId) >= table.capacity) return;
    this.assignGuestRequested.emit(tableId);
  }
}