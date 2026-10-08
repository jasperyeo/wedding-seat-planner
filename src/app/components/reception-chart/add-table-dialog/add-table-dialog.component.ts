import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LucidePlus } from '@lucide/angular';

export interface TableDraft {
  name: string;
  capacity: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, FormsModule, InputTextModule, LucidePlus],
  selector: 'app-add-table-dialog',
  standalone: true,
  templateUrl: './add-table-dialog.component.html',
})
export class AddTableDialogComponent {
  readonly visible = input(false);

  readonly closed = output<void>();
  readonly tableAdded = output<TableDraft>();

  protected readonly tableName = signal('');
  protected readonly capacity = signal(8);

  protected close(): void {
    this.closed.emit();
  }

  protected addTable(): void {
    const capacity = Math.min(12, Math.max(2, Number(this.capacity()) || 10));
    this.tableAdded.emit({ name: this.tableName().trim(), capacity });
    this.tableName.set('');
    this.capacity.set(8);
    this.close();
  }
}