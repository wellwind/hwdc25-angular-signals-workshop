import { Component, signal, inject, resource } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { MockApiService } from './mock-api.service';
import { Task } from './task.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics {
  private readonly mockApi = inject(MockApiService);

  readonly userId = signal(1);

  // Part A: resource
  readonly user = resource({
    params: () => ({ userId: this.userId() }),
    loader: (params) => this.mockApi.getUser(params.params.userId),
  });

  // Part B: rxResource
  readonly activityLog = rxResource({
    stream: () => this.mockApi.activityStream$,
  });

  // Part C: httpResource
  readonly tasks = httpResource<Array<Task>>(() => `/api/tasks?userId=${this.userId()}`, {
    defaultValue: [],
  });

  setUser(id: number) {
    this.userId.set(id);
  }
}
