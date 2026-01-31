# CI/CD 設定指南

本專案使用 GitHub Actions 進行持續整合，搭配 Renovate 自動更新依賴。

## Infrastructure as Code 原則

本專案遵循 IaC 原則，所有基礎設施設定皆以程式碼管理：

| 原則 | 說明 |
|------|------|
| **版本控制** | 所有設定檔納入 Git 版本控制 |
| **冪等性** | Scripts 可重複執行，結果相同 |
| **自動化** | 優先使用 scripts，避免手動操作 |
| **可驗證** | 執行後自動驗證設定狀態 |

### Scripts 目錄結構

```
scripts/
├── setup/                    # 開發環境初始化
│   ├── all.sh               # 一鍵執行所有設定
│   └── init-prd.sh          # 初始化 PRD 工作檔
└── infra/                    # 基礎設施設定
    └── branch-protection.sh # GitHub branch protection
```

### NPM Scripts

| 指令 | 用途 |
|------|------|
| `npm run setup:all` | 執行所有設定 |
| `npm run setup:github` | 設定 GitHub branch protection |
| `npm run setup:prd` | 初始化 PRD 工作檔 |
| `npm run infra:branch-protection` | 同 setup:github |

## 架構概覽

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Renovate   │────▶│  PR + CI    │────▶│ Auto Merge  │
│  建立 PR    │     │  測試通過   │     │  合併到 main │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Deploy    │
                    │  GitHub Pages│
                    └─────────────┘
```

## Workflows

| Workflow | 觸發條件 | 用途 |
|----------|----------|------|
| `ci.yml` | Pull Request to main | 執行 lint、typecheck、test、build |
| `deploy.yml` | Push to main | 部署到 GitHub Pages |
| `release-please.yml` | Push to main | 自動版本發布 |

## CI 檢查項目

```yaml
npm run lint       # ESLint 程式碼檢查
npm run typecheck  # TypeScript 類型檢查
npm run test       # Vitest 單元測試
npm run build      # Vite 建置
```

## Renovate 設定

設定檔：`renovate.json`

| 設定 | 值 |
|------|-----|
| 執行時間 | 每個工作日早上 9 點前 (Asia/Taipei) |
| 更新策略 | patch/minor 自動合併，major 需人工審核 |
| 分組 | React、Vite、Testing、TypeScript/ESLint、Tailwind |

## Branch Protection 設定

為了讓 Renovate 自動合併功能正常運作，需要設定 branch protection rules。

### 方法一：使用 Script（推薦）

```bash
# 設定 GitHub Token 環境變數
export GITHUB_TOKEN=your_github_token

# 執行所有設定（含 branch protection）
npm run setup:all

# 或只執行 GitHub 設定
npm run setup:github

# 查看當前狀態（不做變更）
DRY_RUN=1 npm run infra:branch-protection
```

### 方法二：手動設定

1. 前往 Repository Settings → Branches
2. Add branch protection rule
3. Branch name pattern: `main`
4. 啟用以下選項：
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - 搜尋並選擇 `test` job
   - ✅ Require branches to be up to date before merging

## 所需的 GitHub Token 權限

如果使用 script 設定，token 需要以下權限：

| 權限 | 用途 |
|------|------|
| `repo` | 讀寫 repository 設定 |
| `admin:repo_hook` | 管理 webhooks（可選）|

建立 token: https://github.com/settings/tokens/new

## 疑難排解

### Renovate PR 沒有自動合併

1. 確認 CI 是否通過
2. 確認 branch protection 已設定 required status checks
3. 確認 Renovate 有 repo 寫入權限

### CI 失敗

```bash
# 本地執行完整 CI 檢查
npm run lint && npm run typecheck && npm run test && npm run build
```
