import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { LucidePlus } from '@lucide/angular';

export interface GuestDraft {
  name: string;
  party: string;
  meal: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, FormsModule, InputTextModule, LucidePlus, SelectModule],
  selector: 'app-add-guest-dialog',
  standalone: true,
  templateUrl: './add-guest-dialog.component.html',
})
export class AddGuestDialogComponent {
  readonly visible = input(false);
  readonly closed = output<void>();
  readonly guestAdded = output<GuestDraft>();

  protected readonly guestName = signal('');
  protected readonly guestParty = signal('Friends');
  protected readonly guestMeal = signal('Salmon');
  protected readonly partyOptions = ['Bride side', 'Groom side', 'Friends', 'Cousins', 'Work friends'];
  protected readonly mealOptions = ['Salmon', 'Beef', 'Vegetarian', 'Chicken'];

  protected close(): void {
    this.closed.emit();
  }

  protected addGuest(): void {
    const name = this.guestName().trim();
    if (!name) return;

    this.guestAdded.emit({ name, party: this.guestParty(), meal: this.guestMeal() });
    this.guestName.set('');
    this.close();
  }
}