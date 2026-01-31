# Supabase Migrations

此資料夾包含 Supabase 資料庫的 migration 檔案。

## 目錄結構

```
supabase/
├── migrations/
│   ├── 001_initial_auth_tables.sql
│   ├── 002_xxx.sql
│   └── ...
└── README.md
```

## 命名規則

```
{序號}_{描述}.sql
```

例如：
- `001_initial_auth_tables.sql`
- `002_add_user_preferences.sql`
- `003_add_analytics_tables.sql`

## 如何執行 Migration

### 方法 1：手動執行（推薦用於小專案）

1. 打開 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的專案
3. 進入 **SQL Editor**
4. 依序執行 `migrations/` 資料夾中的 SQL 檔案

### 方法 2：使用 Supabase CLI

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入
supabase login

# 連結專案
supabase link --project-ref your-project-id

# 執行 migration
supabase db push
```

## Migration 紀錄

| 檔案 | 說明 | 日期 |
|------|------|------|
| `001_initial_auth_tables.sql` | 建立使用者資料同步表 (settings, todos, star_rewards) | 2025-01-30 |

## 注意事項

1. **依序執行**：Migration 必須按照序號順序執行
2. **冪等性**：使用 `IF NOT EXISTS` 確保重複執行不會出錯
3. **備份**：執行前建議先備份資料庫
4. **RLS**：所有表都啟用 Row Level Security，確保資料安全
