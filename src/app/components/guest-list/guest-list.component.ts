import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LucidePlus, LucideSearch, LucideUsersRound } from '@lucide/angular';
import { Guest, GuestFilter } from '../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'planner-layout-contents' },
  imports: [FormsModule, InputTextModule, LucidePlus, LucideSearch, LucideUsersRound],
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

  readonly filters: GuestFilter[] = ['Everyone', 'Unseated', 'Confirmed'];

  protected isSelected(guestId: number): boolean {
    return this.selectedGuestId() === guestId;
  }

  protected selectGuest(guestId: number): void {
    this.selectionChanged.emit(this.isSelected(guestId) ? null : guestId);
  }
}