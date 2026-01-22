# Claude Commands

## /dev

啟動開發伺服器。

```bash
npm run dev
```

## /build

建置生產版本。

```bash
npm run build
```

## /test

執行所有測試。

```bash
npm run test:run
```

## /test:watch

以 watch 模式執行測試。

```bash
npm run test
```

## /lint

執行 ESLint 檢查。

```bash
npm run lint
```

## /deploy

手動觸發 GitHub Actions 部署（需要先 push）。

```bash
git push origin main
```

## /clean

清理建置產物和依賴。

```bash
rm -rf dist node_modules && npm install
```

## /architecture

顯示專案架構說明。

請參考 AGENT.md 中的「專案結構」章節，此專案採用 Clean Architecture：

- **domain/**: 核心業務邏輯（無外部依賴）
- **infrastructure/**: 外部依賴實作
- **presentation/**: React UI 層
- **di/**: 依賴注入容器

## /add-feature

新增功能的標準流程：

1. 在 `domain/ports/` 定義介面（如需要）
2. 在 `domain/entities/` 定義資料模型（如需要）
3. 在 `domain/usecases/` 實作業務邏輯
4. 在 `domain/usecases/__tests__/` 撰寫測試
5. 在 `infrastructure/` 實作外部依賴（如需要）
6. 在 `di/container.ts` 註冊依賴
7. 在 `presentation/hooks/` 建立 React Hook
8. 在 `presentation/components/` 更新 UI
9. 執行 `npm run test:run` 確認測試通過
10. 執行 `npm run build` 確認建置成功

## /fix-type-error

常見 TypeScript 錯誤修復：

### Type-only import 錯誤
```typescript
// 錯誤
import { SomeType } from './module'

// 正確
import type { SomeType } from './module'
```

### 同時 import type 和 value
```typescript
import type { ClockSettings } from './ClockSettings'
import { DEFAULT_CLOCK_SETTINGS } from './ClockSettings'
```

## /done

任務完成後的文件維護流程。此指令會根據完成的工作類型，評估並更新相關文件。

### 使用方式

完成任務後執行 `/done`，AI 會：

1. **詢問變更摘要** - 請描述完成了什麼工作
2. **分析變更類型** - 判斷屬於哪種類型的變更
3. **評估文件更新需求** - 根據 AGENT.md 中的維護規範判斷
4. **執行文件更新** - 更新必要的文件

### 變更類型與文件對應

| 變更類型 | README.md | PRD.md | AGENT.md |
|----------|:---------:|:------:|:--------:|
| 新增使用者可見功能 | ✅ 功能特色 | ✅ 功能需求 | - |
| 新增技術元件/API | ✅ 技術棧 | ✅ 技術規格 | - |
| 修改架構或目錄結構 | ✅ 專案架構 | - | ✅ 專案結構 |
| 新增/修改測試 | ✅ 測試章節 | - | - |
| 新增設定選項 | - | ✅ 功能需求表 | - |
| 新增 UI 元件庫或樣式系統 | ✅ 技術棧 | ✅ 技術選型 | - |
| Bug 修復 | - | - | - |
| 重構（不改變功能） | - | - | 視情況 |

### 執行步驟

```
1. 執行 /done
2. 描述完成的工作（例如：「整合 shadcn/ui 和 Tailwind CSS」）
3. AI 分析並列出需要更新的文件
4. AI 執行文件更新
5. 顯示更新摘要
```

### 文件更新原則

- **README.md**: 面向使用者和新開發者，保持簡潔
- **PRD.md**: 產品規格文件，記錄功能需求和技術規格
- **AGENT.md**: AI 開發指引，記錄架構和開發規範

### 範例

完成「整合 shadcn/ui」後執行 `/done`：

**需要更新的文件：**
- README.md: 技術棧新增 shadcn/ui 和 Tailwind CSS
- PRD.md: 技術選型新增 UI 元件庫
- AGENT.md: 專案結構更新（移除 styles/，新增 ui/）
