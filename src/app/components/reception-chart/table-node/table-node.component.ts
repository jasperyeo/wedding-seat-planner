import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Guest, SeatTable } from '../../../models/seating';
import { DeleteTableDialogComponent } from './delete-table-dialog/delete-table-dialog.component';
import { TableInfoDialogComponent } from './table-info-dialog/table-info-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDrag, DeleteTableDialogComponent, TableInfoDialogComponent],
  selector: 'app-table-node',
  standalone: true,
  templateUrl: './table-node.component.html',
})
export class TableNodeComponent {
  readonly table = input.required<SeatTable>();
  readonly guests = input.required<Guest[]>();
  readonly selectedGuestId = input.required<number | null>();

  readonly assignRequested = output<number>();
  readonly deleteRequested = output<number>();
  readonly positionChanged = output<{ x: number; y: number }>();

  private suppressClick = false;
  protected readonly infoVisible = signal(false);
  protected readonly deleteConfirmationVisible = signal(false);

  protected guestsAt(): Guest[] {
    return this.guests().filter(guest => guest.tableId === this.table().id);
  }

  protected seatCount(): number {
    return this.guestsAt().length;
  }

  protected handleClick(): void {
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }

    if (this.selectedGuestId() !== null) {
      this.assignSelected();
      return;
    }

    this.infoVisible.set(true);
  }

  protected assignSelected(): void {
    if (this.selectedGuestId() === null) return;
    if (this.seatCount() >= this.table().capacity) return;
    this.assignRequested.emit(this.table().id);
  }

  protected closeInfo(): void {
    this.infoVisible.set(false);
  }

  protected requestDelete(): void {
    this.deleteConfirmationVisible.set(true);
  }

  protected cancelDelete(): void {
    this.deleteConfirmationVisible.set(false);
  }

  protected confirmDelete(): void {
    this.deleteRequested.emit(this.table().id);
    this.cancelDelete();
  }

  protected handleDragStarted(): void {
    this.suppressClick = true;
  }

  protected handleDragEnded(event: CdkDragEnd): void {
    const container = document.querySelector('.floorplan') as HTMLElement | null;
    if (!container) {
      window.setTimeout(() => { this.suppressClick = false; }, 0);
      return;
    }

    const pointerEvent = event.event as PointerEvent | MouseEvent | TouchEvent | null;
    const clientX = pointerEvent instanceof PointerEvent
      ? pointerEvent.clientX
      : pointerEvent instanceof MouseEvent
        ? pointerEvent.clientX
        : pointerEvent && 'changedTouches' in pointerEvent && pointerEvent.changedTouches.length > 0
          ? pointerEvent.changedTouches[0].clientX
          : null;

    const clientY = pointerEvent instanceof PointerEvent
      ? pointerEvent.clientY
      : pointerEvent instanceof MouseEvent
        ? pointerEvent.clientY
        : pointerEvent && 'changedTouches' in pointerEvent && pointerEvent.changedTouches.length > 0
          ? pointerEvent.changedTouches[0].clientY
          : null;

    if (clientX === null || clientY === null) {
      window.setTimeout(() => { this.suppressClick = false; }, 0);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const x = ((clientX - containerRect.left) / containerRect.width) * 100;
    const y = ((clientY - containerRect.top) / containerRect.height) * 100;

    this.positionChanged.emit({
      x: Math.min(92, Math.max(8, x)),
      y: Math.min(92, Math.max(8, y)),
    });

    window.setTimeout(() => { this.suppressClick = false; }, 0);
  }
}
