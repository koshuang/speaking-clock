# UI/UX 設計指南

## 1. 設計理念

### 1.1 核心原則

| 原則 | 說明 | 實踐方式 |
|------|------|----------|
| **兒童友善** | 目標用戶包含小朋友（尤其還不認識國字的） | 使用圖示輔助文字、大按鈕、明確視覺回饋 |
| **簡潔直覺** | 減少認知負擔，一眼就懂 | 避免複雜操作、功能分層明確 |
| **安全可靠** | 不會誤觸導致資料遺失 | 刪除需確認、自動儲存 |
| **無障礙優先** | 所有人都能使用 | ARIA 標籤、足夠對比度、鍵盤支援 |

### 1.2 目標用戶

```
┌─────────────────────────────────────────────────┐
│  主要用戶                                        │
│  ├── 小朋友（3-10歲）- 待辦提醒功能              │
│  │   └── 特點：不識字、需圖示輔助、手指較小      │
│  ├── 家長 - 設定與管理                          │
│  │   └── 特點：需快速設定、希望簡單易用          │
│  └── 視障用戶 - 語音報時功能                    │
│      └── 特點：依賴語音、需螢幕閱讀器支援        │
└─────────────────────────────────────────────────┘
```

---

## 2. 色彩系統

### 2.1 語意化色彩

使用 CSS 變數定義，支援深色模式自動切換。

| 變數 | 用途 | 淺色模式 | 深色模式 |
|------|------|----------|----------|
| `--primary` | 主要操作、品牌色 | 藍色 (oklch 0.51 0.15 250) | 淺藍色 |
| `--secondary` | 次要操作 | 淺灰藍 | 深灰 |
| `--destructive` | 危險操作（刪除） | 紅色 | 淺紅色 |
| `--muted` | 輔助說明文字 | 灰色 | 淺灰色 |
| `--background` | 頁面背景 | 白色 | 深灰色 |
| `--card` | 卡片背景 | 白色 | 深灰色 |

### 2.2 色彩使用規範

```
DO ✅
├── 使用 primary 作為主要 CTA 按鈕
├── 使用 destructive 標示刪除按鈕
├── 高亮項目使用 primary/10 背景 + primary border
└── 已完成項目降低透明度 (opacity-60)

DON'T ❌
├── 不要使用純紅色作為裝飾色
├── 不要使用低對比度文字
└── 不要混用過多色彩（最多 3 種）
```

### 2.3 狀態色彩

| 狀態 | 樣式 | 範例 |
|------|------|------|
| 預設 | `border-border` | 一般待辦項目 |
| 高亮/下一個 | `border-primary bg-primary/10` | 下一個待辦提醒 |
| 已選中 | `ring-2 ring-primary` | 已選擇的圖示 |
| 已完成 | `opacity-60 line-through` | 已完成的待辦 |
| 播報中 | `animate-pulse ring-4 ring-primary/50` | 正在報時 |

---

## 3. 字型系統

### 3.1 字型大小

| 用途 | 類別 | 大小 | 範例 |
|------|------|------|------|
| 大標題 | `text-2xl` | 24px | 頁面標題「語音報時器」 |
| 時鐘數字 | `text-5xl font-mono` | 48px | 時間顯示 |
| 區塊標題 | `text-lg font-semibold` | 18px | 「待辦提醒」 |
| 正文 | `text-sm` | 14px | 待辦文字、按鈕文字 |
| 輔助說明 | `text-xs text-muted-foreground` | 12px | 「報時後會語音提醒...」 |

### 3.2 字型權重

```css
font-normal   /* 400 - 正文 */
font-medium   /* 500 - 標籤文字 */
font-semibold /* 600 - 區塊標題 */
font-bold     /* 700 - 主標題、時鐘 */
```

---

## 4. 間距系統

### 4.1 間距規範

基於 4px 網格系統（Tailwind 預設）：

| 間距 | 數值 | 用途 |
|------|------|------|
| `gap-1` | 4px | 緊密元素間距（按鈕群組內） |
| `gap-2` | 8px | 相關元素間距（表單項目） |
| `p-2` | 8px | 小元素內距（待辦項目） |
| `space-y-4` | 16px | 區塊內項目間距 |
| `space-y-6` | 24px | 卡片區塊間距 |
| `p-4` | 16px | 頁面邊距 |

### 4.2 佈局結構

