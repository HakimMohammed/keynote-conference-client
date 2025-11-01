export interface Review {
  id?: string;
  date: string; // ISO date string
  text: string;
  score: number;
  conference?: { id: string } | null; // minimal link
}
