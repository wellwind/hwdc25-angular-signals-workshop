---
title: Lab 2 — linkedSignal
theme: gaia
paginate: true
marp: true
---

# Lab 2 — Two-way State with `linkedSignal`

- **目標**：學習 `linkedSignal`，處理「有衍生邏輯，但又希望可以手動覆寫」的狀態。
- **情境**：智慧折扣碼

---

## 情境：智慧折扣碼

我們的購物車頁面，會根據會員等級，自動推薦折扣碼。

- **衍生邏輯**：`standard` 等級推薦 `WELCOME5`，`gold` 等級推薦 `GOLD10`。
- **手動覆寫**：我們也希望使用者能手動輸入他在別處拿到的折扣碼，例如 `HELLOWORLD`。
- **智慧重置**：當會員等級提升時，系統應該要能自動換上更優惠的折扣碼，覆寫掉使用者的手動輸入。

`computed` 無法被覆寫，這就是 `linkedSignal` 發揮作用的地方。

---

## 起手式 (`start` 狀態)

- **指令**：`npm run lab:use -- lab2-start`
- **現況**：`discountCode` 目前是一個 `computed`。

```typescript
// readonly discountCode = computed(() => { ... });
```

- **問題**：因為 `computed` 是唯讀的，所以 `onCodeInput` 方法中的 `this.discountCode.set(code)` 會報錯，導致使用者無法手動輸入折扣碼。

---

## 任務：改用 `linkedSignal`

將 `discountCode` 從 `computed` 改為 `linkedSignal`。

- **引入**：`import { ..., linkedSignal } from '@angular/core';`
- **修改**：
```typescript
// solution/cart.ts

readonly discountCode: WritableSignal<string> = linkedSignal(() => {
  const level = this.userLevel();
  if (level === 'platinum') return 'PLATINUM20';
  if (level === 'gold') return 'GOLD10';
  return 'WELCOME5';
});

// ...

onCodeInput(code: string) {
  this.discountCode.set(code);
}
```
`linkedSignal` 讓 `discountCode` 同時擁有「衍生能力」和「可寫入能力」。

---

## `linkedSignal` 的行為

1.  **有預設值**：它的值會根據你的衍生函式 (`() => ...`) 計算而來。
2.  **可手動覆寫**：你可以隨時使用 `.set()` 來給它一個新值。
3.  **來源變動時會重置**：當來源 signal (`userLevel`) 變動時，衍生函式會**重新執行**，計算出一個新的預設值，並**覆寫**掉你之前手動設定的值。

這就是「智慧重置」的行為模式。

---

## 驗收清單

- [ ] 切換會員等級時，折扣碼會自動變更。
- [ ] 可以在輸入框中，手動輸入一個有效的折扣碼 (例如 `HELLOWORLD`)，最終價格會正確計算。
- [ ] 在手動輸入折扣碼後，再次切換會員等級，折扣碼會被系統推薦的新碼覆寫。
