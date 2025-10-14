# Angular Signals Workshop

本專案為 Angular Signals 工作坊的程式碼範例。

工作坊的目標是讓學員透過一系列的實作練習，深入了解 Angular Signals 的核心概念與實際應用。

## 操作教學

### 1. 前置準備

請先確認已安裝 Node.js 18 或更新版本。

本專案分為根目錄的管理工具，以及 `/app/` 中的 Angular 應用程式。請分別安裝它們的相依套件。

```bash
# 安裝管理工具的相依套件
npm install

# 進入 app 目錄，安裝 Angular 應用程式的相依套件
cd app
npm install
cd ..
```

### 2. 啟動專案

請在根目錄執行以下指令來啟動 Angular 開發伺服器：

```bash
npm run dev
```

應用程式將會在 `http://localhost:4200/` 上執行。

### 3. 實驗操作

本工作坊包含多個實驗，你可以使用根目錄下指令來切換不同實驗的狀態。

**重要：** 請務必在目錄下執行以下所有 `lab` 相關指令。

#### 列出所有實驗

```bash
npm run lab:list
```

#### 切換到指定實驗的「起始」狀態

使用此指令來準備開始一個新的實驗。例如，要開始第一個實驗：

```bash
# 使用完整指令
npm run lab:use -- lab1-start

# 或使用簡化指令
npm run start:lab1
```

#### 切換到指定實驗的「解答」狀態

如果想參考實驗的最終完成程式碼，可以使用此指令。例如，要查看第一個實驗的解答：

```bash
# 使用完整指令
npm run lab:use -- lab1-solution

# 或使用簡化指令
npm run solution:lab1
```

---

**運作方式說明：**

- 當你執行 `start:*` 或 `solution:*` 指令時，工具會自動將你目前的 `app/src` 目錄備份到 `.lab-backups` 資料夾中。
- 接著，它會將對應實驗室的 `start` 或 `solution` 版本的程式碼，覆蓋到 `app/src` 目錄下。
- 如果需要，你可以執行 `npm run lab:restore` 來還原到執行指令前的上一個狀態。