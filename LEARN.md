# Angular Signals Workshop - 學習指南

歡迎來到 Angular Signals 工作坊！本指南將引導您完成一系列的實作練習 (Lab)，從 Signals 的核心概念，到進階的應用模式。

---

## Lab 1: Signals 核心 (`signal`, `computed`, `effect`)

**目標：** 在本節中，您將學會 Angular Signals 最核心的三個 API。我們將在一個「任務列表」元件中：

1. 使用 `signal` 來儲存狀態。
2. 使用 `computed` 來計算衍生狀態（例如完成率）。
3. 使用 `effect` 來執行副作用（例如將資料存到 LocalStorage）。
4. 使用 `untracked` 來避免不必要的 `effect` 觸發。

### 1-1. 起始步驟

請在 `workshop` 目錄下執行以下指令，來載入 Lab 1 的起始專案：

```bash
npm run lab:use -- lab1-start
```

接著啟動開發伺服器，並前往「任務」頁面：

```bash
npm run dev
```

您會看到一個基本的任務列表，但統計和儲存功能尚未完成。

### 1-2. 任務 A: 完成統計 (`computed`)

目前畫面上只顯示了任務總數，我們需要計算並顯示已完成的數量和完成率。

- **檔案**: `workshop/app/src/app/features/tasks/tasks.ts`
- **任務**:
  1. 找到被註解掉的 `doneCount` 和 `completionRate`。
  2. 取消註解，並使用 `computed()` 來完成計算邏輯。
      - `doneCount`: 計算 `tasks()` 陣列中，`done` 屬性為 `true` 的項目數量。
      - `completionRate`: 根據 `doneCount()` 和 `total()` 計算完成率的百分比 (0-100)，並四捨五入到整數。

```typescript
// tasks.ts

// TODO: [Lab 1] 完成 doneCount、completionRate 的計算
readonly doneCount = computed(() => this.tasks().filter(t => t.done).length);
readonly completionRate = computed(() => {
  if (this.total() === 0) return 0;
  return Math.round((this.doneCount() / this.total()) * 100);
});
```

- **檔案**: `workshop/app/src/app/features/tasks/tasks.html`
- **任務**: 找到被註解的 HTML 區塊 `<!-- TODO: ... -->`，並將其取消註解，以在畫面上顯示 `doneCount()` 和 `completionRate()` 的值。

### 1-3. 任務 B: 持久化 (`effect`)

我們希望任務列表在重新整理後依然存在。這需要我們在任務列表變動時，自動將其寫入 LocalStorage。

- **檔案**: `workshop/app/src/app/features/tasks/tasks.ts`
- **任務**:
  1. 在 `constructor()` 中，找到 `TODO` 註解。
  2. 在此處建立一個 `effect()`。
  3. 在 `effect` 的回呼函式中，讀取 `this.tasks()` 的值，並將其傳入 `saveTasks()` 函式中。

```typescript
// tasks.ts constructor

constructor() {
  // TODO: [Lab 1] 實作 effect
  effect(() => {
    const tasks = this.tasks();
    saveTasks(tasks);
    // ...
  });
}
```

### 1-4. 任務 C: 避免不必要依賴 (`untracked`)

我們的 `effect` 除了存檔外，還想印出一個日誌，內容包含「下次要新增任務時的預設指派人」。但我們不希望在使用者只是修改「預設指派人」時，也觸發存檔 `effect`。

- **檔案**: `workshop/app/src/app/features/tasks/tasks.ts`
- **任務**:
  1. 在剛剛建立的 `effect` 中，`saveTasks()` 之後。
  2. 使用 `untracked()` 來讀取 `this.newAssignee` 的值。
  3. 將讀取到的值，透過 `console.log` 印出。

```typescript
// tasks.ts effect

effect(() => {
  const tasks = this.tasks();
  saveTasks(tasks);

  // 使用 untracked 讀取 newAssignee 的值
  const currentNewAssignee = untracked(this.newAssignee);
  console.log(`任務列表已變更並存檔。下次新增任務的預設指派人是: ${currentNewAssignee}`);
});
```

### 1-5. 驗收清單

