import { Component, input, output, signal } from '@angular/core';
import { Task } from '../../tasks.model';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.css']
})
export class TaskItemComponent {
  task = input.required<Task>();
  toggle = output<number>();
  delete = output<number>();

  isAnimating = signal(false);

  playSuccessAnimation() {
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 700); // Animation duration should match css
  }
}
