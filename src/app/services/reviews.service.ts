import {inject, Injectable, signal} from '@angular/core';
import {GATEWAY_BASE_URL} from './api-base';
import type {Review} from '../models/review';
import type {PagedResponse} from '../models/paged-response';
import {lastValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ReviewsService {
  private readonly base = `${GATEWAY_BASE_URL}/conference-service/api/reviews`;
  private readonly http = inject(HttpClient);


  readonly items = signal<Review[]>([]);
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
      const res = await lastValueFrom(this.http.get<PagedResponse<Review>>(`${this.base}?page=${page}&size=${size}`));

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
    return lastValueFrom(this.http.get<Review>(`${this.base}/${id}`));
  }

  create(item: Omit<Review, 'id'>) {
    return lastValueFrom(this.http.post<Review>(this.base, item));

  }

  update(id: string, item: Omit<Review, 'id'>) {
    return lastValueFrom(this.http.put<Review>(`${this.base}/${id}`, item));

  }

  remove(id: string) {
    return lastValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }
}
