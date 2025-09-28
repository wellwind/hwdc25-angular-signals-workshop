import { Component, signal, inject, resource } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { MockApiService } from './mock-api.service';
import { of } from 'rxjs';
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

  // TODO: Lab 6 - Part A: Use resource() to fetch user data based on userId.
  readonly user = resource({
    params: () => ({ userId: 0 }),
    loader: (params) => Promise.resolve({ id: 0, name: '', email: '' }),
  });

  // TODO: Lab 6 - Part B: Use rxResource() to connect to the activityStream$.
  readonly activityLog = rxResource({
    stream: () => of(''),
  });

  // TODO: Lab 6 - Part C: Use httpResource() to fetch user tasks via HttpClient.
  readonly tasks = httpResource<Array<Task>>(() => ``);

  setUser(id: number) {
    this.userId.set(id);
  }
}