import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { LucidePlus, LucideUsersRound } from '@lucide/angular';
import { Guest, GuestFilter, SeatTable } from '../../models/seating';
import { AddGuestDialogComponent, GuestDraft } from './add-guest-dialog/add-guest-dialog.component';
import { DeleteGuestDialogComponent } from './delete-guest-dialog/delete-guest-dialog.component';
import { GuestInfoDialogComponent } from './guest-info-dialog/guest-info-dialog.component';
import { GuestRowComponent } from './guest-row/guest-row.component';
import { GuestSearchFilterComponent } from './guest-search-filter/guest-search-filter.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'planner-layout-contents' },
  imports: [AddGuestDialogComponent, CdkDropList, DeleteGuestDialogComponent, GuestInfoDialogComponent, GuestRowComponent, GuestSearchFilterComponent, LucidePlus, LucideUsersRound],
  selector: 'app-guest-list',
  standalone: true,
  templateUrl: './guest-list.component.html',
})
export class GuestListComponent {
  readonly guests = input.required<Guest[]>();
  readonly tables = input.required<SeatTable[]>();
  readonly filteredGuests = input.required<Guest[]>();
  readonly activeFilter = input.required<GuestFilter>();
  readonly selectedGuestId = input.required<number | null>();
  readonly unseatedCount = input.required<number>();
  readonly confirmedCount = input.required<number>();
  readonly search = input.required<string>();

  readonly searchChanged = output<string>();
  readonly filterChanged = output<GuestFilter>();
  readonly selectionChanged = output<number | null>();
  readonly guestAdded = output<Guest>();
  readonly guestsChanged = output<Guest[]>();

  readonly filters: GuestFilter[] = ['Everyone', 'Unseated', 'Confirmed'];
  protected readonly addGuestDialogVisible = signal(false);
  protected readonly guestInfo = signal<Guest | null>(null);
  protected readonly guestToDelete = signal<Guest | null>(null);
  protected readonly deleteConfirmationVisible = signal(false);

  protected isSelected(guestId: number): boolean {
    return this.selectedGuestId() === guestId;
  }

  protected openAddGuestDialog(): void {
    this.addGuestDialogVisible.set(true);
  }

  protected closeAddGuestDialog(): void {
    this.addGuestDialogVisible.set(false);
  }

  protected addGuest(guest: GuestDraft): void {
    const name = guest.name.trim();
    if (!name) return;

    const nextGuest: Guest = {
      id: Math.max(0, ...this.guests().map(item => item.id)) + 1,
      name,
      party: guest.party,
      meal: guest.meal,
      status: 'Pending',
      tableId: null,
      initials: name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(),
      color: ['rose', 'sage', 'gold', 'blue'][this.guests().length % 4],
    };

    this.guestAdded.emit(nextGuest);
    this.closeAddGuestDialog();
  }

  protected selectGuest(guestId: number): void {
    this.selectionChanged.emit(this.isSelected(guestId) ? null : guestId);
  }

  protected reorderGuests(event: CdkDragDrop<Guest[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const orderedGuests = [...this.filteredGuests()];
    moveItemInArray(orderedGuests, event.previousIndex, event.currentIndex);
    const orderedIds = orderedGuests.map(guest => guest.id);
    const orderedIdSet = new Set(orderedIds);
    const guestsById = new Map(this.guests().map(guest => [guest.id, guest]));
    const reorderedGuests = orderedIds.map(id => guestsById.get(id)).filter((guest): guest is Guest => guest !== undefined);
    let nextOrderedGuest = 0;
    this.guestsChanged.emit(this.guests().map(guest => {
      if (!orderedIdSet.has(guest.id)) return guest;
      return reorderedGuests[nextOrderedGuest++];
    }));
  }

  assignSelected(tableId: number): void {
    const guestId = this.selectedGuestId();
    if (guestId === null) return;
    const table = this.tables().find(item => item.id === tableId);
    const seatCount = this.guests().filter(guest => guest.tableId === tableId).length;
    if (!table || seatCount >= table.capacity) return;

    this.guestsChanged.emit(this.guests().map(guest => guest.id === guestId ? { ...guest, tableId } : guest));
    this.selectionChanged.emit(null);
  }

  protected deleteGuest(guestId: number): void {
    this.guestsChanged.emit(this.guests().filter(guest => guest.id !== guestId));
    if (this.selectedGuestId() === guestId) this.selectionChanged.emit(null);
  }

  protected showGuestInfo(guest: Guest): void {
    this.guestInfo.set(guest);
  }

  protected closeGuestInfo(): void {
    this.guestInfo.set(null);
  }

  protected requestDelete(guest: Guest): void {
    this.guestToDelete.set(guest);
    this.deleteConfirmationVisible.set(true);
  }

  protected cancelDelete(): void {
    this.deleteConfirmationVisible.set(false);
    this.guestToDelete.set(null);
  }

  protected confirmDelete(): void {
    const guest = this.guestToDelete();
    if (!guest) return;
    this.deleteGuest(guest.id);
    this.cancelDelete();
  }
}