# 語音報時器 Speaking Clock

一款可安裝的網頁應用程式（PWA），提供定時語音報時功能。

**線上體驗**: [https://koshuang.github.io/speaking-clock/](https://koshuang.github.io/speaking-clock/)

## 功能特色

### 核心功能
- **即時時鐘** - 顯示當前日期與時間，每秒更新
- **定時報時** - 可設定 1、5、10、15、30、60 分鐘間隔自動報時
- **語音合成** - 使用 Web Speech API 進行中文語音報時
- **時段區分** - 凌晨、上午、下午、晚上智慧判斷
- **螢幕常亮** - 支援 Screen Wake Lock API 防止螢幕關閉
- **PWA 支援** - 可安裝到桌面或手機，支援離線使用
- **設定記憶** - 自動保存用戶偏好設定

### v1.2.0 新增功能
- **待辦提醒** - 報時後語音提醒待辦事項（「提醒您：[待辦內容]」）
- **待辦管理** - 完整的新增、編輯、刪除功能
- **拖曳排序** - 拖曳調整待辦順序，決定提醒優先級
- **完成標記** - 點擊打勾標記完成，自動切換到下一個待辦

### v1.1.0 新增功能
- **深色模式** - 支援淺色/深色/系統主題切換
- **視覺回饋** - 報時時時鐘卡片會有脈動動畫
- **下次報時** - 頁尾顯示下次報時時間
- **點擊報時** - 點擊時鐘即可立即報時
- **PWA 安裝提示** - 自動顯示安裝提示橫幅
- **無障礙支援** - 所有控制項皆有 ARIA 標籤
- **新手導覽** - 首次使用顯示功能介紹

> 詳細產品規格請參閱 [PRD 文件](./docs/PRD.md)

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 建置

```bash
npm run build
```

### 執行測試

```bash
npm run test        # watch 模式
npm run test:run    # 單次執行
npm run init-prd    # 初始化 PRD 工作檔案
```

## 專案架構

採用 **Clean Architecture** 分層架構，確保核心業務邏輯獨立於框架與外部依賴：

```
speaking-clock/
├── src/
│   ├── domain/                # 核心業務邏輯（無外部依賴）
│   ├── infrastructure/        # 外部依賴實作
│   ├── presentation/          # UI 層
│   └── di/                    # 依賴注入
├── docs/
│   ├── PRD.md                 # 產品需求文件
│   └── templates/             # PRD 範本（團隊共享）
├── scripts/
│   └── init-prd.sh            # PRD 初始化腳本
└── .omc/                      # 本地工作目錄（gitignore）
```

### 架構優點

| 層級 | 職責 | 優點 |
|------|------|------|
| Domain | 核心業務邏輯 | 無外部依賴，可獨立測試 |
| Ports | 抽象介面定義 | 依賴反轉，方便替換實作 |
| Infrastructure | 外部依賴實作 | 隔離瀏覽器 API |
| Presentation | UI 邏輯 | 專注於畫面呈現 |
| DI | 依賴注入 | 集中管理物件建立 |

## 測試

Domain 層 Use Case 已有完整單元測試：

```
✓ TimeFormatter.test.ts (15 tests)
  - 時段判斷（凌晨、上午、下午、晚上）
  - 小時格式化（12小時制）
  - 分鐘格式化（整點 vs 非整點）

✓ SpeakTimeUseCase.test.ts (6 tests)
  - execute() 執行報時
  - setVoice() 設定語音
  - getVoices() 取得語音列表

✓ ManageSettingsUseCase.test.ts (10 tests)
  - load() / save() 設定存取
  - updateInterval() 更新間隔
  - toggleEnabled() 切換啟用狀態

✓ ManageTodosUseCase.test.ts (16 tests)
  - add() / update() / remove() 待辦 CRUD
  - toggle() 切換完成狀態
  - reorder() 重新排序
  - getNextUncompleted() 取得下一個待辦

✓ SpeakReminderUseCase.test.ts (5 tests)
  - execute() 播報提醒
  - setVoice() 設定語音
```

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | React 19 |
| 建置工具 | Vite 7 |
| 語言 | TypeScript |
| UI 元件庫 | shadcn/ui |
| 拖曳排序 | dnd-kit |
| 樣式 | Tailwind CSS v4 |
| PWA | vite-plugin-pwa |
| 測試 | Vitest |
| 部署 | GitHub Pages + GitHub Actions |

## 瀏覽器 API

| API | 用途 |
|-----|------|
| [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | 語音合成 |
| [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) | 防止螢幕關閉 |
| [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | 儲存設定 |

## 部署

專案使用 GitHub Actions 自動部署到 GitHub Pages。每次推送到 `main` 分支會自動觸發部署。

### 手動部署

```bash
npm run build
# 將 dist/ 目錄部署到靜態網站服務
```

## 授權

MIT License
