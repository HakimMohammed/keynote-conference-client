import { Injectable, signal } from '@angular/core';
import { GATEWAY_BASE_URL, httpJson } from './api-base';
import type { Conference } from '../models/conference';
import type { PagedResponse } from '../models/paged-response';

@Injectable({ providedIn: 'root' })
export class ConferencesService {
  private readonly base = `${GATEWAY_BASE_URL}/conference-service/conferences`;

  readonly items = signal<Conference[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalItems = signal(0);
  readonly pageSize = signal(5);

  async list(page = 0, size = this.pageSize()) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await httpJson<PagedResponse<Conference>>(
        `${this.base}?page=${page}&size=${size}`
      );
      this.items.set(res.content);
      this.currentPage.set(res.currentPage);
      this.totalPages.set(res.totalPages);
      this.totalItems.set(res.totalItems);
    } catch (e: any) {
      this.error.set(e.message || String(e));
    } finally {
      this.loading.set(false);
    }
  }

  getById(id: string) {
    return httpJson<Conference>(`${this.base}/${id}`);
  }

  create(item: Omit<Conference, 'id'>) {
    return httpJson<Conference>(this.base, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  update(id: string, item: Omit<Conference, 'id'>) {
    return httpJson<Conference>(`${this.base}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  remove(id: string) {
    return httpJson<void>(`${this.base}/${id}`, { method: 'DELETE' });
  }
}
