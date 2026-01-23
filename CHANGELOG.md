# Changelog

## [1.3.0](https://github.com/koshuang/speaking-clock/compare/v1.2.0...v1.3.0) (2026-01-23)


### Features

* **todo:** add icon picker for todo items ([c8e53dc](https://github.com/koshuang/speaking-clock/commit/c8e53dce32aaa7ce29538f4fbe3ab878ec635170)), closes [#24](https://github.com/koshuang/speaking-clock/issues/24)

## [1.2.0](https://github.com/koshuang/speaking-clock/compare/v1.1.1...v1.2.0) (2026-01-23)


### Features

* add todo reminder feature ([0634233](https://github.com/koshuang/speaking-clock/commit/0634233bbab178cb3d22d8f3e52ad11519c7bf49))

## [1.1.1](https://github.com/koshuang/speaking-clock/compare/v1.1.0...v1.1.1) (2026-01-22)


### Bug Fixes

* **ui:** prevent voice dropdown from jumping during scroll ([dd2929c](https://github.com/koshuang/speaking-clock/commit/dd2929c9605502c87c2b6f2f61b8b2068cd79dcf))
* **ui:** use popper position for voice dropdown ([#20](https://github.com/koshuang/speaking-clock/issues/20)) ([57b2374](https://github.com/koshuang/speaking-clock/commit/57b2374ca990247f6e145fa983a162ae8278cb93))


### Documentation

* add PRD templates for Ralph workflow ([9b4399e](https://github.com/koshuang/speaking-clock/commit/9b4399eb57a88a2b8f775dbf4342d8cea540bdf7))
* update CHANGELOG.md with detailed v1.1.0 notes ([1b01de5](https://github.com/koshuang/speaking-clock/commit/1b01de5c6f5c3d787511561ce7f2a08fca11d453))
* update documentation for v1.1.0 features ([dfe6b6b](https://github.com/koshuang/speaking-clock/commit/dfe6b6bf5d9fe0cda278c86e331606465296c06a))

## [1.1.0](https://github.com/koshuang/speaking-clock/compare/v1.0.0...v1.1.0) (2026-01-22)


### Bug Fixes

* **timer**: align with system clock for precise announcements ([#2](https://github.com/koshuang/speaking-clock/issues/2))
* **voices**: use addEventListener with proper cleanup for voiceschanged event ([#3](https://github.com/koshuang/speaking-clock/issues/3))
* **useEffect**: split voice loading and restoration into separate hooks ([#4](https://github.com/koshuang/speaking-clock/issues/4))
* **wakeLock**: track user intent with wantActiveRef for proper state sync ([#5](https://github.com/koshuang/speaking-clock/issues/5))


### Features

* **ui**: add visual feedback (pulse animation) during announcement ([#6](https://github.com/koshuang/speaking-clock/issues/6))
* **ui**: display next announcement time in footer ([#7](https://github.com/koshuang/speaking-clock/issues/7))
* **ui**: add voice loading state indicator ([#8](https://github.com/koshuang/speaking-clock/issues/8))
* **ui**: add dark mode toggle with light/dark/system options ([#9](https://github.com/koshuang/speaking-clock/issues/9))
* **ui**: improve voice name display with friendly region labels ([#10](https://github.com/koshuang/speaking-clock/issues/10))
* **pwa**: add install prompt banner ([#11](https://github.com/koshuang/speaking-clock/issues/11))
* **a11y**: add aria labels to all interactive controls ([#12](https://github.com/koshuang/speaking-clock/issues/12))
* **ui**: make clock clickable to trigger announcement ([#13](https://github.com/koshuang/speaking-clock/issues/13))
* **ui**: add checkmark to selected interval ([#14](https://github.com/koshuang/speaking-clock/issues/14))
* **ui**: add onboarding guide for new users ([#15](https://github.com/koshuang/speaking-clock/issues/15))

## 1.0.0 (2026-01-22)


### Features

* Integrate shadcn/ui and Tailwind CSS v4 ([143ed2c](https://github.com/koshuang/speaking-clock/commit/143ed2c6ae5c532705da8cf6aab49598a96ed956))


### Bug Fixes

* Persist voice selection to localStorage ([c714c2f](https://github.com/koshuang/speaking-clock/commit/c714c2fa701553a7ff80f06c58bd39ef17d2ea25))
