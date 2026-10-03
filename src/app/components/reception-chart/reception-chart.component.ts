import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Guest, SeatTable } from '../../models/seating';
import { ChartFooterComponent } from './chart-footer/chart-footer.component';
import { ChartInstructionComponent } from './chart-instruction/chart-instruction.component';
import { ChartToolbarComponent } from './chart-toolbar/chart-toolbar.component';
import { TableNodeComponent } from './table-node/table-node.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'planner-layout-contents' },
  imports: [ChartFooterComponent, ChartInstructionComponent, ChartToolbarComponent, TableNodeComponent],
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

  protected selectedGuestName(): string | undefined {
    return this.guests().find(guest => guest.id === this.selectedGuestId())?.name;
  }
}