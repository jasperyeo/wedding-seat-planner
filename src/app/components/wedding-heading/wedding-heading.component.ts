import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { LucideCalendarDays, LucideCheck, LucideDownload, LucideMapPin, LucidePencil, LucideX } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCalendarDays, LucideCheck, LucideDownload, LucideMapPin, LucidePencil, LucideX],
  selector: 'app-wedding-heading',
  standalone: true,
  styleUrl: './wedding-heading.component.scss',
  templateUrl: './wedding-heading.component.html',
})
export class WeddingHeadingComponent {
  readonly exportRequested = output<void>();

  protected readonly weddingVenue = signal('One Farrer Hotel');
  protected readonly draftWeddingVenue = signal('One Farrer Hotel');
  protected readonly hotelNames = signal<string[]>([]);
  protected readonly editingVenue = signal(false);
  protected readonly loadingHotels = signal(false);
  protected readonly weddingDate = signal('2026-11-28');
  protected readonly draftWeddingDate = signal('2026-11-28');
  protected readonly editingDate = signal(false);
  protected readonly minimumDate = this.toDateInputValue(new Date());

  constructor() {
    void this.loadHotels();
  }

  protected formattedWeddingDate(): string {
    const [year, month, day] = this.weddingDate().split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(year, month - 1, day));
  }

  protected beginDateEdit(): void {
    this.draftWeddingDate.set(this.weddingDate());
    this.editingDate.set(true);
  }

  protected cancelDateEdit(): void {
    this.draftWeddingDate.set(this.weddingDate());
    this.editingDate.set(false);
  }

  protected saveDateEdit(): void {
    if (this.draftWeddingDate() < this.minimumDate) return;
    this.weddingDate.set(this.draftWeddingDate());
    this.editingDate.set(false);
  }

  protected beginVenueEdit(): void {
    this.draftWeddingVenue.set(this.weddingVenue());
    this.editingVenue.set(true);
  }

  protected cancelVenueEdit(): void {
    this.draftWeddingVenue.set(this.weddingVenue());
    this.editingVenue.set(false);
  }

  protected saveVenueEdit(): void {
    const venue = this.draftWeddingVenue().trim();
    if (!venue) return;
    this.weddingVenue.set(venue);
    this.editingVenue.set(false);
  }

  private async loadHotels(): Promise<void> {
    this.loadingHotels.set(true);
    try {
      const response = await fetch('/assets/data/hotels.geojson');
      if (!response.ok) throw new Error(`Hotel data request failed: ${response.status}`);
      const data = await response.json() as {
        features?: Array<{ properties?: { NAME?: unknown } }>;
      };
      const names = [...new Set((data.features ?? [])
        .map(feature => feature.properties?.NAME)
        .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
        .map(name => name.trim()))];
      names.sort((first, second) => first.localeCompare(second));
      this.hotelNames.set(names);
    } catch {
      this.hotelNames.set([]);
    } finally {
      this.loadingHotels.set(false);
    }
  }

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
