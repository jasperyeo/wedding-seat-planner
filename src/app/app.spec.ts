import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.removeItem('gather-seating-plan-v1');
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the seating planner and guest summary', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Olivia');
    expect(compiled.querySelector('.guest-list')?.textContent).toContain('Olivia Bennett');
    expect(compiled.querySelectorAll('.table-node').length).toBe(6);
  });

  it('should assign an unseated guest to a table', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.guest-row').length).toBe(33);
    expect(compiled.querySelectorAll('.drag-handle').length).toBe(33);
    const unseatedTab = [...compiled.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find(tab => tab.textContent?.includes('Unseated'))!;
    unseatedTab.click();
    fixture.detectChanges();

    compiled.querySelector<HTMLElement>('.guest-row')!.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.table-target')).toBeNull();

    compiled.querySelector<HTMLButtonElement>('.allocate-action')!.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('.table-target')!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const everyoneTab = [...compiled.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find(tab => tab.textContent?.includes('Everyone'))!;
    everyoneTab.click();
    fixture.detectChanges();
    const assignedGuest = [...compiled.querySelectorAll('.guest-row')].find(row => row.textContent?.includes('Avery James'));
    expect(assignedGuest?.querySelector('.guest-table')?.textContent?.trim()).toMatch(/^T\d+$/);
  });

  it('should confirm guest deletion from the information dialog', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('[aria-label="View Olivia Bennett information"]')!.click();
    fixture.detectChanges();

    const infoDialog = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Guest information'))!;
    expect(infoDialog.textContent).toContain('Olivia Bennett');
    infoDialog.querySelector<HTMLButtonElement>('.dialog-danger')!.click();
    fixture.detectChanges();

    const confirmation = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Delete guest?'))!;
    expect(confirmation.textContent).toContain('cannot be undone');
    expect(compiled.querySelectorAll('.guest-row').length).toBe(33);
    confirmation.querySelector<HTMLButtonElement>('.dialog-danger')!.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.guest-row').length).toBe(32);
    expect(compiled.textContent).not.toContain('Olivia Bennett');
  });
});
