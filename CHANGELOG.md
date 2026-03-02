# Changelog

所有重要變更都會記錄在此文件中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [1.16.1](https://github.com/koshuang/speaking-clock/compare/v1.16.0...v1.16.1) (2026-03-02)


### Bug Fixes

* **deps:** update dependency @supabase/supabase-js to v2.95.2 ([#71](https://github.com/koshuang/speaking-clock/issues/71)) ([d34ecea](https://github.com/koshuang/speaking-clock/commit/d34ecea146d9d7281ada5226f13a5bcf756e60d9))
* **deps:** update dependency @supabase/supabase-js to v2.95.3 ([#75](https://github.com/koshuang/speaking-clock/issues/75)) ([2ffb6df](https://github.com/koshuang/speaking-clock/commit/2ffb6dfb749fcb142f323bbdb644920f253f8c07))
* **deps:** update dependency @supabase/supabase-js to v2.96.0 ([#84](https://github.com/koshuang/speaking-clock/issues/84)) ([373a737](https://github.com/koshuang/speaking-clock/commit/373a737ebe9523b14012965d7cf8b691dffa433f))
* **deps:** update dependency @supabase/supabase-js to v2.97.0 ([#86](https://github.com/koshuang/speaking-clock/issues/86)) ([6e5e431](https://github.com/koshuang/speaking-clock/commit/6e5e43178732cbaecab08202b756eb44a2f6359c))
* **deps:** update dependency @supabase/supabase-js to v2.98.0 ([#93](https://github.com/koshuang/speaking-clock/issues/93)) ([3ebbbc0](https://github.com/koshuang/speaking-clock/commit/3ebbbc060dfd88294a67428ec46ab00f0fd4b408))
* **deps:** update dependency lucide-react to v0.564.0 ([#82](https://github.com/koshuang/speaking-clock/issues/82)) ([e5f8055](https://github.com/koshuang/speaking-clock/commit/e5f80557d935fef6503eaea4255484479e93c574))
* **deps:** update dependency lucide-react to v0.574.0 ([#85](https://github.com/koshuang/speaking-clock/issues/85)) ([90c1772](https://github.com/koshuang/speaking-clock/commit/90c1772d10c052beb62422d1cf484b5d65d96fdd))
* **deps:** update dependency lucide-react to v0.575.0 ([#88](https://github.com/koshuang/speaking-clock/issues/88)) ([1bd3115](https://github.com/koshuang/speaking-clock/commit/1bd3115cc3d473d7de2dec289fd9d10908427399))
* **deps:** update dependency tailwind-merge to v3.4.1 ([#81](https://github.com/koshuang/speaking-clock/issues/81)) ([0427e9f](https://github.com/koshuang/speaking-clock/commit/0427e9f617c9b5ad46260b7dc22f98bbfbc23ece))
* **deps:** update tailwind css ([#87](https://github.com/koshuang/speaking-clock/issues/87)) ([b86660e](https://github.com/koshuang/speaking-clock/commit/b86660ed998e68d39a6e5b27df3a3ae126152ad1))
* **deps:** update tailwind css to v4.2.1 ([#91](https://github.com/koshuang/speaking-clock/issues/91)) ([fc105f9](https://github.com/koshuang/speaking-clock/commit/fc105f9a6033997c31b8e7c0d38b1c53df8514a7))

## [1.16.0](https://github.com/koshuang/speaking-clock/compare/v1.15.0...v1.16.0) (2026-02-05)


### Features

* **sync:** enable Supabase Realtime for multi-device sync ([e259bab](https://github.com/koshuang/speaking-clock/commit/e259bab37470c682df66ad772cfc576a2590d5a5))


### Documentation

* **prd:** add realtime sync feature to PRD ([98635e5](https://github.com/koshuang/speaking-clock/commit/98635e52fbdef4a9b88dc37e175611527fdc7b21))

## [1.15.0](https://github.com/koshuang/speaking-clock/compare/v1.14.0...v1.15.0) (2026-02-05)


### Features

* **todo:** add task deadline and elapsed time tracking ([b9d9bdd](https://github.com/koshuang/speaking-clock/commit/b9d9bdd94bc541309308659982b6775dad49e97d))


### Bug Fixes

* **deps:** update dependency @supabase/supabase-js to v2.94.1 ([#67](https://github.com/koshuang/speaking-clock/issues/67)) ([a1ab2d2](https://github.com/koshuang/speaking-clock/commit/a1ab2d2b29ffcf8ce16b43b3a5da80daad901045))
* **sync:** correct data structure parsing in realtime sync ([74f506f](https://github.com/koshuang/speaking-clock/commit/74f506fd4752efb7526f938a13b4ba5d60d9b7e4))

## [1.14.0](https://github.com/koshuang/speaking-clock/compare/v1.13.2...v1.14.0) (2026-02-05)


### Features

* **sync:** add Supabase Realtime for cross-browser sync ([c84e85e](https://github.com/koshuang/speaking-clock/commit/c84e85e2efe6432dbc9170c1130306fae72c1436))


### Bug Fixes

* **stars:** unify star state between hooks to fix non-timer task rewards ([f7bbb8a](https://github.com/koshuang/speaking-clock/commit/f7bbb8af182b6284d850dbf74de09ce0fd657882))
* **sync:** correct callback types in useRealtimeSync ([5aa2d11](https://github.com/koshuang/speaking-clock/commit/5aa2d1100270e5b648803c36bd75932a5f17c38f))
* **timer:** remind to complete when task time expires instead of re-announcing ([4b97ed5](https://github.com/koshuang/speaking-clock/commit/4b97ed54b75b2982062dc7911652bc51053302f4))

## [1.13.2](https://github.com/koshuang/speaking-clock/compare/v1.13.1...v1.13.2) (2026-02-04)


### Bug Fixes

* **sync:** prevent star rewards data loss during cross-device sync ([3eeba8a](https://github.com/koshuang/speaking-clock/commit/3eeba8afa8fbe0282c72ba2dd15700e76468808c))


### Code Refactoring

* **task:** implement Clean Architecture for task completion ([c912d5e](https://github.com/koshuang/speaking-clock/commit/c912d5e4dce3e4ed772f4335b756fd38203f9158))

## [1.13.1](https://github.com/koshuang/speaking-clock/compare/v1.13.0...v1.13.1) (2026-02-04)


### Bug Fixes

* **deps:** update dependency @supabase/supabase-js to v2.94.0 ([#61](https://github.com/koshuang/speaking-clock/issues/61)) ([949bd36](https://github.com/koshuang/speaking-clock/commit/949bd36e0fe9a7b4e910fce9ab3eb0875708ecb2))
* **task:** improve timer and goal announcement behavior ([996bb9f](https://github.com/koshuang/speaking-clock/commit/996bb9f9f9d238fecaf8b1f8c86f26365a65a00f))

## [1.13.0](https://github.com/koshuang/speaking-clock/compare/v1.12.3...v1.13.0) (2026-02-03)


### Features

* add ultimate goal feature with Supabase sync ([93295d9](https://github.com/koshuang/speaking-clock/commit/93295d97891096173e4dc067dfcb718fac067f54))


### Bug Fixes

* **deps:** update react ([#53](https://github.com/koshuang/speaking-clock/issues/53)) ([7b5cd5c](https://github.com/koshuang/speaking-clock/commit/7b5cd5c721d723813779f2614c99417ac4c4190c))
* **ui:** ensure avatar is perfectly circular ([ef45af1](https://github.com/koshuang/speaking-clock/commit/ef45af13947082dc6ed2830265b31e8a79bf4a01))

## [1.12.3](https://github.com/koshuang/speaking-clock/compare/v1.12.2...v1.12.3) (2026-02-01)


### Bug Fixes

* **auth:** use correct redirect URL for GitHub Pages ([894242b](https://github.com/koshuang/speaking-clock/commit/894242b0076f1c34aac0750f1112c56e57e6efed))
* **deps:** update dependency @supabase/supabase-js to v2.93.3 ([#52](https://github.com/koshuang/speaking-clock/issues/52)) ([a1bd5a2](https://github.com/koshuang/speaking-clock/commit/a1bd5a25615ee20440415a43d03b37ca16476477))

## [1.12.2](https://github.com/koshuang/speaking-clock/compare/v1.12.1...v1.12.2) (2026-02-01)


### Bug Fixes

* use manual time formatting for consistent behavior ([bbd1dda](https://github.com/koshuang/speaking-clock/commit/bbd1ddac494e578ff2a5c821406ed6fcea2acd05))

## [1.12.1](https://github.com/koshuang/speaking-clock/compare/v1.12.0...v1.12.1) (2026-02-01)


### Bug Fixes

* **deps:** pin dependencies ([f479b16](https://github.com/koshuang/speaking-clock/commit/f479b16a7a895853a88e04245edbca95010cc513))
* **deps:** pin dependencies ([9c4554a](https://github.com/koshuang/speaking-clock/commit/9c4554a93805034f224d140ff3af34a7ffea1f0f))
* **deps:** pin dependencies ([8773214](https://github.com/koshuang/speaking-clock/commit/8773214aa406376eaa2de720e90e65a6fe85c116))
* **deps:** pin dependencies ([5d06082](https://github.com/koshuang/speaking-clock/commit/5d06082e97f7761e96c2966034e7ff2c5f16f617))
* **deps:** pin dependencies ([6250305](https://github.com/koshuang/speaking-clock/commit/62503051fee7afff232c3429da41ecb9a1b8d854))
* **deps:** pin dependencies ([4bbf465](https://github.com/koshuang/speaking-clock/commit/4bbf465794be906f28343b7e1ac5b9d7b35d06d7))
* **deps:** update dependency lucide-react to ^0.563.0 ([21dde27](https://github.com/koshuang/speaking-clock/commit/21dde27c34897b89951086ee6fca9d2565669ffe))
* **deps:** update dependency lucide-react to ^0.563.0 ([5531168](https://github.com/koshuang/speaking-clock/commit/5531168b7e7770e0c1db9e07699fa3a0532b55a9))
* ensure consistent midnight format across locales ([69c12a3](https://github.com/koshuang/speaking-clock/commit/69c12a3accdd08e967eacde8145747c1038f1329))

## [1.12.0](https://github.com/koshuang/speaking-clock/compare/v1.11.0...v1.12.0) (2026-02-01)


### Features

* **auth:** add Supabase authentication and cloud sync ([1a332d1](https://github.com/koshuang/speaking-clock/commit/1a332d18d2d394abdcd33a8638b11a9ec48e9b2b))
* **ci:** add CI workflow and IaC infrastructure ([ed54ea1](https://github.com/koshuang/speaking-clock/commit/ed54ea1dab527faed4df64ef48ca646752be31ce))


### Bug Fixes

* resolve all ESLint errors and warnings ([a39e701](https://github.com/koshuang/speaking-clock/commit/a39e701ecc963a59d6979916d8b9f626d2c7904f))


### Documentation

* add AI-assisted development guide ([b80a7c5](https://github.com/koshuang/speaking-clock/commit/b80a7c511cb8cf933927288ccc918de26a684b7b))

## [1.11.0](https://github.com/koshuang/speaking-clock/compare/v1.10.0...v1.11.0) (2026-01-28)


### Features

* **gamification:** add star rewards system ([c547287](https://github.com/koshuang/speaking-clock/commit/c547287148cd927f7eb54af689bc598f7da0a4e3))

## [1.10.0](https://github.com/koshuang/speaking-clock/compare/v1.9.0...v1.10.0) (2026-01-26)


### Features

* add Google Analytics tracking ([e15c74c](https://github.com/koshuang/speaking-clock/commit/e15c74caa7da4a41aea66885151f2b9050249446))

## [1.9.0](https://github.com/koshuang/speaking-clock/compare/v1.8.0...v1.9.0) (2026-01-25)


### Features

* **child-mode:** add protagonist name and adjust speech rate ([e496fad](https://github.com/koshuang/speaking-clock/commit/e496fad72eb56a39c513a2e1ead7aabe3903731b))


### Documentation

* Add new persona documents and update README/PRD ([dfe9042](https://github.com/koshuang/speaking-clock/commit/dfe9042eee6d0a68c6d346adaf9a571a8ffc321e))

## [1.8.0](https://github.com/koshuang/speaking-clock/compare/v1.7.0...v1.8.0) (2026-01-25)


### Features

* **child-mode:** add child-friendly features for first-grade students ([32b3cce](https://github.com/koshuang/speaking-clock/commit/32b3ccef4376ae4fa6a4ea9ed00041f83d529866))

## [1.7.0](https://github.com/koshuang/speaking-clock/compare/v1.6.1...v1.7.0) (2026-01-25)


### Features

* **ui:** add custom interval and duration options ([ca798ad](https://github.com/koshuang/speaking-clock/commit/ca798ad798c102309d91942209a3e1a0c82fd036))


### Code Refactoring

* **domain:** extract display formatting, voice selection, and announcement trigger ([a53c5de](https://github.com/koshuang/speaking-clock/commit/a53c5de2ee8cf3dfec915c37481fa069675a7b16))
* **domain:** extract options and post-announcement logic to use cases ([8fccdae](https://github.com/koshuang/speaking-clock/commit/8fccdae647e7963eee8cbb688e20a485ce107d51))

## [1.6.1](https://github.com/koshuang/speaking-clock/compare/v1.6.0...v1.6.1) (2026-01-25)


### Code Refactoring

* **domain:** extract AnnouncementScheduler use case ([bf83c2f](https://github.com/koshuang/speaking-clock/commit/bf83c2f3a9490b04e562f3237f83f77fb5f7b6be))

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
