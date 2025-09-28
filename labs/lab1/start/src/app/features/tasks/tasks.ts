import { Component, signal, computed, untracked } from '@angular/core';

// 1. Task 型別包含 assignee
type Task = { id: number; title: string; done: boolean; assignee: string };

const STORAGE_KEY = 'hwdc25.angular-signals.workshop.tasks';

const loadTasks = (): Array<Task> => {
  const defaultTasks: Array<Task> = [
    { id: 1, title: '實作 Signal Store', done: false, assignee: 'Alice' },
    { id: 2, title: '閱讀 20 頁', done: true, assignee: 'Bob' },
  ];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultTasks;
    }
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data as Array<Task>;
    }
    return defaultTasks;
  } catch {
    return defaultTasks;
  }
};

const saveTasks = (tasks: Array<Task>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  readonly tasks = signal<Array<Task>>(loadTasks());

  readonly newTitle = signal('');
  readonly newAssignee = signal('Alice');

  readonly total = computed(() => this.tasks().length);

  // TODO: [Lab 1] 當 tasks 變更時，自動完成 doneCount、completionRate 的計算
  // readonly doneCount = ...
  // readonly completionRate = ...

  constructor() {
    // TODO: [Lab 1] 實作 effect，當 tasks 變更時，呼叫 saveTasks() 存檔，之後印出 newAssignee 的值
      
    // console.log(`任務列表已變更並存檔。下次新增任務的預設指派人是: ${this.newAssignee()}`);
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
    const id = Math.max(0, ...this.tasks().map((t) => t.id)) + 1;
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
}