```
┌─────────────────────────────────────┐
│ Header (pt-4)                       │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Card (space-y-6)                │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ CardContent (space-y-6)     │ │ │
│ │ │  ├── Control Group 1        │ │ │
│ │ │  │   (space-y-2)            │ │ │
│ │ │  ├── Control Group 2        │ │ │
│ │ │  └── Button                 │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Footer (pb-4)                       │
└─────────────────────────────────────┘
     max-w-md mx-auto
```

---

## 5. 元件規範

### 5.1 按鈕 (Button)

| 類型 | 變體 | 用途 | 範例 |
|------|------|------|------|
| 主要 CTA | `default` | 主要操作 | 「立即報時」「開始使用」 |
| 次要 | `outline` | 次要操作 | Toggle 按鈕 |
| 幽靈 | `ghost` | 輔助操作 | 編輯、刪除圖示按鈕 |
| 危險 | `ghost + text-destructive` | 刪除操作 | 刪除待辦 |
| 圖示 | `size="icon"` | 純圖示按鈕 | +、✏️、🗑️ |

**觸控目標尺寸**：
- 最小 `h-8 w-8` (32px)
- 建議 `h-10 w-10` (40px) 或更大

### 5.2 卡片 (Card)

```tsx
// 一般卡片
<Card>
  <CardContent className="space-y-6">
    {/* 內容 */}
  </CardContent>
</Card>

// 高亮卡片（時鐘）
<Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">

// 狀態卡片（播報中）
<Card className={isSpeaking ? 'animate-pulse ring-4 ring-primary/50' : ''}>
```

### 5.3 表單元件

| 元件 | 用途 | 注意事項 |
|------|------|----------|
| `Input` | 文字輸入 | 必須有 `aria-label` |
| `Checkbox` | 勾選狀態 | 點擊區域要夠大 |
| `Toggle` | 開關狀態 | 顯示目前狀態文字 |
| `Select` | 下拉選擇 | 使用 `position="popper"` 避免跳動 |
| `DropdownMenu` | 更多選項 | 使用 `collisionPadding` 避免超界 |

### 5.4 待辦項目 (TodoItem)

```
┌─────────────────────────────────────────────────┐
│ ⋮⋮  ☐  🎒  上學 (下次提醒)           ✏️   🗑️  │
│  │   │   │    │       │               │     │   │
│  │   │   │    │       │               │     └── 刪除 (h-8 w-8, destructive)
│  │   │   │    │       │               └──────── 編輯 (h-8 w-8, ghost)
│  │   │   │    │       └──────────────────────── 狀態標籤 (text-xs text-primary)
│  │   │   │    └──────────────────────────────── 待辦文字 (text-sm, flex-1)
│  │   │   └───────────────────────────────────── 圖示 (w-[18px], primary)
│  │   └───────────────────────────────────────── Checkbox
│  └───────────────────────────────────────────── 拖曳把手 (cursor-grab)
└─────────────────────────────────────────────────┘
```

**狀態變化**：
- 預設：`border-border`
- 下一個：`border-primary bg-primary/10`
- 已完成：`opacity-60` + 文字 `line-through text-muted-foreground`
- 拖曳中：`opacity-50`

---

## 6. 圖示系統

### 6.1 圖示來源

使用 **lucide-react** 圖示庫，統一風格。

### 6.2 圖示尺寸

| 用途 | 大小 | 範例 |
|------|------|------|
| 按鈕內圖示 | `h-4 w-4` (16px) | + 新增、✓ 確認 |
| 小按鈕內 | `h-3 w-3` (12px) | 編輯、刪除 |
| 待辦圖示 | `18px` | 🎒 上學、📖 讀書 |
| 圖示選擇器 | `18px` | 選擇器內的圖示 |
| 標題圖示 | `h-5 w-5` (20px) | 區塊標題前 |

### 6.3 待辦圖示分類

為兒童設計，分 13 類、60+ 圖示：

| 分類 | 中文 | 代表圖示 |
|------|------|----------|
| school | 上學 | Backpack, Bus, School |
| learning | 學習 | Pencil, Calculator, Ruler |
| art | 美術 | Palette, Scissors, Brush |
| science | 科學 | FlaskConical, Globe, Microscope |
| music | 音樂 | Music, Piano, Headphones |
| sports | 運動 | Bike, Trophy, Dumbbell |
| life | 生活 | Bath, Bed, Shirt, Alarm |
| food | 飲食 | Apple, Coffee, Utensils |
| play | 玩樂 | Gamepad2, Tv, Puzzle |
| pets | 寵物 | Dog, Cat, Fish |
| outdoor | 戶外 | Trees, Flower2, Cloud |
| cleaning | 清潔 | Trash2, Sparkles |
| general | 其他 | Star, Heart, Clock, Bell |

