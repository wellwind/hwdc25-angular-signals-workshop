## Lab 3: 新世代 Component API

在 Angular v17.1+ 中，我們迎來了以 Signal 為基礎的新一代元件 API。它們讓元件間的溝通變得更簡單、更直觀。

---

### `input()` - 接收資料

`input()` 用來定義一個元件的輸入屬性，它會將傳入的資料轉換成一個**唯讀的 Signal**。

- **`input()`**: 可選的 input。
- **`input.required()`**: 必要的 input，沒傳會報錯。

```typescript
// 子元件: checkout-summary.ts
import { Component, input } from '@angular/core';

@Component({...})
export class CheckoutSummaryComponent {
  // 將傳入的 finalPrice 變成一個 readonly Signal<number>
  finalPrice = input.required<number>();
}
```

```html
<!-- 父元件: cart.html -->
<app-checkout-summary [finalPrice]="parentFinalPrice()"></app-checkout-summary>
```

---

### `output()` - 發送通知

`output()` 用來定義一個事件發射器，讓子元件可以通知父元件發生了某件事。

```typescript
// 子元件: checkout-summary.ts
import { Component, output } from '@angular/core';

@Component({...})
export class CheckoutSummaryComponent {
  reset = output<void>(); // 定義一個名為 reset 的事件

  onResetClick() {
    this.reset.emit(); // 發射事件
  }
}
```

```html
<!-- 父元件: cart.html -->
<!-- 使用 () 語法監聽 reset 事件 -->
<app-checkout-summary (reset)="onParentReset()"></app-checkout-summary>
```

---

### `model()` - 雙向綁定

`model()` 用來定義一個可雙向綁定的屬性，它會建立一個**可寫入的 Signal**。

- **`model()`**: 可選的 model。
- **`model.required()`**: 必要的 model。

```typescript
// 子元件: checkout-summary.ts
import { Component, model } from '@angular/core';

@Component({...})
export class CheckoutSummaryComponent {
  // 建立一個 WritableSignal<string>
  discountCode = model.required<string>();
}
```

```html
<!-- 父元件: cart.html -->
<!-- 使用 [()] 語法糖進行雙向綁定 -->
<app-checkout-summary [(discountCode)]="parentDiscountCode"></app-checkout-summary>
```

在子元件內部，你可以像一般的 signal 一樣讀取 (`discountCode()`) 和寫入 (`discountCode.set('NEW')`)。
