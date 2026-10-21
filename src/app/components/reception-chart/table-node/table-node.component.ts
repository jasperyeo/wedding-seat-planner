import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { Guest, SeatTable } from '../../../models/seating';
import { DeleteTableDialogComponent } from './delete-table-dialog/delete-table-dialog.component';
import { TableInfoDialogComponent } from './table-info-dialog/table-info-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeleteTableDialogComponent, TableInfoDialogComponent],
  selector: 'app-table-node',
  standalone: true,
  templateUrl: './table-node.component.html',
})
export class TableNodeComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly table = input.required<SeatTable>();
  readonly guests = input.required<Guest[]>();
  readonly selectedGuestId = input.required<number | null>();

  readonly assignRequested = output<number>();
  readonly deleteRequested = output<number>();
  readonly clearRequested = output<number>();
  readonly unseatGuestRequested = output<number>();
  readonly positionChanged = output<{ x: number; y: number }>();

  private suppressClick = false;
  private pointerDrag: { pointerId: number; startX: number; startY: number; position: { x: number; y: number }; moved: boolean } | null = null;
  protected readonly dragPosition = signal<{ x: number; y: number } | null>(null);
  protected readonly infoVisible = signal(false);
  protected readonly deleteConfirmationVisible = signal(false);

  protected guestsAt(): Guest[] {
    return this.guests().filter(guest => guest.tableId === this.table().id);
  }

  protected seatCount(): number {
    return this.guestsAt().length;
  }

  protected leftPx(): number {
    return this.coordinatePx(this.dragPosition()?.x ?? this.table().position.x, 'width') - 71 * this.tableScaleX();
  }

  protected topPx(): number {
    return this.coordinatePx(this.dragPosition()?.y ?? this.table().position.y, 'height') - 71.5 * this.tableScaleY();
  }

  protected tableScale(): string {
    return `${this.tableScaleX()} ${this.tableScaleY()}`;
  }

  protected tableDragging(): boolean {
    return this.dragPosition() !== null;
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

  protected clearTable(): void {
    this.clearRequested.emit(this.table().id);
  }

  protected unseatGuest(guestId: number): void {
    this.unseatGuestRequested.emit(guestId);
  }

  protected cancelDelete(): void {
    this.deleteConfirmationVisible.set(false);
  }

  protected confirmDelete(): void {
    this.deleteRequested.emit(this.table().id);
    this.cancelDelete();
  }

  protected beginPointerDrag(event: PointerEvent): void {
    if (event.button !== 0) return;
    const container = this.host.nativeElement.closest('.floorplan') as HTMLElement | null;
    if (!container) return;

    this.pointerDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position: { ...this.table().position },
      moved: false,
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected movePointerDrag(event: PointerEvent): void {
    const drag = this.pointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(deltaX, deltaY) < 2) return;
    drag.moved = true;

    const container = this.host.nativeElement.closest('.floorplan') as HTMLElement | null;
    if (!container) return;
    const halfWidth = 71 * this.tableScaleX();
    const halfHeight = 71.5 * this.tableScaleY();
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = this.coordinatePx(drag.position.x, 'width') + deltaX;
    const centerY = this.coordinatePx(drag.position.y, 'height') + deltaY;

    this.dragPosition.set({
      x: this.toPercent(Math.max(halfWidth, Math.min(width - halfWidth, centerX)), width),
      y: this.toPercent(Math.max(halfHeight, Math.min(height - halfHeight, centerY)), height),
    });
  }

  protected endPointerDrag(event: PointerEvent): void {
    const drag = this.pointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.moved) {
      const position = this.dragPosition();
      if (position) this.positionChanged.emit(position);
      this.suppressClick = true;
      window.setTimeout(() => { this.suppressClick = false; }, 0);
    }

    this.pointerDrag = null;
    this.dragPosition.set(null);
  }

  protected cancelPointerDrag(event: PointerEvent): void {
    if (this.pointerDrag?.pointerId !== event.pointerId) return;
    this.pointerDrag = null;
    this.dragPosition.set(null);
  }

  private tableScaleX(): number {
    if (window.innerWidth <= 420) return 0.59;
    if (window.innerWidth <= 760) return 0.66;
    if (window.innerWidth <= 1050) return 0.87;
    return 1;
  }

  private tableScaleY(): number {
    if (window.innerWidth <= 420) return 0.69;
    if (window.innerWidth <= 760) return 0.77;
    if (window.innerWidth <= 1050) return 0.87;
    return 1;
  }

  private toPercent(pixels: number, dimension: number): number {
    return dimension > 0 ? pixels / dimension * 100 : 0;
  }

  private coordinatePx(value: number, dimension: 'width' | 'height'): number {
    const container = this.host.nativeElement.closest('.floorplan') as HTMLElement | null;
    if (!container) return 0;
    return value / 100 * (dimension === 'width' ? container.clientWidth : container.clientHeight);
  }
}
