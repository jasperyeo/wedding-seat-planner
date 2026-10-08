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

  it('should only save wedding dates that are today or later', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('[aria-label="Edit wedding date"]')!.click();
    fixture.detectChanges();

    const dateInput = compiled.querySelector<HTMLInputElement>('#wedding-date')!;
    expect(dateInput.min).toBeTruthy();
    const saveButton = [...compiled.querySelectorAll<HTMLButtonElement>('.wedding-date-action.save')][0];

    const pastDate = new Date(`${dateInput.min}T12:00:00`);
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateValue = new Date(pastDate.getTime() - pastDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.value = pastDateValue;
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(saveButton.disabled).toBe(true);

    dateInput.value = dateInput.min;
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(saveButton.disabled).toBe(false);
    saveButton.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.wedding-date-control')?.textContent).toContain(
      new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${dateInput.min}T12:00:00`)),
    );
  });

  it('should add a guest from the guest list dialog', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('[aria-label="Add guest"]')!.click();
    fixture.detectChanges();

    const dialog = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(item => item.textContent?.includes('Add a guest'))!;
    const nameInput = dialog.querySelector<HTMLInputElement>('input')!;
    nameInput.value = 'Taylor Morgan';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    dialog.querySelector<HTMLButtonElement>('.dialog-submit')!.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.guest-row').length).toBe(34);
    expect(compiled.querySelector('.guest-list')?.textContent).toContain('Taylor Morgan');
  });

  it('should add a table from the reception chart dialog', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('[title="Add table"]')!.click();
    fixture.detectChanges();

    const dialog = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(item => item.textContent?.includes('Add a reception table'))!;
    const inputs = dialog.querySelectorAll<HTMLInputElement>('input');
    inputs[0].value = 'Family table';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = '6';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    dialog.querySelector<HTMLButtonElement>('.dialog-submit')!.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.table-node').length).toBe(7);
    expect(compiled.textContent).toContain('Family table');
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

  it('should return to guest information when guest deletion is cancelled', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('[aria-label="View Olivia Bennett information"]')!.click();
    fixture.detectChanges();

    const infoDialog = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Guest information'))!;
    infoDialog.querySelector<HTMLButtonElement>('.dialog-danger')!.click();
    fixture.detectChanges();

    const confirmation = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Delete guest?'))!;
    confirmation.querySelector<HTMLButtonElement>('.dialog-cancel')!.click();
    fixture.detectChanges();

    expect(infoDialog.textContent).toContain('Olivia Bennett');
    expect(infoDialog.querySelector<HTMLButtonElement>('.dialog-cancel')?.textContent).toContain('Close');
    expect([...document.body.querySelectorAll<HTMLElement>('.p-dialog')].some(dialog => dialog.textContent?.includes('Delete guest?'))).toBe(false);
  });

  it('should confirm table deletion and unseat its guests', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('.table-node')!.click();
    fixture.detectChanges();

    const infoDialog = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Table information'))!;
    expect(infoDialog.textContent).toContain('Olivia Bennett');
    infoDialog.querySelector<HTMLButtonElement>('.dialog-danger')!.click();
    fixture.detectChanges();

    const confirmation = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Delete table?'))!;
    expect(confirmation.textContent).toContain('unseat everyone assigned');
    confirmation.querySelector<HTMLButtonElement>('.dialog-danger')!.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.table-node').length).toBe(5);
    const oliviaRow = [...compiled.querySelectorAll<HTMLElement>('.guest-row')].find(row => row.textContent?.includes('Olivia Bennett'))!;
    expect(oliviaRow.querySelector('.guest-table')?.textContent?.trim()).toBe('—');
  });

  it('should return to table information when table deletion is cancelled', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('.table-node')!.click();
    fixture.detectChanges();

    const infoDialog = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Table information'))!;
    infoDialog.querySelector<HTMLButtonElement>('.dialog-danger')!.click();
    fixture.detectChanges();

    const confirmation = [...document.body.querySelectorAll<HTMLElement>('.p-dialog')].find(dialog => dialog.textContent?.includes('Delete table?'))!;
    confirmation.querySelector<HTMLButtonElement>('.dialog-cancel')!.click();
    fixture.detectChanges();

    expect(infoDialog.querySelector('h3')?.textContent).toContain('Table 1');
    expect(infoDialog.querySelector<HTMLButtonElement>('.dialog-cancel')?.textContent).toContain('Close');
    expect([...document.body.querySelectorAll<HTMLElement>('.p-dialog')].some(dialog => dialog.textContent?.includes('Delete table?'))).toBe(false);
  });
});