---

## 7. 無障礙設計

### 7.1 ARIA 標籤

**所有互動元素必須有 `aria-label`**：

```tsx
// ✅ 正確
<Button aria-label="新增待辦事項">
  <Plus className="h-4 w-4" />
</Button>

// ❌ 錯誤
<Button>
  <Plus className="h-4 w-4" />
</Button>
```

### 7.2 鍵盤支援

| 元件 | 鍵盤操作 |
|------|----------|
| 時鐘卡片 | Enter / Space 觸發報時 |
| 待辦輸入 | Enter 送出 |
| 編輯模式 | Enter 儲存、Escape 取消 |
| Checkbox | Space 切換 |
| DropdownMenu | Arrow keys 導航、Enter 選擇 |

### 7.3 對比度

- 正文：至少 4.5:1 對比度
- 大字（18px+）：至少 3:1 對比度
- 使用 oklch 色彩空間確保深淺模式都有足夠對比

---

## 8. 動畫與回饋

### 8.1 動畫類型

| 動畫 | 用途 | 實作 |
|------|------|------|
| 脈動 | 正在報時 | `animate-pulse` |
| 縮放 | 點擊回饋 | `active:scale-[0.99]` |
| 淡入 | 下拉選單 | `animate-in fade-in-0` |
| 透明度 | 拖曳中 | `opacity-50` |

### 8.2 轉場時間

```css
transition-shadow  /* hover 陰影變化 */
transition         /* 預設 150ms */
```

### 8.3 視覺回饋

| 操作 | 回饋 |
|------|------|
| 報時中 | 時鐘卡片 `animate-pulse` + `ring-4` |
| 提醒中 | 待辦卡片 `animate-pulse` + `ring-2` |
| hover | `hover:shadow-lg`（時鐘卡片） |
| 選中圖示 | `ring-2 ring-primary` |
| 下一個待辦 | 高亮背景 + 「(下次提醒)」標籤 |

---

## 9. 響應式設計

### 9.1 斷點

專案為行動優先設計，使用單一欄位佈局：

```
max-w-md (448px) - 固定最大寬度
mx-auto - 置中
p-4 - 頁面邊距 16px
```

### 9.2 觸控優化

| 項目 | 規範 |
|------|------|
| 最小觸控目標 | 44×44px（Apple HIG 建議） |
| 按鈕間距 | 至少 8px (`gap-2`) |
| 拖曳把手 | 足夠大的觸控區域 |
| 下拉選單 | `collisionPadding={8}` 避免超界 |

### 9.3 橫向滾動

分類標籤過多時使用水平滾動：

```tsx
<div className="overflow-x-auto scrollbar-thin">
  <div className="flex gap-1 min-w-max">
    {/* 標籤 */}
  </div>
</div>
```

---

## 10. 設計檢查清單

### 新增功能時

- [ ] 按鈕有 `aria-label`
- [ ] 觸控目標 ≥ 44×44px
- [ ] 有適當的 hover/active 狀態
- [ ] 支援深色模式
- [ ] 使用語意化色彩變數
- [ ] 對齊間距系統 (4px 倍數)

### 新增圖示時

- [ ] 使用 lucide-react 圖示
- [ ] 圖示大小符合規範
- [ ] 有 `aria-label` 或配合文字
- [ ] 顏色使用 `text-primary` 或 `text-muted-foreground`

### 新增表單時

- [ ] Input 有 placeholder 和 aria-label
- [ ] 支援 Enter 送出
- [ ] 支援 Escape 取消（編輯模式）
- [ ] 錯誤狀態清晰可見
- [ ] 禁用狀態視覺明確

---

## 附錄：快速參考

### 常用 Tailwind 類別

```css
/* 佈局 */
.flex .items-center .justify-between .gap-2 .space-y-4

/* 尺寸 */
.h-8 .w-8 .h-10 .w-10 .max-w-md .flex-1

/* 色彩 */
.text-primary .text-muted-foreground .text-destructive
.bg-primary .bg-primary/10 .bg-muted/30

/* 邊框 */
.border .border-border .border-primary .rounded-md

/* 狀態 */
.opacity-60 .line-through .cursor-grab .cursor-pointer

/* 動畫 */
.animate-pulse .transition-shadow .hover:shadow-lg
```

### 元件導入

```tsx
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Toggle } from '@/presentation/components/ui/toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/presentation/components/ui/dropdown-menu'
```
