import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-status-banner',
  imports: [],
  templateUrl: './status-banner.html',
  styleUrls: ['./status-banner.css'],
})
export class StatusBannerComponent {
  message = signal<string | null>(null);

  show(message: string, duration: number = 3000) {
    this.message.set(message);
    setTimeout(() => {
      this.message.set(null);
    }, duration);
  }
}