- [ ] 完成率和已完成數量會隨著任務勾選狀態即時更新。
- [ ] 新增或刪除任務後，統計數字會更新。
- [ ] 重新整理頁面後，任務列表的狀態會被保留。
- [ ] 在「指派人」輸入框打字時，瀏覽器 Console 不會重複印出存檔日誌。
- [ ] 只有在新增/刪除/勾選任務時，Console 才會印出存檔日誌。

---

## Lab 2: 雙向狀態與 `linkedSignal`

**目標：** 在本節中，您將學習如何處理一種特殊的狀態：它有預設的衍生邏輯，但同時也需要能被使用者手動修改。我們將在一個新的「購物車」頁面中，使用 `linkedSignal` 來實作「智慧折扣碼」功能。

### 2-1. 起始步驟

請在 `workshop` 目錄下執行以下指令，來載入 Lab 2 的起始專案：

```bash
npm run lab:use -- lab2-start
```

接著啟動/重新整理頁面，並前往「購物車」頁面。

您會看到一個基本的購物車介面。目前「折扣碼」欄位是一個唯讀的 `computed`，我們的目標是將它變成可雙向互動的 `linkedSignal`。

### 2-2. 任務 A: 從 `computed` 到 `linkedSignal`

目前的 `discountCode` 是唯讀的，導致我們無法手動輸入。

- **檔案**: `workshop/app/src/app/features/cart/cart.ts`
- **任務**:
  1. 從 `@angular/core` 引入 `linkedSignal` 和 `WritableSignal`。
  2. 找到 `discountCode` 的定義。
  3. 將 `computed(...)` 改為 `linkedSignal(...)`。
  4. 同時，將 `discountCode` 的型別從 `Signal<string>` 改為 `WritableSignal<string>`。

```typescript
// cart.ts

// 將
// readonly discountCode = computed(() => { ... });

// 改為
readonly discountCode: WritableSignal<string> = linkedSignal(() => {
  const level = this.userLevel();
  if (level === 'platinum') {
    return 'PLATINUM20';
  }
  if (level === 'gold') {
    return 'GOLD10';
  }
  return 'WELCOME5';
});
```

### 2-3. 任務 B: 允許手動覆寫

`linkedSignal` 讓 `discountCode` 變成了可寫入的，現在我們要讓輸入框的修改能寫回 signal 中。

- **檔案**: `workshop/app/src/app/features/cart/cart.ts`
- **任務**:
  1. 找到 `onCodeInput` 方法。
  2. 取消 `this.discountCode.set(code);` 這一行的註解。

```typescript
// cart.ts

onCodeInput(code: string) {
  // TODO: [Lab 2] 手動設定 discountCode 的值
  this.discountCode.set(code);
}
```

### 2-4. 驗收清單

- [ ] 切換「會員等級」時，「折扣碼」輸入框的值會自動變更 (WELCOME5, GOLD10, PLATINUM20)。
- [ ] 可以手動在「折扣碼」輸入框中輸入 `HELLOWORLD`，此時「最終價格」會正確地減 3 元。
- [ ] 在手動輸入 `HELLOWORLD` 之後，再次點擊切換「會員等級」按鈕，此時輸入框中的 `HELLOWORLD` 會被系統推薦的新折扣碼**覆寫**掉。

---

## Lab 3: 元件 API (`input`, `output`, `model`)

**目標：** 在本節中，您將學習如何將一個巨大的元件，重構成結構清晰的「父子元件」，並使用新一代的 Component API (`input`, `output`, `model`) 來進行元件間的通訊。

### 3-1. 起始步驟

請在 `workshop` 目錄下執行以下指令，來載入 Lab 3 的起始專案：

```bash
npm run lab:use -- lab3-start
```

接著啟動/重新整理頁面，並前往「購物車」頁面。

您會看到 Lab 2 完成的「智慧折扣碼」功能。但目前所有的 UI 和邏輯都寫在同一個 `Cart` 元件中，我們的目標是將其重構。

### 3-2. 任務 A: 重構為子元件並使用 `input`

`checkout-summary` 元件已經為您建立好了，現在我們需要將 `cart` 元件中的相關邏輯和樣板搬移過去。

