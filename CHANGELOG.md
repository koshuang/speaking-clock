# Changelog

所有重要變更都會記錄在此文件中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [1.6.0](https://github.com/koshuang/speaking-clock/compare/v1.5.0...v1.6.0) (2026-01-25)


### Features

* **ui:** show active task on clock homepage ([840d722](https://github.com/koshuang/speaking-clock/commit/840d7228c1aef8fc8d239dee7231fdc3e2f537a0))
* **ui:** show next todo on clock homepage even before starting ([8110f45](https://github.com/koshuang/speaking-clock/commit/8110f458767ce374a59b277e7723cbf236777168))


### Bug Fixes

* **task:** mark todo completed when manually completing task ([bb25c16](https://github.com/koshuang/speaking-clock/commit/bb25c169cc83e9595ceb90e763ac9d38ea78788e))

## [1.5.0](https://github.com/koshuang/speaking-clock/compare/v1.4.0...v1.5.0) (2026-01-25)


### Features

* **ui:** add bottom tab navigation for mobile UX ([daeb02f](https://github.com/koshuang/speaking-clock/commit/daeb02f84a92eac356ebe8e97f2abd6cbb643d2c))


### Bug Fixes

* **ui:** fix DurationPicker click not working in compact mode ([294151b](https://github.com/koshuang/speaking-clock/commit/294151bd51162bf6d7dbd690cff94666d527222d))
* **ui:** further reduce clock padding and fix next announcement time ([c5f1d57](https://github.com/koshuang/speaking-clock/commit/c5f1d57706e02119d835502fcc993cff014f2b7f))
* **ui:** move announcement toggle to clock tab homepage ([6c94dd1](https://github.com/koshuang/speaking-clock/commit/6c94dd146c4b5ef237df0dec41281a322e4ea607))
* **ui:** optimize todo list spacing for mobile ([3ca19c8](https://github.com/koshuang/speaking-clock/commit/3ca19c897f93c18d5741ed9853cca2163654227b))
* **ui:** reduce Card component default padding ([013c296](https://github.com/koshuang/speaking-clock/commit/013c2963686ec4cc4c7ed730a50b658a055b9365))
* **ui:** reduce clock card height ([c01ecbc](https://github.com/koshuang/speaking-clock/commit/c01ecbca187f284953df3d3f7e561fac31f1613b))
* **ui:** reduce clock card padding further ([cf2de13](https://github.com/koshuang/speaking-clock/commit/cf2de13c27f6662aee36d07cfeaa2331647421db))
* **ui:** reduce clock card size for more content space ([230c0ff](https://github.com/koshuang/speaking-clock/commit/230c0fff76c70a7aaf1cf5446adb5f29f2274fc3))
* **ui:** reduce container padding for more content space ([09cd9f0](https://github.com/koshuang/speaking-clock/commit/09cd9f001af2ff9e80317b1d7ba6ccbb9c9e3630))

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
