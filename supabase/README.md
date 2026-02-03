# Supabase Migrations

此資料夾包含 Supabase 資料庫的 migration 檔案，使用 Supabase CLI 管理。

## 目錄結構

```
supabase/
├── config.toml              # Supabase CLI 設定
├── migrations/
│   ├── 20250130000000_initial_auth_tables.sql
│   ├── 20250203000000_add_ultimate_goals.sql
│   └── ...
└── README.md
```

## 命名規則

使用 Supabase CLI 時間戳格式：

```
{YYYYMMDDHHmmss}_{描述}.sql
```

例如：
- `20250130000000_initial_auth_tables.sql`
- `20250203000000_add_ultimate_goals.sql`

## 初始設定

### 1. 安裝 Supabase CLI

```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# 或使用 npm
npm install -g supabase

# 驗證安裝
supabase --version
```

### 2. 登入並連結專案

```bash
# 登入 Supabase
supabase login

# 連結到你的專案 (從 Dashboard > Project Settings > General 取得 Project ID)
supabase link --project-ref YOUR_PROJECT_ID
```

## 常用指令

### 執行 Migration

```bash
# 推送所有未執行的 migration 到遠端資料庫
supabase db push

# 查看 migration 狀態
supabase migration list
```

### 建立新的 Migration

```bash
# 方法 1: 建立空白 migration 檔案
supabase migration new add_feature_name

# 方法 2: 從現有資料庫差異自動產生
supabase db diff -f add_feature_name
```

### 本地開發

```bash
# 啟動本地 Supabase (需要 Docker)
supabase start

# 停止本地服務
supabase stop

# 重置本地資料庫 (會清除所有資料)
supabase db reset
```

## Migration 紀錄

| 檔案 | 說明 | 日期 |
|------|------|------|
| `20250130000000_initial_auth_tables.sql` | 建立使用者資料同步表 (settings, todos, star_rewards) | 2025-01-30 |
| `20250203000000_add_ultimate_goals.sql` | 新增終極目標同步表 (ultimate_goals) | 2025-02-03 |

## 注意事項

1. **依序執行**：Migration 按照時間戳順序執行
2. **冪等性**：使用 `IF NOT EXISTS` 確保重複執行不會出錯
3. **RLS**：所有表都啟用 Row Level Security，確保資料安全
4. **備份**：執行前建議先備份資料庫
5. **遠端執行**：`supabase db push` 會自動執行未套用的 migration

## 故障排除

### Migration 執行失敗

```bash
# 查看詳細錯誤
supabase db push --debug

# 手動在 SQL Editor 執行並檢查錯誤
```

### 本地與遠端不同步

```bash
# 列出遠端已執行的 migration
supabase migration list

# 重新連結專案
supabase link --project-ref YOUR_PROJECT_ID
```
