import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeynotesService } from '../../services/keynotes.service';
import type { Keynote } from '../../models/keynote';

@Component({
  selector: 'app-keynotes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './keynotes.page.html'
})
export class KeynotesPage implements OnInit {
  constructor(public svc: KeynotesService) {}

  ngOnInit() {
    this.load();
  }

  readonly editing = signal<Keynote | null>(null);
  readonly form = signal<Partial<Keynote>>({ firstName: '', lastName: '', email: '', functionality: '' });

  load(page?: number) {
    this.svc.list(page ?? this.svc.currentPage(), this.svc.pageSize());
  }

  startCreate() {
    this.editing.set(null);
    this.form.set({ firstName: '', lastName: '', email: '', functionality: '' });
  }

  startEdit(item: Keynote) {
    this.editing.set(item);
    this.form.set({ firstName: item.firstName, lastName: item.lastName, email: item.email, functionality: item.functionality });
  }

  async save() {
    const current = this.editing();
    const data = this.form() as Omit<Keynote, 'id'>;
    if (!data.firstName || !data.lastName || !data.email) return;
    if (current && current.id) {
      await this.svc.update(current.id, data);
    } else {
      await this.svc.create(data);
    }
    await this.svc.list(this.svc.currentPage(), this.svc.pageSize());
    this.startCreate();
  }

  async remove(item: Keynote) {
    if (!item.id) return;
    if (!confirm('Delete this keynote?')) return;
    await this.svc.remove(item.id);
    await this.svc.list(this.svc.currentPage(), this.svc.pageSize());
  }

  pages = computed(() => Array.from({ length: this.svc.totalPages() }, (_, i) => i));
}
