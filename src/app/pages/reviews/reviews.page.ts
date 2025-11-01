import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../services/reviews.service';
import type { Review } from '../../models/review';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.page.html'
})
export class ReviewsPage implements OnInit {
  constructor(public svc: ReviewsService) {}

  ngOnInit() {
    this.load();
  }

  readonly editing = signal<Review | null>(null);
  readonly form = signal<Partial<Review & { conferenceId?: string }>>({
    date: new Date().toISOString().substring(0, 10),
    text: '',
    score: 0,
    conferenceId: ''
  });

  load(page?: number) {
    this.svc.list(page ?? this.svc.currentPage(), this.svc.pageSize());
  }

  startCreate() {
    this.editing.set(null);
    this.form.set({ date: new Date().toISOString().substring(0, 10), text: '', score: 0, conferenceId: '' });
  }

  startEdit(item: Review) {
    this.editing.set(item);
    const dateStr = item.date?.substring(0, 10);
    this.form.set({ date: dateStr, text: item.text, score: item.score, conferenceId: item.conference?.id || '' });
  }

  async save() {
    const current = this.editing();
    const f = this.form();
    if (!f.text || f.score == null || !f.date) return;
    const toSend: Omit<Review, 'id'> = {
      date: new Date(f.date as string).toISOString(),
      text: f.text!,
      score: Number(f.score ?? 0),
      conference: f.conferenceId ? { id: f.conferenceId } : null,
    } as any;
    if (current && current.id) {
      await this.svc.update(current.id, toSend);
    } else {
      await this.svc.create(toSend);
    }
    await this.svc.list(this.svc.currentPage(), this.svc.pageSize());
    this.startCreate();
  }

  async remove(item: Review) {
    if (!item.id) return;
    if (!confirm('Delete this review?')) return;
    await this.svc.remove(item.id);
    await this.svc.list(this.svc.currentPage(), this.svc.pageSize());
  }

  pages = computed(() => Array.from({ length: this.svc.totalPages() }, (_, i) => i));
}
