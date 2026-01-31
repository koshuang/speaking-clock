# Speaking Clock - AI 開發指引

## 專案概述

語音報時器 PWA 應用程式，採用 Clean Architecture 分層架構。

## 開發原則

### Infrastructure as Code (IaC)

所有基礎設施和環境設定都必須以程式碼形式管理：

| 原則 | 說明 |
|------|------|
| **版本控制** | 所有設定檔案都必須納入 Git 版本控制 |
| **冪等性** | Scripts 必須可重複執行，多次執行結果相同 |
| **自動化** | 避免手動操作，優先使用 scripts 或 CI/CD |
| **可審核** | 設定變更透過 PR 審核，留下變更記錄 |
| **環境變數** | 機密資訊透過環境變數注入，不寫入程式碼 |

### Script 設計規範

```bash
#!/bin/bash
set -e  # 遇錯即停

# 1. 冪等性檢查 - 已存在則跳過或更新
if [ -f "$TARGET" ]; then
    echo "已存在，執行更新..."
fi

# 2. 環境變數檢查
: "${REQUIRED_VAR:?錯誤：請設定 REQUIRED_VAR}"

# 3. 清楚的輸出
echo "✓ 完成某操作"
echo "⚠ 警告訊息"
echo "✗ 錯誤訊息"
```

### Script 分類

| 目錄 | 用途 | 命名規則 |
|------|------|----------|
| `scripts/setup/` | 開發環境初始化 | `setup-*.sh` |
| `scripts/infra/` | 基礎設施設定（GitHub、CI/CD） | `*.sh` |
| `scripts/` | 一般工具 script | 依功能命名 |

### NPM Scripts 命名規則

| 前綴 | 用途 | 範例 |
|------|------|------|
| `setup:*` | 環境設定 | `setup:all`, `setup:github` |
| `infra:*` | 基礎設施 | `infra:branch-protection` |
| `dev` | 開發伺服器 | `dev` |
| `build` | 建置 | `build` |
| `test` | 測試 | `test`, `test:run` |
| `lint` | 程式碼檢查 | `lint` |

## 環境設定

### .envrc vs .env.local 差異

本專案使用兩種環境變數檔案，用途不同：

| 特性 | `.envrc` (direnv) | `.env.local` (dotenv) |
|------|-------------------|----------------------|
| **載入方式** | 進入目錄時自動載入（shell 層級） | 應用程式啟動時載入 |
| **載入工具** | [direnv](https://direnv.net/) | Vite 內建 / dotenv |
| **作用範圍** | 整個 shell session | 只有該應用程式 |
| **可用於** | npm scripts、gh CLI、任何終端指令 | Vite dev/build |
| **適合放** | `GH_TOKEN`、CLI 工具用的 token | `VITE_*` 前端變數 |

**建議做法：**
- CLI 工具變數（如 `GH_TOKEN`）→ 放 `.envrc`
- 前端 build-time 變數（如 `VITE_SUPABASE_*`）→ 可放 `.env.local` 或 `.envrc`（Vite 兩者都能讀）

> 兩個檔案都已加入 `.gitignore`，不會被 commit。

### direnv 設定

```bash
# 安裝 direnv (macOS)
brew install direnv

# 加入 shell (zsh)
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc

# 允許專案 .envrc
direnv allow
```

### 環境變數檔案範例

**`.envrc`（CLI 工具用）：**
```bash
# GitHub Token - 用於 scripts/infra/*
export GH_TOKEN="ghp_your_token"

# 也可以放 Vite 變數（Vite 會讀 shell 環境變數）
export VITE_SUPABASE_URL="https://xxx.supabase.co"
export VITE_SUPABASE_ANON_KEY="your_anon_key"
```

**`.env.local`（純前端用，可選）：**
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 環境變數一覽

| 變數 | 別名 | 用途 | 建議放置 |
|------|------|------|----------|
| `GH_TOKEN` | `GITHUB_TOKEN` | GitHub API / CLI | `.envrc` |
| `VITE_SUPABASE_URL` | - | Supabase 專案 URL | `.envrc` 或 `.env.local` |
| `VITE_SUPABASE_ANON_KEY` | - | Supabase Anon Key | `.envrc` 或 `.env.local` |

> Scripts 支援 `GH_TOKEN` 和 `GITHUB_TOKEN` 兩種名稱。

### 快速設定

```bash
# 1. Clone 專案
git clone https://github.com/koshuang/speaking-clock.git
cd speaking-clock

# 2. 設定 .envrc（direnv 會自動載入）
cp .envrc.example .envrc
# 編輯 .envrc 填入 token
direnv allow

# 3. 執行所有設定（自動安裝依賴 + GitHub 設定）
npm run setup:all

# 4. 開始開發
npm run dev
```

## CI/CD 流程

```
Push to main ─────────────────────────────► Deploy to GitHub Pages
                                                    ▲
PR to main ──► CI (lint/typecheck/test/build) ─────┘
                        ▲
Renovate PR ────────────┴──► Auto-merge (if CI passes)
```

詳細設定參考：[CI/CD 設定指南](../docs/CI-CD-SETUP.md)

## 程式碼風格

- TypeScript strict mode
- ESLint 規則遵循
- React 19 + Hooks
- Tailwind CSS v4
- shadcn/ui 元件庫

## 測試

```bash
npm run test        # Watch 模式
npm run test:run    # 單次執行
npm run typecheck   # 類型檢查
npm run lint        # ESLint 檢查
```

## 相關文件

| 文件 | 說明 |
|------|------|
| [README](../README.md) | 專案總覽 |
| [PRD](../docs/PRD.md) | 產品需求文件 |
| [CI/CD 設定指南](../docs/CI-CD-SETUP.md) | GitHub Actions 與 Renovate |
| [Supabase 設定指南](../docs/SUPABASE-SETUP.md) | 雲端同步設定 |
| [UI/UX 設計指南](../docs/UI-UX-DESIGN-GUIDE.md) | 設計規範 |
