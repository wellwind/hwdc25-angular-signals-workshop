import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TASKS } from './mock-api.service';

export const mockHttpInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api/tasks') && req.method === 'GET') {
    const host = new URL(document.location.href);
    const userId = Number(
      new URL(`${host.protocol}//${host.host}${req.url}`).searchParams.get('userId')
    );
    console.log(`[HTTP Interceptor] Mocking request for tasks of user ${userId}`);
    const tasks = TASKS.filter((t) => t.userId === userId);
    if (tasks.length === 0) {
      return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })).pipe(delay(600));
    }
    return of(new HttpResponse({ status: 200, body: tasks })).pipe(delay(600));
  }
  // Pass through all other requests
  return next(req);
};
