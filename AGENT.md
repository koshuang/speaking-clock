# AGENT.md - AI 開發指引

本文件提供 AI 助手（如 Claude）在此專案中進行開發時的指引與規範。

---

## ⚠️ 重要：開發前必讀

**在進行任何功能開發之前，AI 必須先閱讀以下文件：**

1. **[README.md](./README.md)** - 專案概述、功能特色、架構說明
2. **[docs/PRD.md](./docs/PRD.md)** - 產品需求文件、功能規格
3. **本文件 (AGENT.md)** - 開發規範與指引

### 文件維護責任

每次完成功能開發後，**必須評估並更新相關文件**：

| 變更類型 | 需更新的文件 |
|----------|--------------|
| 新增使用者可見功能 | README.md（功能特色）、PRD.md（功能需求） |
| 新增技術元件/API | README.md（技術棧、架構）、PRD.md（技術規格） |
| 修改架構或目錄結構 | README.md（專案架構）、AGENT.md（專案結構） |
| 新增測試 | README.md（測試章節） |
| 新增設定選項 | PRD.md（功能需求表） |
| Bug 修復 | 通常不需更新，除非涉及行為變更 |

**範例**：若新增「自訂報時文字」功能，需要：
- 更新 README.md 的「功能特色」
- 更新 PRD.md 的功能需求表（將 P2 改為已實作）
- 更新 AGENT.md 的擴展指引（如有新模式）

---

## 專案概述

**語音報時器 (Speaking Clock)** 是一個 PWA 應用程式，使用 React + TypeScript 開發，採用 Clean Architecture 架構。

- **線上版本**: https://koshuang.github.io/speaking-clock/
- **技術棧**: React 19, Vite 7, TypeScript, Vitest
- **部署**: GitHub Pages (自動部署)

## 專案結構

```
src/
├── domain/                    # 核心業務邏輯（純 TypeScript，無外部依賴）
│   ├── entities/              # 資料模型 (ClockSettings, Voice)
│   ├── usecases/              # 應用邏輯 (TimeFormatter, SpeakTimeUseCase, ManageSettingsUseCase)
│   └── ports/                 # 介面定義 (SpeechSynthesizer, SettingsRepository, WakeLockManager)
│
├── infrastructure/            # 外部依賴實作
│   ├── WebSpeechSynthesizer.ts        # Web Speech API
│   ├── LocalStorageSettingsRepository.ts # localStorage
│   └── ScreenWakeLockManager.ts       # Wake Lock API
│
├── presentation/              # UI 層 (React)
│   ├── hooks/                 # useSpeakingClock, useWakeLock
│   ├── components/            # App.tsx
│   └── styles/                # CSS
│
└── di/                        # 依賴注入容器
    └── container.ts
```

## 開發規範

### Clean Architecture 原則

1. **Domain 層不可依賴外部**
   - `domain/` 下的程式碼只能 import 同層或 TypeScript 內建型別
   - 不可 import React、瀏覽器 API、第三方套件

2. **依賴方向**
   ```
   presentation → di → infrastructure → domain
                       ↓
                    domain (ports)
   ```

3. **新增功能流程**
   1. **閱讀文件** - 先閱讀 README.md、PRD.md、AGENT.md
   2. **定義介面** - 在 `domain/ports/` 定義介面
   3. **實作業務邏輯** - 在 `domain/usecases/` 實作
   4. **撰寫測試** - 在 `domain/usecases/__tests__/` 撰寫單元測試
   5. **實作外部依賴** - 在 `infrastructure/` 實作
   6. **註冊依賴** - 在 `di/container.ts` 註冊
   7. **建立 UI** - 在 `presentation/` 建立
   8. **更新文件** - 視情況更新 README.md 和 PRD.md

### TypeScript 規範

1. **Type Import**
   ```typescript
   // 正確：type-only import
   import type { ClockSettings } from '../entities/ClockSettings'

   // 錯誤：會被 verbatimModuleSyntax 拒絕
   import { ClockSettings } from '../entities/ClockSettings'
   ```

2. **Interface vs Type**
   - Ports（介面定義）使用 `interface`
   - Entities（資料模型）使用 `interface`
   - Union types 使用 `type`

### 測試規範

1. **測試位置**: `__tests__/` 目錄，與被測試檔案同層
2. **命名**: `{FileName}.test.ts`
3. **Domain 層必須有測試**，其他層建議有測試

```bash
# 執行測試
npm run test        # watch 模式
npm run test:run    # 單次執行
```

### Git Commit 規範

使用語義化 commit message：

```
feat: 新增功能
fix: 修復 bug
refactor: 重構（不改變功能）
test: 測試相關
docs: 文件相關
chore: 雜項（建置、設定等）
```

範例：
```
feat: Add scheduled announcement feature

- Add ScheduleSettings entity
- Implement ScheduleUseCase
- Update UI with schedule configuration

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 常用指令

```bash
npm run dev        # 開發伺服器
npm run build      # 建置生產版本
npm run test       # 執行測試 (watch)
npm run test:run   # 執行測試 (單次)
npm run lint       # ESLint 檢查
npm run preview    # 預覽建置結果
```

## 重要檔案

| 檔案 | 說明 |
|------|------|
| `vite.config.ts` | Vite 設定，包含 PWA 配置 |
| `tsconfig.app.json` | TypeScript 設定 |
| `.github/workflows/deploy.yml` | GitHub Actions 部署設定 |
| `docs/PRD.md` | 產品需求文件 |

## 注意事項

### PWA 相關
- 修改 `vite.config.ts` 中的 `VitePWA` 設定來調整 PWA 行為
- `base: '/speaking-clock/'` 是 GitHub Pages 必要的路徑設定

### 語音 API
- Web Speech API 在不同瀏覽器有不同的語音列表
- 優先使用 `zh-TW` 語音，fallback 到任何中文語音

### Wake Lock API
- 只能防止螢幕自動關閉，無法在螢幕關閉後執行
- 需要用戶互動後才能請求

## 擴展指引

### 新增報時間隔選項

1. 修改 `src/presentation/components/App.tsx` 中的 `INTERVAL_OPTIONS`
2. 測試 UI 顯示正常

### 新增語音設定（如語速、音調）

1. 在 `domain/entities/` 新增設定欄位
2. 更新 `domain/ports/SpeechSynthesizer.ts` 介面
3. 更新 `infrastructure/WebSpeechSynthesizer.ts` 實作
4. 更新 UI 和 hooks

### 新增新的外部依賴

1. 在 `domain/ports/` 定義介面
2. 在 `infrastructure/` 實作
3. 在 `di/container.ts` 註冊
4. 撰寫測試
