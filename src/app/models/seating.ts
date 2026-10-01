export interface Guest {
  id: number;
  name: string;
  party: string;
  meal: string;
  status: 'Confirmed' | 'Pending';
  tableId: number | null;
  initials: string;
  color: string;
}

export interface SeatTable {
  id: number;
  name: string;
  capacity: number;
  shape: 'round' | 'long';
  accent: string;
  position: { x: number; y: number };
}

export type GuestFilter = 'Everyone' | 'Unseated' | 'Confirmed';