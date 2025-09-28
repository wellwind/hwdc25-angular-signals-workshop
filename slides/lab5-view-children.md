# Lab 5: Signal Queries (viewChildren)

---

## `viewChildren`

與 `viewChild` 對應，`viewChildren` 可以讓我們一次取得**多個**子元件或 DOM 元素的參考。

Signal-based `viewChildren` 會回傳一個 `Signal<readonly Array<YourComponent>>`，這是一個唯讀的元件實例陣列 Signal。

```typescript
import { Component, viewChildren } from '@angular/core';

// ...

export class ParentComponent {
  children = viewChildren(ChildComponent);
  // children is Signal<readonly Array<ChildComponent>>
}
```

當樣板中的 `ChildComponent` 數量發生變化時，這個 Signal 會自動更新。

---

## 本次練習：批次操作

我們將在任務列表頁面，實作一個「批次操作」功能：點擊按鈕，讓所有已完成的任務卡片都播放一個慶祝動畫。

1.  **重構**：首先，我們已經將單一任務重構成 `TaskItemComponent`。
2.  在 `TasksComponent` 中，使用 `viewChildren` 取得所有 `TaskItemComponent` 的參考。
3.  在 `celebrate` 方法中，遍歷 `viewChildren` 取得的陣列，並呼叫子元件的 `playSuccessAnimation()` 方法。
4.  在樣板中，加入「慶祝完成！」按鈕並綁定 `celebrate` 方法。

---

## 程式碼參考 (Solution)

**`tasks.ts`**

```typescript
export class Tasks {
  taskItems = viewChildren(TaskItemComponent);

  celebrate() {
    this.taskItems().forEach(item => {
      if (item.task().done) {
        item.playSuccessAnimation();
      }
    });
  }
}
```

**`tasks.html`**

```html
<button class="btn btn-success" (click)="celebrate()">慶祝完成！</button>
```

---

## 完成！

現在，你已經學會如何使用 `viewChildren` 來對多個子元件進行批次操作了！
