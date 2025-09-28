import { Component, computed, effect, signal, viewChildren } from '@angular/core';
import { Task } from './tasks.model';
import { TaskItemComponent } from './components/task-item/task-item';

const STORAGE_KEY = 'hwdc25.angular-signals.workshop.tasks';

// Dummy data and functions for demonstration
let tasks: Array<Task> = [
  { id: 1, title: 'Lab 1: Signals Core', done: true, assignee: 'Mike' },
  { id: 2, title: 'Lab 2: linkedSignal', done: true, assignee: 'John' },
  { id: 3, title: 'Lab 3: Component API', done: false, assignee: 'Jane' },
  { id: 4, title: 'Lab 4: viewChild', done: false, assignee: 'Mike' },
];
const saveTasks = (tasks: Array<Task>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

@Component({
  selector: 'app-tasks',
  imports: [TaskItemComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks {
  readonly tasks = signal<Array<Task>>(tasks);

  // TODO: Lab 5 - 1. 使用 viewChildren 取得所有 TaskItemComponent 的參考

  readonly newTitle = signal('');
  readonly newAssignee = signal('Alice');

  readonly total = computed(() => this.tasks().length);
  readonly doneCount = computed(() => this.tasks().filter((task) => task.done).length);
  readonly completionRate = computed(() => {
    const total = this.total();
    return total === 0 ? 0 : Math.round((this.doneCount() / total) * 100);
  });

  constructor() {
    effect(() => {
      const tasks = this.tasks();

      saveTasks(tasks);
      console.log(
        `任務列表已變更並存檔。下次新增任務的預設指派人是: ${untracked(() => this.newAssignee())}`
      );
    });
  }

  updateNewTitle(title: string) {
    this.newTitle.set(title);
  }

  updateNewAssignee(assignee: string) {
    this.newAssignee.set(assignee);
  }

  addTask() {
    const title = this.newTitle().trim();
    const assignee = this.newAssignee().trim();
    if (!title || !assignee) {
      return;
    }
    const id = Math.max(0, ...this.tasks().map((task) => task.id)) + 1;
    this.tasks.update((list) => [...list, { id, title, done: false, assignee }]);
    this.newTitle.set('');
  }

  toggleTask(id: number) {
    this.tasks.update((list) =>
      list.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  }

  removeTask(id: number) {
    this.tasks.set(this.tasks().filter((task) => task.id !== id));
  }

  celebrate() {
    // TODO: Lab 5 - 2. 遍歷所有 taskItems，如果任務已完成，就呼叫 playSuccessAnimation()
  }
}
