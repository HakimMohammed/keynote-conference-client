export interface Conference {
  id?: string;
  title: string;
  type: string; // Enum on backend, send as string
  date: string; // ISO string for simplicity
  duration: number;
  registered: number;
  score: number;
}
