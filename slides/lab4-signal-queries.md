# Lab 4: Signal Queries (viewChild)

---

## 什麼是 Signal Queries？

Angular v17.1 引入了實驗性的 Signal-based Queries，這是一種以 Signal 為基礎的方式來查詢樣板 (Template) 中的元素。

`viewChild` 和 `contentChild` 現在有了 Signal-based 的版本，讓我們可以用更現代、更符合 Signal 思維的方式與子元件或 DOM 元素互動。

---

## `viewChild`

`viewChild` 可以讓我們從父元件的類別中，取得對子元件或樣板中 DOM 元素的參考。

過去我們這樣寫：

```typescript
@ViewChild(ChildComponent) child: ChildComponent;
```

現在，我們可以使用 Signal-based 的 `viewChild`：

```typescript
import { Component, viewChild } from '@angular/core';

// ...

export class ParentComponent {
  child = viewChild.required(ChildComponent);
}
```

- `viewChild(ChildComponent)` 會回傳一個 `Signal<ChildComponent | undefined>`。
- `viewChild.required(ChildComponent)` 會回傳一個 `Signal<ChildComponent>`，如果找不到子元件，會在執行期間拋出錯誤。

回傳的是一個 Signal，所以要取得子元件實例時，記得要用 `()` 呼叫它，例如 `this.child()`。

---

## 本次練習：快閃通知

我們將實作一個常見的功能：在父元件中觸發一個動作，然後呼叫子元件的方法來顯示一個 Flash notification。

1. 在 `TasksComponent` 中，使用 `viewChild.required` 取得 `StatusBannerComponent` 的參考。
2. 在 `showBanner` 方法中，呼叫子元件的 `show()` 方法。
3. 在樣板中，將按鈕的 `click` 事件綁定到 `showBanner` 方法。

---

## 程式碼參考 (Solution)

**`tasks.ts`**

```typescript
export class Tasks {
  statusBanner = viewChild.required(StatusBannerComponent);

  showBanner() {
    this.statusBanner().show('操作成功！');
  }
}
```

**`tasks.html`**

```html
<button class="btn btn-accent join-item" (click)="showBanner()">顯示通知</button>
```

---

## 完成！

現在，你已經學會如何使用 `viewChild` 來從父元件呼叫子元件的方法了！

如果你曾經用過 `@ViewChildren`、 `@ContentChild` 或 `@ContentChildren`，在 Angular Signal Query 後，你可以使用 `viewChildren`、 `contentChild` 和 `contentChildren` 的 Signal 版本，來達成相同的目的。同時原來的 QueryList 將不再需要。