1.  **移動樣板**：
    - **檔案**: `workshop/app/src/app/features/cart/cart.html`
    - **任務**: 將 `<!-- Right side: Result -->` 區塊中，`<div class="card bg-base-200">...</div>` 的整段 HTML **剪下**。
    - **檔案**: `workshop/app/src/app/features/cart/components/checkout-summary/checkout-summary.html`
    - **任務**: 將剛剛剪下的 HTML **貼上**，覆蓋掉原本的 `<p>... works!</p>`。

2.  **傳入資料 (`input`)**：
    - **檔案**: `.../checkout-summary/checkout-summary.ts`
    - **任務**: 從 `@angular/core` 引入 `input`，並定義一個名為 `finalPrice` 的必要 `input`。

    ```typescript
    import { Component, input } from '@angular/core';

    export class CheckoutSummaryComponent {
      finalPrice = input.required<number>();
    }
    ```

3.  **使用子元件**：
    - **檔案**: `.../cart/cart.ts`
    - **任務**: 匯入 `CheckoutSummaryComponent` 並將其加入 `imports` 陣列。
    - **檔案**: `.../cart/cart.html`
    - **任務**: 在剛剛剪下 HTML 的地方，改用 `<app-checkout-summary>`，並透過 `[finalPrice]="finalPrice()"` 將父元件的 `finalPrice` signal 傳入。

    ```html
    <app-checkout-summary [finalPrice]="finalPrice()"></app-checkout-summary>
    ```

### 3-3. 任務 B: 雙向綁定 (`model`)

我們需要讓子元件也能修改 `discountCode`。

1.  **定義 `model`**:
    - **檔案**: `.../checkout-summary/checkout-summary.ts`
    - **任務**: 從 `@angular/core` 引入 `model`，並定義一個名為 `discountCode` 的必要 `model`。

    ```typescript
    import { Component, input, model } from '@angular/core';

    export class CheckoutSummaryComponent {
      finalPrice = input.required<number>();
      discountCode = model.required<string>();
    }
    ```

2.  **修改子元件樣板**:
    - **檔案**: `.../checkout-summary/checkout-summary.html`
    - **任務**: 找到 `<input>` 元素，將其綁定修改為讀取 `discountCode()` 的值，並在 `input` 事件中呼叫 `discountCode.set()` 來更新它。

    ```html
    <input
      type="text"
      class="input input-bordered w-full"
      [value]="discountCode()"
      (input)="discountCode.set($event.target.value)" />
    ```

3.  **修改父元件**:
    - **檔案**: `.../cart/cart.ts`
    - **任務**: 移除不再需要的 `onCodeInput` 方法。
    - **檔案**: `.../cart/cart.html`
    - **任務**: 在 `<app-checkout-summary>` 上，將綁定改為 `[(discountCode)]="discountCode"`。

    ```html
    <app-checkout-summary
      [finalPrice]="finalPrice()"
      [(discountCode)]="discountCode"
    ></app-checkout-summary>
    ```

### 3-4. 任務 C: 向外通知 (`output`)

最後，我們在子元件新增一個「重設」按鈕，點擊後要能通知父元件。

1.  **定義 `output`**:
    - **檔案**: `.../checkout-summary/checkout-summary.ts`
    - **任務**: 從 `@angular/core` 引入 `output`，定義一個名為 `reset` 的 `output`，並新增一個 `onResetClick` 方法來觸發它。

    ```typescript
    import { Component, input, model, output } from '@angular/core';

    export class CheckoutSummaryComponent {
      // ...
      reset = output<void>();

      onResetClick() {
        this.reset.emit(); // 發射事件
      }
    }
    ```

2.  **新增按鈕**:
    - **檔案**: `.../checkout-summary/checkout-summary.html`
    - **任務**: 在 `<input>` 後方新增一個「重設」按鈕，並綁定 `(click)` 事件呼叫 `onResetClick()`。

3.  **處理事件**:
    - **檔案**: `.../cart/cart.ts`
    - **任務**: 新增 `onDiscountReset()` 方法，在其中呼叫 `this.discountCode.reset()`。
    - **檔案**: `.../cart/cart.html`
    - **任務**: 在 `<app-checkout-summary>` 上，監聽 `(reset)` 事件，並呼叫 `onDiscountReset()`。

