# 語音報時器 Speaking Clock

一款可安裝的網頁應用程式（PWA），提供定時語音報時功能，適合需要時間提醒的用戶，包含為小朋友設計的待辦提醒功能。

**線上體驗**: [https://koshuang.github.io/speaking-clock/](https://koshuang.github.io/speaking-clock/)

## 功能特色

- **定時報時** - 1/5/10/15/30/60 分鐘間隔自動語音報時
- **待辦提醒** - 報時後語音提醒待辦事項，支援 60+ 種圖示方便小朋友辨識
- **深色模式** - 支援淺色/深色/系統主題
- **PWA 支援** - 可安裝到桌面或手機，支援離線使用
- **無障礙設計** - ARIA 標籤、鍵盤操作、螢幕閱讀器支援

> 版本歷史請參閱 [CHANGELOG](./CHANGELOG.md)

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

採用 **Clean Architecture** 分層架構：

```
src/
├── domain/           # 核心業務邏輯（無外部依賴）
├── infrastructure/   # 外部依賴實作（瀏覽器 API）
├── presentation/     # UI 層（React 元件）
└── di/               # 依賴注入
```

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | React 19 |
| 建置工具 | Vite 7 |
| 語言 | TypeScript |
| UI 元件庫 | shadcn/ui |
| 圖示庫 | lucide-react |
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

## 文件

| 文件 | 說明 |
|------|------|
| [CHANGELOG](./CHANGELOG.md) | 版本歷史與變更記錄 |
| [PRD](./docs/PRD.md) | 產品需求文件 |
| [UI/UX 設計指南](./docs/UI-UX-DESIGN-GUIDE.md) | 設計規範與元件指南 |

## 授權

MIT License
