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
- **技術棧**: React 19, Vite 7, TypeScript, shadcn/ui, Tailwind CSS v4, Vitest
- **部署**: GitHub Pages (自動部署)

## 專案結構

```
speaking-clock/
├── src/
│   ├── domain/                # 核心業務邏輯（純 TypeScript，無外部依賴）
│   │   ├── entities/          # 資料模型 (ClockSettings, Voice)
│   │   ├── usecases/          # 應用邏輯 (TimeFormatter, SpeakTimeUseCase, ManageSettingsUseCase)
│   │   └── ports/             # 介面定義 (SpeechSynthesizer, SettingsRepository, WakeLockManager)
│   ├── infrastructure/        # 外部依賴實作
│   ├── presentation/          # UI 層 (React)
│   │   ├── hooks/             # useSpeakingClock, useWakeLock
│   │   └── components/        # React 元件
│   └── di/                    # 依賴注入容器
│
├── docs/
│   ├── PRD.md                 # 產品需求文件
│   └── templates/             # PRD 範本（團隊共享）
│       ├── PRD-TEMPLATE.md    # 空白範本
│       └── PRD-EXAMPLE.md     # 完整範例
│
├── scripts/
│   └── init-prd.sh            # PRD 初始化腳本
│
└── .omc/                      # 本地工作目錄（gitignore）
    └── prd.md                 # 實際執行的 PRD
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
npm run init-prd   # 初始化 PRD 工作檔案
```

### Claude 自訂指令

| 指令 | 說明 |
|------|------|
| `/done` | 任務完成後的文件維護流程 |
| `/ralph-init` | 啟動 Ralph PRD 執行模式 |
| `/ralph "task"` | 以持續模式執行任務直到完成 |

### Ralph 工作流程

使用 PRD 範本確保每個子任務有獨立 commit，以便 release-please 自動產生正確的 changelog：

```bash
# 1. 初始化 PRD
npm run init-prd "Feature Name"

# 2. 編輯 .omc/prd.md 填寫任務

# 3. 啟動 Ralph
/ralph-init
```

詳見 `docs/templates/PRD-TEMPLATE.md` 和 `docs/templates/PRD-EXAMPLE.md`。

## 環境設定

### direnv（專案環境變數）

本專案使用 [direnv](https://direnv.net/) 管理專案專屬的環境變數，進入目錄時自動載入。

```bash
# 安裝 direnv（如尚未安裝）
brew install direnv

# 允許載入 .envrc
direnv allow
```

**設定檔案：**
- `.envrc` - 實際環境變數（已加入 .gitignore）
- `.envrc.example` - 範本檔案

**目前設定的變數：**
- `GH_TOKEN` - GitHub Personal Access Token（用於 gh CLI）

## 專案管理

### GitHub Project

專案使用 GitHub Project 看板管理任務：

- **Project URL**: https://github.com/users/koshuang/projects/1
- **方法論**: Kanban 看板

### Issue 標籤

| 標籤 | 說明 |
|------|------|
| `bug` | 程式錯誤 |
| `enhancement` | 功能改進或新功能 |

### Release 流程（release-please）

本專案使用 [release-please](https://github.com/googleapis/release-please) 自動管理版本發布：

**運作方式：**
1. Push 到 `main` 分支時，release-please 會分析 commits
2. 自動建立/更新 Release PR（包含 CHANGELOG 和版本更新）
3. Merge Release PR 後自動建立 GitHub Release 和 git tag

**Commit 類型與版本影響：**

| Commit 類型 | Release Notes 區段 | 版本影響 |
|-------------|-------------------|----------|
| `feat:` | Features | Minor (0.x.0) |
| `fix:` | Bug Fixes | Patch (0.0.x) |
| `feat!:` 或 `BREAKING CHANGE:` | Breaking Changes | Major (x.0.0) |
| `perf:` | Performance | Patch |
| `refactor:` | Code Refactoring | 不觸發 |
| `docs:` | Documentation | 不觸發 |
| `chore:` | 隱藏 | 不觸發 |

**相關檔案：**
- `.github/workflows/release-please.yml` - GitHub Action
- `release-please-config.json` - 設定檔
- `.release-please-manifest.json` - 版本追蹤
- `CHANGELOG.md` - 自動產生的變更日誌

## 重要檔案

| 檔案 | 說明 |
|------|------|
| `vite.config.ts` | Vite 設定，包含 PWA 配置 |
| `tsconfig.app.json` | TypeScript 設定 |
| `.github/workflows/deploy.yml` | GitHub Actions 部署設定 |
| `.github/workflows/release-please.yml` | 自動 Release 設定 |
| `release-please-config.json` | Release 設定檔 |
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

### 新增 shadcn/ui 元件

使用 shadcn CLI 安裝新元件：

```bash
npx shadcn@latest add <component-name>
```

常用元件：
- `button` - 按鈕
- `card` - 卡片容器
- `select` - 下拉選單
- `toggle` - 切換按鈕
- `toggle-group` - 切換按鈕群組
- `dialog` - 對話框
- `input` - 輸入框

元件會安裝到 `src/presentation/components/ui/`。

查看所有可用元件：https://ui.shadcn.com/docs/components
