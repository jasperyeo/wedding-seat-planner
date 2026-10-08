import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Guest, SeatTable } from '../../models/seating';
import { AddTableDialogComponent, TableDraft } from './add-table-dialog/add-table-dialog.component';
import { ChartFooterComponent } from './chart-footer/chart-footer.component';
import { ChartInstructionComponent } from './chart-instruction/chart-instruction.component';
import { ChartToolbarComponent } from './chart-toolbar/chart-toolbar.component';
import { TableNodeComponent } from './table-node/table-node.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'planner-layout-contents' },
  imports: [AddTableDialogComponent, ChartFooterComponent, ChartInstructionComponent, ChartToolbarComponent, TableNodeComponent],
  selector: 'app-reception-chart',
  standalone: true,
  templateUrl: './reception-chart.component.html',
})
export class ReceptionChartComponent {
  readonly guests = input.required<Guest[]>();
  readonly tables = input.required<SeatTable[]>();
  readonly selectedGuestId = input.required<number | null>();

  readonly tablesChanged = output<SeatTable[]>();
  readonly guestsChanged = output<Guest[]>();
  readonly exportRequested = output<void>();
  readonly assignGuestRequested = output<number>();
  readonly unseatedGuestsRequested = output<void>();

  protected readonly addTableDialogVisible = signal(false);

  protected openAddTableDialog(): void {
    this.addTableDialogVisible.set(true);
  }

  protected closeAddTableDialog(): void {
    this.addTableDialogVisible.set(false);
  }

  protected addTable(draft: TableDraft): void {
    const tables = this.tables();
    const name = draft.name || `Table ${tables.length + 1}`;
    const id = Math.max(0, ...tables.map(table => table.id)) + 1;
    const positions = [{ x: 20, y: 42 }, { x: 51, y: 42 }, { x: 78, y: 42 }, { x: 36, y: 86 }, { x: 66, y: 86 }];
    this.tablesChanged.emit([...tables, {
      id,
      name,
      capacity: Math.min(12, Math.max(2, Number(draft.capacity) || 10)),
      shape: 'round',
      accent: ['sage', 'coral', 'blue', 'gold'][tables.length % 4],
      position: positions[tables.length % positions.length],
    }]);
    this.closeAddTableDialog();
  }

  protected deleteTable(tableId: number): void {
    this.tablesChanged.emit(this.tables().filter(table => table.id !== tableId));
    this.guestsChanged.emit(this.guests().map(guest => guest.tableId === tableId ? { ...guest, tableId: null } : guest));
  }

  protected moveTable(event: { id: number; position: { x: number; y: number } }): void {
    const position = {
      x: Math.min(92, Math.max(8, event.position.x)),
      y: Math.min(92, Math.max(8, event.position.y)),
    };
    this.tablesChanged.emit(this.tables().map(table => table.id === event.id ? { ...table, position } : table));
  }

  protected selectedGuestName(): string | undefined {
    return this.guests().find(guest => guest.id === this.selectedGuestId())?.name;
  }
}