# Supabase 設定指南

本文件說明如何設定 Supabase 以啟用雲端同步功能。

## 目錄

- [快速開始](#快速開始)
- [Supabase 專案設定](#supabase-專案設定)
- [本地開發設定](#本地開發設定)
- [GitHub Pages 部署設定](#github-pages-部署設定)
- [資料庫 Migration](#資料庫-migration)
- [開發模式設定](#開發模式設定)
- [疑難排解](#疑難排解)

---

## 快速開始

1. 建立 [Supabase](https://supabase.com/) 專案
2. 設定環境變數
3. 執行資料庫 Migration
4. 設定 Google OAuth（可選）

---

## Supabase 專案設定

### 1. 建立專案

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 點擊 **New Project**
3. 填寫專案名稱和資料庫密碼
4. 選擇區域（建議選擇離用戶近的區域）

### 2. 取得 API Keys

1. 進入專案 → **Settings → API**
2. 複製以下資訊：
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **Publishable key** (anon public): `eyJhbGci...`

> ⚠️ **注意**：Publishable key 是公開的，會嵌入前端程式碼。這是正常的，Supabase 使用 Row Level Security (RLS) 保護資料。

### 3. 設定 URL Configuration

進入 **Authentication → URL Configuration**：

| 設定 | 本地開發 | 正式環境 |
|------|----------|----------|
| Site URL | `http://localhost:5173` | `https://your-domain.com` |
| Redirect URLs | `http://localhost:5173` | `https://your-domain.com` |

---

## 本地開發設定

### 1. 建立環境變數檔案

```bash
cp .env.example .env.local
```

### 2. 填入 Supabase credentials

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

---

## GitHub Pages 部署設定

### 1. 設定 GitHub Secrets

在 GitHub repo → **Settings → Secrets and variables → Actions** 新增：

| Secret Name | Value |
|-------------|-------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-publishable-key` |

### 2. 更新 Supabase URL Configuration

在 Supabase Dashboard → **Authentication → URL Configuration**：

| 設定 | 值 |
|------|-----|
| Site URL | `https://username.github.io/repo-name` |
| Redirect URLs | 加入 `https://username.github.io/repo-name` |

---

## 資料庫 Migration

### 執行 Migration

1. 進入 Supabase Dashboard → **SQL Editor**
2. 依序執行 `supabase/migrations/` 資料夾中的 SQL 檔案

目前的 Migration：

| 檔案 | 說明 |
|------|------|
| `001_initial_auth_tables.sql` | 建立使用者資料同步表 |

### Migration 內容

初始 Migration 會建立以下表格：

- `user_settings` - 使用者設定
- `user_todos` - 待辦清單
- `user_star_rewards` - 星星獎勵

所有表格都啟用 Row Level Security (RLS)，確保使用者只能存取自己的資料。

---

## 開發模式設定

### 關閉 Email 確認（推薦開發時使用）

預設 Supabase 會要求 email 確認。開發時可關閉：

1. **Authentication → Providers → Email**
2. 關閉 **Confirm email**

這樣可以用任意 email 註冊，不需收確認信。

> ⚠️ **正式上線前記得開啟！**

### 測試帳號

開發時可使用以下方式建立測試帳號：

1. 使用真實 email（會收到確認信）
2. 關閉 email 確認後，使用任意格式正確的 email
3. 使用 Google OAuth 登入

---

## Google OAuth 設定

### 1. Google Cloud Console

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立或選擇專案
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
4. Application type: **Web application**
5. 設定 Authorized redirect URIs：
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
6. 複製 **Client ID** 和 **Client Secret**

### 2. Supabase 設定

1. **Authentication → Providers → Google**
2. 啟用 Google
3. 填入：
   - Client ID
   - Client Secret
4. 儲存

---

## 疑難排解

### Email 註冊失敗：`email_address_invalid`

**原因**：Supabase 會驗證 email 格式和域名，拒絕明顯無效的 email（如 `test@test.com`）。

**解決方案**：
1. 使用真實 email
2. 關閉 email 確認（開發用）
3. 使用 Google OAuth

### 登入後資料沒有同步

**檢查項目**：
1. 確認已執行資料庫 Migration
2. 檢查瀏覽器 Console 是否有錯誤訊息
3. 確認 Supabase 的 RLS 政策正確設定

### Google 登入失敗

**檢查項目**：
1. 確認 Google OAuth Client ID 和 Secret 正確
2. 確認 Redirect URI 設定正確
3. 確認 Supabase URL Configuration 包含你的網站 URL

### CORS 錯誤

**原因**：網站 URL 未加入 Supabase 的允許清單。

**解決方案**：在 **Authentication → URL Configuration → Redirect URLs** 加入你的網站 URL。

---

## 相關文件

- [Supabase 官方文件](https://supabase.com/docs)
- [Supabase Auth 文件](https://supabase.com/docs/guides/auth)
- [專案 Migration 檔案](../supabase/migrations/)
