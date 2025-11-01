import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConferencesService } from '../../services/conferences.service';
import type { Conference } from '../../models/conference';

@Component({
  selector: 'app-conferences-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conferences.page.html'
})
export class ConferencesPage implements OnInit {
  constructor(public svc: ConferencesService) {}

  ngOnInit() {
    this.load();
  }

  readonly editing = signal<Conference | null>(null);
  readonly form = signal<Partial<Conference>>({
    title: '',
    type: 'ACADEMIC',
    date: new Date().toISOString().substring(0, 10),
    duration: 1,
    registered: 0,
    score: 0,
  });

  load(page?: number) {
    this.svc.list(page ?? this.svc.currentPage(), this.svc.pageSize());
  }

  startCreate() {
    this.editing.set(null);
    this.form.set({ title: '', type: 'ACADEMIC', date: new Date().toISOString().substring(0, 10), duration: 1, registered: 0, score: 0 });
  }

  startEdit(item: Conference) {
    this.editing.set(item);
    const dateStr = item.date?.substring(0, 10);
    this.form.set({ title: item.title, type: item.type, date: dateStr, duration: item.duration, registered: item.registered, score: item.score });
  }

  async save() {
    const current = this.editing();
    const f = this.form();
    if (!f.title || !f.type || !f.date) return;
    const toSend: Omit<Conference, 'id'> = {
      title: f.title!,
      type: f.type as string,
      date: new Date(f.date as string).toISOString(),
      duration: Number(f.duration ?? 0),
      registered: Number(f.registered ?? 0),
      score: Number(f.score ?? 0),
    };
    if (current && current.id) {
      await this.svc.update(current.id, toSend);
    } else {
      await this.svc.create(toSend);
    }
    await this.svc.list(this.svc.currentPage(), this.svc.pageSize());
    this.startCreate();
  }

  async remove(item: Conference) {
    if (!item.id) return;
    if (!confirm('Delete this conference?')) return;
    await this.svc.remove(item.id);
    await this.svc.list(this.svc.currentPage(), this.svc.pageSize());
  }

  pages = computed(() => Array.from({ length: this.svc.totalPages() }, (_, i) => i));
}
