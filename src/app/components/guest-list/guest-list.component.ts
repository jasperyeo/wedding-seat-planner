import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LucideArmchair, LucideGripVertical, LucideInfo, LucidePlus, LucideSearch, LucideTrash2, LucideUsersRound, LucideX } from '@lucide/angular';
import { Guest, GuestFilter } from '../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'planner-layout-contents' },
  imports: [CdkDrag, CdkDragHandle, CdkDropList, FormsModule, DialogModule, InputTextModule, LucideArmchair, LucideGripVertical, LucideInfo, LucidePlus, LucideSearch, LucideTrash2, LucideUsersRound, LucideX],
  selector: 'app-guest-list',
  standalone: true,
  templateUrl: './guest-list.component.html',
})
export class GuestListComponent {
  readonly guests = input.required<Guest[]>();
  readonly filteredGuests = input.required<Guest[]>();
  readonly activeFilter = input.required<GuestFilter>();
  readonly selectedGuestId = input.required<number | null>();
  readonly unseatedCount = input.required<number>();
  readonly confirmedCount = input.required<number>();
  readonly search = input.required<string>();

  readonly searchChanged = output<string>();
  readonly filterChanged = output<GuestFilter>();
  readonly selectionChanged = output<number | null>();
  readonly addGuestRequested = output<void>();
  readonly deleteGuestRequested = output<number>();
  readonly reorderRequested = output<number[]>();

  readonly filters: GuestFilter[] = ['Everyone', 'Unseated', 'Confirmed'];
  protected readonly guestInfo = signal<Guest | null>(null);
  protected readonly guestToDelete = signal<Guest | null>(null);
  protected readonly deleteConfirmationVisible = signal(false);

  protected isSelected(guestId: number): boolean {
    return this.selectedGuestId() === guestId;
  }

  protected selectGuest(guestId: number): void {
    this.selectionChanged.emit(this.isSelected(guestId) ? null : guestId);
  }

  protected reorderGuests(event: CdkDragDrop<Guest[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const orderedGuests = [...this.filteredGuests()];
    moveItemInArray(orderedGuests, event.previousIndex, event.currentIndex);
    this.reorderRequested.emit(orderedGuests.map(guest => guest.id));
  }

  protected showGuestInfo(guest: Guest): void {
    this.guestInfo.set(guest);
  }

  protected closeGuestInfo(): void {
    this.guestInfo.set(null);
  }

  protected requestDelete(guest: Guest): void {
    this.guestInfo.set(null);
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
    this.deleteGuestRequested.emit(guest.id);
    this.cancelDelete();
  }
}