### 3-5. 驗收清單

- [ ] 「結帳資訊」區塊由獨立的 `CheckoutSummaryComponent` 渲染。
- [ ] 在子元件的輸入框手動輸入折扣碼，父元件的 `finalPrice` 會同步更新。
- [ ] 切換父元件的「會員等級」時，子元件輸入框的折扣碼會同步更新。
- [ ] 點擊子元件的「重設」按鈕，折扣碼會恢復為系統推薦的預設值。

---

## Lab 4: Signal Queries (`viewChild`)

**目標：** 在本節中，您將學習如何使用 Signal-based Queries 中的 `viewChild`，從父元件取得子元件的參考，並呼叫其內部的方法。

### 4-1. 起始步驟

請在 `workshop` 目錄下執行以下指令，來載入 Lab 4 的起始專案：

```bash
npm run lab:use -- lab4-start
```

接著啟動/重新整理頁面，並前往「任務」頁面。

您會看到一個「顯示通知」的按鈕，但目前點擊它沒有任何反應。`StatusBannerComponent` 已經為您建立好了，您的任務是將父子元件連接起來。

### 4-2. 任務 A: 取得子元件參考 (`viewChild`)

- **檔案**: `workshop/app/src/app/features/tasks/tasks.ts`
- **任務**:
  1. 從 `@angular/core` 引入 `viewChild`。
  2. 在 `Tasks` 類別中，找到 `// TODO: Lab 4 - 1.` 的註解。
  3. 使用 `viewChild.required(StatusBannerComponent)` 來取得 `StatusBannerComponent` 的實例，並將其儲存在名為 `statusBanner` 的屬性中。

```typescript
// tasks.ts
import { Component, viewChild } from '@angular/core';
import { StatusBannerComponent } from './components/status-banner/status-banner';

// ...
export class Tasks {
  // TODO: Lab 4 - 1. 使用 viewChild 取得 StatusBannerComponent 的參考
  statusBanner = viewChild.required(StatusBannerComponent);

  showBanner() {
    // ...
  }
}
```

### 4-3. 任務 B: 呼叫子元件方法

- **檔案**: `workshop/app/src/app/features/tasks/tasks.ts`
- **任務**:
  1. 在 `showBanner` 方法中，找到 `// TODO: Lab 4 - 2.` 的註解。
  2. 呼叫 `statusBanner` signal 的 `show()` 方法，並傳入一則訊息，例如 `'操作成功！'`。

```typescript
// tasks.ts
// ...
export class Tasks {
  statusBanner = viewChild.required(StatusBannerComponent);

  showBanner() {
    // TODO: Lab 4 - 2. 呼叫 statusBanner 的 show 方法
    this.statusBanner().show('操作成功！');
  }
}
```

### 4-4. 任務 C: 綁定事件

- **檔案**: `workshop/app/src/app/features/tasks/tasks.html`
- **任務**:
  1. 找到「顯示通知」按鈕，以及 `<!-- TODO: Lab 4 - 3. -->` 的註解。
  2. 為按鈕加上 `(click)` 事件綁定，使其呼叫 `showBanner()` 方法。

```html
<!-- tasks.html -->
<!-- TODO: Lab 4 - 3. 綁定 click 事件到 showBanner() 方法 -->
<button class="btn btn-accent join-item" (click)="showBanner()">顯示通知</button>
```

### 4-5. 驗收清單

- [ ] 點擊「顯示通知」按鈕後，畫面右下角會出現一個綠色的成功通知橫幅。
- [ ] 通知橫幅會在出現約 3 秒後自動消失。

---

## Lab 5: Signal Queries (`viewChildren`)

**目標：** 在本節中，您將學習如何使用 `viewChildren` 一次取得多個子元件的參考，並對它們進行批次操作。

### 5-1. 起始步驟

請在 `workshop` 目錄下執行以下指令，來載入 Lab 5 的起始專案：

```bash
npm run lab:use -- lab5-start
```

接著啟動/重新整理頁面，並前往「任務」頁面。

