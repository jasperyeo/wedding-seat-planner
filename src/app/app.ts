import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { LucidePlus } from '@lucide/angular';
import { WeddingHeadingComponent } from './components/wedding-heading/wedding-heading.component';
import { SummaryStripComponent } from './components/summary-strip/summary-strip.component';
import { Guest, GuestFilter, SeatTable } from './models/seating';
import { GuestListComponent } from './components/guest-list/guest-list.component';
import { ReceptionChartComponent } from './components/reception-chart/reception-chart.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DialogModule, InputTextModule, SelectModule, WeddingHeadingComponent, SummaryStripComponent, GuestListComponent, ReceptionChartComponent, LucidePlus],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly storageKey = 'gather-seating-plan-v1';

  protected readonly guests = signal<Guest[]>([
    { id: 1, name: 'Olivia Bennett', party: 'Bride side', meal: 'Salmon', status: 'Confirmed', tableId: 1, initials: 'OB', color: 'rose' },
    { id: 2, name: 'James Bennett', party: 'Bride side', meal: 'Beef', status: 'Confirmed', tableId: 1, initials: 'JB', color: 'sage' },
    { id: 3, name: 'Margaret Bennett', party: 'Bride side', meal: 'Vegetarian', status: 'Confirmed', tableId: 1, initials: 'MB', color: 'gold' },
    { id: 4, name: 'Henry Bennett', party: 'Bride side', meal: 'Salmon', status: 'Confirmed', tableId: 1, initials: 'HB', color: 'blue' },
    { id: 5, name: 'Charlotte Reed', party: 'Bride side', meal: 'Beef', status: 'Confirmed', tableId: 1, initials: 'CR', color: 'rose' },
    { id: 6, name: 'William Reed', party: 'Bride side', meal: 'Salmon', status: 'Confirmed', tableId: 1, initials: 'WR', color: 'sage' },
    { id: 7, name: 'Eleanor Bennett', party: 'Bride side', meal: 'Vegetarian', status: 'Confirmed', tableId: 1, initials: 'EB', color: 'gold' },
    { id: 8, name: 'Theodore Bennett', party: 'Bride side', meal: 'Beef', status: 'Confirmed', tableId: 1, initials: 'TB', color: 'blue' },
    { id: 9, name: 'Amelia Clarke', party: 'Groom side', meal: 'Salmon', status: 'Confirmed', tableId: 2, initials: 'AC', color: 'blue' },
    { id: 10, name: 'Benjamin Clarke', party: 'Groom side', meal: 'Beef', status: 'Confirmed', tableId: 2, initials: 'BC', color: 'rose' },
    { id: 11, name: 'Isabelle Morgan', party: 'Groom side', meal: 'Vegetarian', status: 'Confirmed', tableId: 2, initials: 'IM', color: 'sage' },
    { id: 12, name: 'Oliver Morgan', party: 'Groom side', meal: 'Salmon', status: 'Confirmed', tableId: 2, initials: 'OM', color: 'gold' },
    { id: 13, name: 'Sophia Hayes', party: 'Groom side', meal: 'Beef', status: 'Confirmed', tableId: 2, initials: 'SH', color: 'rose' },
    { id: 14, name: 'Lucas Hayes', party: 'Groom side', meal: 'Salmon', status: 'Confirmed', tableId: 2, initials: 'LH', color: 'sage' },
    { id: 15, name: 'Harper Collins', party: 'Friends', meal: 'Beef', status: 'Confirmed', tableId: 3, initials: 'HC', color: 'gold' },
    { id: 16, name: 'Elijah Collins', party: 'Friends', meal: 'Salmon', status: 'Confirmed', tableId: 3, initials: 'EC', color: 'blue' },
    { id: 17, name: 'Mia Parker', party: 'Friends', meal: 'Vegetarian', status: 'Confirmed', tableId: 3, initials: 'MP', color: 'rose' },
    { id: 18, name: 'Noah Parker', party: 'Friends', meal: 'Beef', status: 'Confirmed', tableId: 3, initials: 'NP', color: 'sage' },
    { id: 19, name: 'Ava Brooks', party: 'Friends', meal: 'Salmon', status: 'Confirmed', tableId: 4, initials: 'AB', color: 'gold' },
    { id: 20, name: 'Ethan Brooks', party: 'Friends', meal: 'Beef', status: 'Confirmed', tableId: 4, initials: 'EB', color: 'blue' },
    { id: 21, name: 'Grace Turner', party: 'Friends', meal: 'Salmon', status: 'Confirmed', tableId: 4, initials: 'GT', color: 'rose' },
    { id: 22, name: 'Jack Turner', party: 'Friends', meal: 'Vegetarian', status: 'Confirmed', tableId: 4, initials: 'JT', color: 'sage' },
    { id: 23, name: 'Lily Foster', party: 'Friends', meal: 'Beef', status: 'Confirmed', tableId: 5, initials: 'LF', color: 'blue' },
    { id: 24, name: 'Mason Foster', party: 'Friends', meal: 'Salmon', status: 'Confirmed', tableId: 5, initials: 'MF', color: 'gold' },
    { id: 25, name: 'Chloe Ward', party: 'Friends', meal: 'Beef', status: 'Confirmed', tableId: 5, initials: 'CW', color: 'rose' },
    { id: 26, name: 'Sebastian Ward', party: 'Friends', meal: 'Salmon', status: 'Confirmed', tableId: 5, initials: 'SW', color: 'sage' },
    { id: 27, name: 'Violet Price', party: 'Friends', meal: 'Vegetarian', status: 'Confirmed', tableId: 6, initials: 'VP', color: 'gold' },
    { id: 28, name: 'Leo Price', party: 'Friends', meal: 'Beef', status: 'Confirmed', tableId: 6, initials: 'LP', color: 'blue' },
    { id: 29, name: 'Avery James', party: 'Work friends', meal: 'Salmon', status: 'Pending', tableId: null, initials: 'AJ', color: 'rose' },
    { id: 30, name: 'Riley James', party: 'Work friends', meal: 'Beef', status: 'Pending', tableId: null, initials: 'RJ', color: 'sage' },
    { id: 31, name: 'Sienna Ellis', party: 'Cousins', meal: 'Vegetarian', status: 'Confirmed', tableId: null, initials: 'SE', color: 'gold' },
    { id: 32, name: 'Hudson Ellis', party: 'Cousins', meal: 'Salmon', status: 'Pending', tableId: null, initials: 'HE', color: 'blue' },
    { id: 33, name: 'Zoe Campbell', party: 'Work friends', meal: 'Beef', status: 'Pending', tableId: null, initials: 'ZC', color: 'rose' },
  ]);

  protected readonly tables = signal<SeatTable[]>([
    { id: 1, name: 'Table 1', capacity: 8, shape: 'round', accent: 'sage', position: { x: 20, y: 18 } },
    { id: 2, name: 'Table 2', capacity: 8, shape: 'round', accent: 'coral', position: { x: 51, y: 31 } },
    { id: 3, name: 'Table 3', capacity: 8, shape: 'round', accent: 'blue', position: { x: 78, y: 19 } },
    { id: 4, name: 'Table 4', capacity: 8, shape: 'round', accent: 'gold', position: { x: 20, y: 66 } },
    { id: 5, name: 'Table 5', capacity: 8, shape: 'round', accent: 'sage', position: { x: 51, y: 69 } },
    { id: 6, name: 'Table 6', capacity: 8, shape: 'round', accent: 'coral', position: { x: 78, y: 65 } },
  ]);

  protected readonly search = signal('');
  protected readonly activeFilter = signal<GuestFilter>('Everyone');
  protected readonly selectedGuest = signal<number | null>(null);
  protected readonly guestDialogVisible = signal(false);
  protected readonly tableDialogVisible = signal(false);
  protected readonly guestName = signal('');
  protected readonly guestParty = signal('Friends');
  protected readonly guestMeal = signal('Salmon');
  protected readonly newTableName = signal('');
  protected readonly newTableCapacity = signal(8);
  protected readonly partyOptions = ['Bride side', 'Groom side', 'Friends', 'Cousins', 'Work friends'];
  protected readonly mealOptions = ['Salmon', 'Beef', 'Vegetarian', 'Chicken'];
  protected readonly filters: GuestFilter[] = ['Everyone', 'Unseated', 'Confirmed'];
  protected readonly seatedCount = computed(() => this.guests().filter(guest => guest.tableId !== null).length);
  protected readonly confirmedCount = computed(() => this.guests().filter(guest => guest.status === 'Confirmed').length);
  protected readonly unseatedCount = computed(() => this.guests().filter(guest => guest.tableId === null).length);
  protected readonly seatingProgress = computed(() => this.guests().length ? Math.round(this.seatedCount() / this.guests().length * 100) : 0);
  protected readonly filteredGuests = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.guests().filter(guest => {
      const matchesSearch = !query || `${guest.name} ${guest.party} ${guest.meal}`.toLowerCase().includes(query);
      const matchesFilter = this.activeFilter() === 'Everyone'
        || (this.activeFilter() === 'Unseated' && guest.tableId === null)
        || (this.activeFilter() === 'Confirmed' && guest.status === 'Confirmed');
      return matchesSearch && matchesFilter;
    });
  });

  constructor() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const plan = JSON.parse(saved) as { guests?: Guest[]; tables?: SeatTable[] };
        if (Array.isArray(plan.guests) && Array.isArray(plan.tables)) {
          this.guests.set(plan.guests);
          this.tables.set(plan.tables);
        }
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }

    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify({ guests: this.guests(), tables: this.tables() }));
    });
  }

  protected seatCount(tableId: number): number {
    return this.guests().filter(guest => guest.tableId === tableId).length;
  }

  protected assignSelected(tableId: number): void {
    const guestId = this.selectedGuest();
    if (guestId === null) return;
    const table = this.tables().find(item => item.id === tableId);
    if (!table || this.seatCount(tableId) >= table.capacity) return;
    this.guests.update(guests => guests.map(guest => guest.id === guestId ? { ...guest, tableId } : guest));
    this.selectedGuest.set(null);
  }

  protected unseat(guestId: number): void {
    this.guests.update(guests => guests.map(guest => guest.id === guestId ? { ...guest, tableId: null } : guest));
  }

  protected addGuest(): void {
    const name = this.guestName().trim();
    if (!name) return;
    const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
    const colors = ['rose', 'sage', 'gold', 'blue'];
    this.guests.update(guests => [...guests, { id: Math.max(0, ...guests.map(guest => guest.id)) + 1, name, party: this.guestParty(), meal: this.guestMeal(), status: 'Pending', tableId: null, initials, color: colors[guests.length % colors.length] }]);
    this.guestName.set('');
    this.guestDialogVisible.set(false);
  }

  protected addTable(): void {
    const name = this.newTableName().trim() || `Table ${this.tables().length + 1}`;
    const id = Math.max(0, ...this.tables().map(table => table.id)) + 1;
    const positions = [{ x: 20, y: 42 }, { x: 51, y: 42 }, { x: 78, y: 42 }, { x: 36, y: 86 }, { x: 66, y: 86 }];
    this.tables.update(tables => [...tables, { id, name, capacity: Math.min(12, Math.max(2, Number(this.newTableCapacity()) || 8)), shape: 'round', accent: ['sage', 'coral', 'blue', 'gold'][tables.length % 4], position: positions[tables.length % positions.length] }]);
    this.newTableName.set('');
    this.tableDialogVisible.set(false);
  }

  protected exportPlan(): void {
    const rows = [['Guest', 'Party', 'Meal', 'Table'], ...this.guests().map(guest => [guest.name, guest.party, guest.meal, this.tables().find(table => table.id === guest.tableId)?.name ?? 'Unseated'])];
    const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = 'olivia-james-seating-plan.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
