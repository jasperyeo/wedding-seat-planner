import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LucideSearch } from '@lucide/angular';
import { GuestFilter } from '../../../models/seating';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputTextModule, LucideSearch],
  selector: 'app-guest-search-filter',
  standalone: true,
  templateUrl: './guest-search-filter.component.html',
})
export class GuestSearchFilterComponent {
  readonly activeFilter = input.required<GuestFilter>();
  readonly selectedGuestId = input.required<number | null>();
  readonly totalGuests = input.required<number>();
  readonly unseatedCount = input.required<number>();
  readonly confirmedCount = input.required<number>();
  readonly search = input.required<string>();

  readonly filters: GuestFilter[] = ['Everyone', 'Unseated', 'Confirmed'];

  readonly searchChanged = output<string>();
  readonly filterChanged = output<GuestFilter>();
  readonly selectionChanged = output<number | null>();
}
