import { Injectable } from '@angular/core';
import { delay, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { Task } from './task.model';

// Mock Data
const USERS: Array<User> = [
  { id: 1, name: 'Mike', email: 'mike@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
];

export const TASKS: Array<Task> = [
  { id: 101, userId: 1, title: 'Buy milk' },
  { id: 102, userId: 1, title: 'Walk the dog' },
  { id: 103, userId: 2, title: 'Prepare presentation' },
];

const ACTIVITIES = [
  'User logged in',
  'Viewed dashboard',
  'Updated profile',
  'Added item to cart',
  'Checked out',
];

@Injectable({ providedIn: 'root' })
export class MockApiService {
  getUser(id: number) {
    console.log(`[API] Fetching user ${id}...`);
    const user = USERS.find((u) => u.id === id);
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        if (user) {
          resolve(user);
        } else {
          reject('User not found');
        }
      }, 500);
    });
  }

  readonly activityStream$ = timer(0, 2500).pipe(
    map((i) => `[LOG] ${ACTIVITIES[i % ACTIVITIES.length]}`),
  );
}