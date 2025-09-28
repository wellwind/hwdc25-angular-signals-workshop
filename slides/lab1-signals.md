---
title: Lab 1 — Signals 核心
theme: gaia
paginate: true
marp: true
---

# Lab 1 — Signals 核心

- 目標：完成任務清單（新增/切換/刪除）、統計（總數/完成數/完成率）、LocalStorage 持久化
- 技術點：`signal`、`computed`、`effect`、`untracked`

---

## 起手式（起始快照）

- 指令：
  - `cd workshop`
  - `npm run lab:use -- lab1-start`
  - `cd app && npm start` → 打開「任務」頁
- 你會看到：
  - 任務列表可新增/切換/刪除
  - 上方僅顯示「共 X 項」
  - LocalStorage 尚未接上

---

## 任務 A：完成統計（computed）

- 在 `tasks.ts` 補上：
  - `doneCount`：已完成數
  - `completionRate`：完成率（四捨五入整數 %）
- 在 `tasks.html` 顯示：
  - 「共 X 項，已完成 Y 項（完成率 Z%）」

---

## 任務 B：持久化（effect）

- 實作一個 `effect`：當 `tasks()` 改變時，寫入 LocalStorage

---

## 任務 C：`untracked`（避免不必要依賴）

- **情境**：`effect` 除了主要依賴外，有時需要讀取某些「獨立」的 signal，但我們不希望這些獨立 signal 的變動，反過來觸發 `effect`。
- **範例**：存檔 `tasks` 的 `effect`，想順便記錄當時的 `user`，但**不希望**在 `user` 變動時，也觸發存檔。

```typescript
// 獨立的 user signal
readonly user = signal({ name: 'Learner' });

constructor() {
  effect(() => {
    // 主要依賴：追蹤 tasks
    const tasks = this.tasks();
    saveTasks(tasks);

    // 次要需求：讀取 user，但不建立依賴
    const currentUser = untracked(this.user);
    console.log(`Tasks saved for: ${currentUser.name}`);
  });
}
```

---

## 驗收清單

- 勾選任務即時更新完成數與完成率
- 新增/刪除任務後統計正確
- 重整頁面資料仍存在（LocalStorage）
- **(進階)** 在頁面上新增 input 可修改 user.name，並驗證修改時不會觸發存檔 effect。