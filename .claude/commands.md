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