您會看到一個經過重構的任務列表，每個任務都是一個獨立的 `TaskItemComponent`。我們的目標是加入一個「慶祝完成！」按鈕，來對所有已完成的任務播放動畫。

### 5-2. 任務 A: 取得多個子元件參考 (`viewChildren`)

- **檔案**: `workshop/app/src/app/features/tasks/tasks.ts`
- **任務**:
  1. 從 `@angular/core` 引入 `viewChildren`。
  2. 在 `Tasks` 類別中，找到 `// TODO: Lab 5 - 1.` 的註解。
  3. 使用 `viewChildren(TaskItemComponent)` 來取得所有 `TaskItemComponent` 的實例，並將其儲存在名為 `taskItems` 的屬性中。

```typescript
// tasks.ts
// ...
export class Tasks {
  tasks = signal<Task[]>(tasks);
  // TODO: Lab 5 - 1. 使用 viewChildren 取得所有 TaskItemComponent 的參考
  taskItems = viewChildren(TaskItemComponent);

  // ...
}
```

### 5-3. 任務 B: 實作批次操作

- **檔案**: `workshop/app/src/app/features/tasks/tasks.ts`
- **任務**:
  1. 在 `celebrate` 方法中，找到 `// TODO: Lab 5 - 2.` 的註解。
  2. 遍歷 `this.taskItems()` 陣列。
  3. 在迴圈中，檢查每個 `item.task().done` 是否為 `true`。
  4. 如果為 `true`，則呼叫該 `item` 的 `playSuccessAnimation()` 方法。

```typescript
// tasks.ts
// ...
export class Tasks {
  // ...
  celebrate() {
    // TODO: Lab 5 - 2. 遍歷所有 taskItems，如果任務已完成，就呼叫 playSuccessAnimation()
    this.taskItems().forEach(item => {
      if (item.task().done) {
        item.playSuccessAnimation();
      }
    });
  }
}
```

### 5-4. 任務 C: 加入觸發按鈕

- **檔案**: `workshop/app/src/app/features/tasks/tasks.html`
- **任務**:
  1. 找到 `<!-- TODO: Lab 5 - 3. -->` 的註解。
  2. 在此處加入一個按鈕，文字為「慶祝完成！」。
  3. 為按鈕加上 `(click)` 事件綁定，使其呼叫 `celebrate()` 方法。

```html
<!-- tasks.html -->
<!-- TODO: Lab 5 - 3. 加入「慶祝完成！」按鈕，並綁定 celebrate() 方法 -->
<button class="btn btn-success" (click)="celebrate()">慶祝完成！</button>
```

### 5-5. 驗收清單

- [ ] 畫面上出現「慶祝完成！」按鈕。
- [ ] 勾選幾個任務使其成為「已完成」狀態。
- [ ] 點擊「慶祝完成！」按鈕後，只有已完成的任務卡片會閃爍綠光動畫。
- [ ] 未完成的任務卡片不會有任何反應。

---

## Lab 6: Resource Family

**目標：** 在本節中，您將學習如何使用 Resource Family (`resource`, `rxResource`, `httpResource`) 來優雅地處理非同步資料的各種狀態。

### 6-1. 起始步驟

請在 `workshop` 目錄下執行以下指令，來載入 Lab 6 的起始專案：

```bash
npm run lab:use -- lab6-start
```

接著啟動/重新整理頁面，並前往「分析」頁面。

您會看到一個儀表板骨架，但所有的資料區塊都是靜態的。您的任務是使用 Resource Family API 來載入真實的（模擬）資料。

### 6-2. 任務 A: `resource` (Promise-based)

我們的第一個任務是根據選擇的使用者 ID，載入使用者的個人資料。`MockApiService` 中的 `getUser()` 方法回傳一個 `Promise`，正好適合使用 `resource()`。

- **檔案**: `workshop/app/src/app/features/analytics/analytics.ts`
- **任務**:
  1. 找到 `// TODO: Lab 6 - Part A` 的註解。
  2. 使用 `resource()` 建立一個名為 `user` 的資源。
  3. `resource` 的 `params` 應該回傳一個包含 `userId` 的物件。
  4. `loader` 函式應該接收 `params` 並呼叫 `this.mockApi.getUser(params.params.userId)`。

