# Lab 6: Resource Family

---

## 處理非同步資料的挑戰

在 Angular 中處理非同步資料（例如 API 請求）通常需要：

- 管理載入 (Loading) 狀態
- 處理錯誤 (Error) 狀態
- 顯示最終的資料 (Value)
- 在依賴項變更時重新觸發請求

這通常需要寫很多樣板 (boilerplate) 程式碼。

---

## Resource Family

`@angular/core`、`@angular/core/rxjs-interop` 和 `@angular/common/http` 中的 Resource Family API 旨在簡化這個流程。

- **`resource`**: 來源是 `Promise`。
- **`rxResource`**: 來源是 `Observable`。
- **`httpResource`**: 專為 `HttpClient` 設計的 `resource`。

它們都會回傳一個包含 `status`, `value`, `error` 等狀態的 Signal，讓你可以輕鬆地在樣板中處理各種情況。

---

## 本次練習：數據儀表板

我們將在「分析」頁面建立一個儀表板，並依序使用三種 resource API 來載入資料。

- **Part A (`resource`)**: 根據使用者 ID 取得個人資料。
- **Part B (`rxResource`)**: 連接到一個模擬的即時日誌 Observable。
- **Part C (`httpResource`)**: 透過 `HttpClient` 取得使用者的任務列表。

---

## 程式碼參考 (Solution)

**`analytics.ts`**

```typescript
export class Analytics {
  // ...
  readonly user = resource({
    params: () => ({ userId: this.userId() }),
    loader: (params) => this.mockApi.getUser(params.params.userId),
  });

  readonly activityLog = rxResource({
    stream: () => this.mockApi.activityStream$,
  });

  readonly tasks = httpResource<Array<Task>>(() => `/api/tasks?userId=${this.userId()}`, {
    defaultValue: [],
  });
  // ...
}
```

---

## 程式碼參考 (Solution)

**`analytics.html`**

```html
@switch (user.status()) {
  @case ('loading') { ... }
  @case ('error') { ... }
  @case ('resolved') { ... }
}

<p>{{ activityLog.value() }}</p>

@switch (tasks.status()) {
  @case ('loading') { ... }
  @case ('error') { ... }
  @case ('resolved') { ... }
}
```

---

## 完成！

你已經學會了 Resource Family 的三種主要用法！
