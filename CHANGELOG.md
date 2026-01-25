# Changelog

所有重要變更都會記錄在此文件中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [1.4.0](https://github.com/koshuang/speaking-clock/compare/v1.3.0...v1.4.0) (2026-01-25)


### Features

* **todo:** add task timer with voice announcements ([d001587](https://github.com/koshuang/speaking-clock/commit/d001587d54c75735dcce01c7359044bf99961e34)), closes [#28](https://github.com/koshuang/speaking-clock/issues/28)


### Bug Fixes

* **todo:** pass icon parameter in TodoList onUpdate prop ([8825eb1](https://github.com/koshuang/speaking-clock/commit/8825eb1983a3d1be8b2069006c3e08b39c337cdf)), closes [#26](https://github.com/koshuang/speaking-clock/issues/26)
* **ui:** add icon placeholder for consistent text alignment ([7727db4](https://github.com/koshuang/speaking-clock/commit/7727db4db20c71367a8b6dfd1d52158167a66d40))
* **ui:** improve IconPicker UX with scroll and tooltip ([fc4f154](https://github.com/koshuang/speaking-clock/commit/fc4f154cc5bbe88840334ac2798412fd85e27b9a))


### Documentation

* add task timer feature documentation ([2ea40a8](https://github.com/koshuang/speaking-clock/commit/2ea40a83cafacf3f631c244b14f823e253879b60))
* add UI/UX design guide ([8639701](https://github.com/koshuang/speaking-clock/commit/863970148fc3f4aeaa9fb50e56d807007431ef9f))
* refactor README and add CHANGELOG ([c731fc9](https://github.com/koshuang/speaking-clock/commit/c731fc9f2fa6b89a6df12e11b1d9409505812d65))

## [Unreleased]

## [1.3.0] - 2024-XX-XX

### Added
- 待辦項目圖示選擇功能（60+ 圖示、13 類別）
- 圖示分類：上學、學習、美術、科學、音樂、運動、生活、飲食、玩樂、寵物、戶外、清潔、其他
- UI/UX 設計指南文件

### Fixed
- 修復編輯待辦時圖示無法保存的問題
- 修復有/無圖示的待辦項目文字對齊問題
- 改善圖示選擇器在小螢幕的顯示（水平滾動）
- 新增圖示按鈕 tooltip 提示

## [1.2.0] - 2024-XX-XX

### Added
- **待辦提醒功能** - 報時後語音提醒待辦事項
- 待辦事項 CRUD（新增、編輯、刪除）
- 拖曳排序調整優先級
- 完成標記與自動切換
- 視覺提示高亮下一個待辦

## [1.1.1] - 2024-XX-XX

### Fixed
- 修復語音下拉選單在滾動時跳動的問題

## [1.1.0] - 2024-XX-XX

### Added
- **深色模式** - 支援淺色/深色/系統主題切換
- 報時時時鐘卡片脈動動畫
- 頁尾顯示下次報時時間
- 點擊時鐘觸發報時
- PWA 安裝提示橫幅
- 無障礙支援（ARIA 標籤、鍵盤操作）
- 首次使用新手導覽

## [1.0.0] - 2024-XX-XX

### Added
- 即時時鐘顯示（每秒更新）
- 定時語音報時（1/5/10/15/30/60 分鐘間隔）
- Web Speech API 中文語音合成
- 時段智慧判斷（凌晨/上午/下午/晚上）
- Screen Wake Lock 螢幕常亮
- PWA 支援（可安裝、離線使用）
- 設定自動保存（localStorage）