```typescript
// analytics.ts
// ...
export class Analytics {
  // ...
  // TODO: Lab 6 - Part A: Use resource() to fetch user data based on userId.
  readonly user = resource({
    params: () => ({ userId: this.userId() }),
    loader: (params) => this.mockApi.getUser(params.params.userId),
  });
  // ...
}
```

- **檔案**: `workshop/app/src/app/features/analytics/analytics.html`
- **任務**:
  1. 找到 `<!-- User Profile (resource) -->` 區塊。
  2. 移除 `skeleton` 佔位元素。
  3. 使用 `@switch (user.status())` 來根據 `user` 資源的狀態顯示不同的內容：
     - `@case ('loading')`: 顯示 `skeleton`。
     - `@case ('error')`: 顯示錯誤訊息 `user.error()`。
     - `@case ('resolved')`: 顯示 `user.value()` 中的 `name` 和 `email`。

### 6-3. 任務 B: `rxResource` (Observable-based)

接下來，我們要連接一個即時的活動日誌，它是一個 RxJS Observable。

- **檔案**: `workshop/app/src/app/features/analytics/analytics.ts`
- **任務**:
  1. 找到 `// TODO: Lab 6 - Part B` 的註解。
  2. 使用 `rxResource()` 建立一個名為 `activityLog` 的資源。
  3. `stream` 函式應該回傳 `this.mockApi.activityStream$`。

```typescript
// analytics.ts
// ...
export class Analytics {
  // ...
  // TODO: Lab 6 - Part B: Use rxResource() to connect to the activityStream$.
  readonly activityLog = rxResource({
    stream: () => this.mockApi.activityStream$,
  });
  // ...
}
```

- **檔案**: `workshop/app/src/app/features/analytics/analytics.html`
- **任務**:
  1. 找到 `<!-- Activity Log (rxResource) -->` 區塊。
  2. 將 `<p>` 的內容替換為 `{{ activityLog.value() }}`。

### 6-4. 任務 C: `httpResource` (HttpClient-based)

最後，我們將使用 `httpResource` 來透過 `HttpClient` 取得使用者的任務列表。

- **檔案**: `workshop/app/src/app/app.config.ts`
- **任務**: (已經預先做好)
  1. 匯入 `provideHttpClient` 和 `withInterceptors`。
  2. 匯入我們為您準備好的 `mockHttpInterceptor`。
  3. 在 `providers` 陣列中，加入 `provideHttpClient(withInterceptors([mockHttpInterceptor]))`。

- **檔案**: `workshop/app/src/app/features/analytics/analytics.ts`
- **任務**:
  1. 找到 `// TODO: Lab 6 - Part C` 的註解。
  2. 使用 `httpResource()` 建立一個名為 `tasks` 的資源。
  3. 來源函式應該回傳一個指向 `/api/tasks?userId=${this.userId()}` 的 URL 字串。
  4. 提供一個 `defaultValue` 為 `[]`。

```typescript
// analytics.ts
// ...
export class Analytics {
  // ...
  // TODO: Lab 6 - Part C: Use httpResource() to fetch user tasks via HttpClient.
  readonly tasks = httpResource<Array<Task>>(() => `/api/tasks?userId=${this.userId()}`, {
    defaultValue: [],
  });
  // ...
}
```

- **檔案**: `workshop/app/src/app/features/analytics/analytics.html`
- **任務**:
  1. 找到 `<!-- User Tasks (httpResource) -->` 區塊。
  2. 實作與 `user` 資源類似的 `@switch` 邏輯來處理 `tasks` 的不同狀態。
  3. 在 `resolved` 狀態時，使用 `@for` 迴圈來顯示任務列表 `tasks.value()`。

### 6-5. 驗收清單

- [ ] 切換使用者按鈕時，「使用者個人資料」和「使用者任務」區塊會顯示載入中的骨架，然後顯示對應使用者的資料。
- [ ] 點擊「使用者 99」時，「使用者個人資料」會顯示錯誤訊息。
- [ ] 「即時活動紀錄」區塊會每隔幾秒自動更新一條新的日誌。
