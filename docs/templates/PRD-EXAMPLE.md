# Speaking Clock v1.1.0 PRD (範例)

> 這是一個完整的 PRD 範例，展示如何正確使用 Ralph 並產生獨立的 commits

## Overview

解決 speaking-clock 專案的 14 個 GitHub issues：
- 4 個 Bug Fixes (#2, #3, #4, #5)
- 10 個 Features (#6-#15)

## Commit Strategy

**CRITICAL RULES - MUST FOLLOW:**

1. **ONE commit per user story** - 絕對不要把多個 US 合併成一個 commit
2. **Commit IMMEDIATELY** after each US passes verification
3. **Conventional Commit Format** - 見下方表格
4. **Before each commit**: `npm run build && npm run test:run`

## User Stories

| ID | Type | Issue | Description | Commit Message |
|----|------|-------|-------------|----------------|
| US-001 | fix | #2 | Timer missing announcements | `fix(timer): align with system clock (#2)` |
| US-002 | fix | #3 | voiceschanged event listener | `fix(voices): use addEventListener with cleanup (#3)` |
| US-003 | fix | #4 | useEffect dependency issue | `fix(hooks): split voice loading and restoration (#4)` |
| US-004 | fix | #5 | Wake Lock state sync | `fix(wakeLock): track user intent with ref (#5)` |
| US-005 | feat | #6 | Visual feedback during announcement | `feat(ui): add pulse animation during speech (#6)` |
| US-006 | feat | #7 | Display next announcement time | `feat(ui): show next announcement time in footer (#7)` |
| US-007 | feat | #8 | Voice loading state | `feat(ui): add voice loading indicator (#8)` |
| US-008 | feat | #9 | Dark mode toggle | `feat(ui): add dark mode with system preference (#9)` |
| US-009 | feat | #10 | Friendly voice names | `feat(ui): improve voice name display (#10)` |
| US-010 | feat | #11 | PWA install prompt | `feat(pwa): add install prompt banner (#11)` |
| US-011 | feat | #12 | Accessibility labels | `feat(a11y): add aria labels to controls (#12)` |
| US-012 | feat | #13 | Click clock to announce | `feat(ui): make clock clickable (#13)` |
| US-013 | feat | #14 | Interval selection visual | `feat(ui): add checkmark to selected interval (#14)` |
| US-014 | feat | #15 | Onboarding guide | `feat(ui): add onboarding overlay (#15)` |

## Execution Order

### Phase 1: Bug Fixes (優先)
1. US-001 → commit → push
2. US-002 → commit → push
3. US-003 → commit → push
4. US-004 → commit → push

### Phase 2: Core Features
5. US-005 → commit → push
6. US-006 → commit → push
7. US-007 → commit → push
8. US-008 → commit → push

### Phase 3: UX Improvements
9. US-009 → commit → push
10. US-010 → commit → push
11. US-011 → commit → push
12. US-012 → commit → push
13. US-013 → commit → push
14. US-014 → commit → push

## Workflow Per User Story

```
For each US:
1. Read relevant files
2. Implement changes
3. Run: npm run build
4. Run: npm run test:run
5. If pass:
   - git add <specific files>
   - git commit -m "<commit message from table>

     Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
6. If fail:
   - Fix issues
   - Go back to step 3
7. Move to next US
```

## Expected Git Log

After completion:
```
git log --oneline

abc0014 feat(ui): add onboarding overlay (#15)
abc0013 feat(ui): add checkmark to selected interval (#14)
abc0012 feat(ui): make clock clickable (#13)
abc0011 feat(a11y): add aria labels to controls (#12)
abc0010 feat(pwa): add install prompt banner (#11)
abc0009 feat(ui): improve voice name display (#10)
abc0008 feat(ui): add dark mode with system preference (#9)
abc0007 feat(ui): add voice loading indicator (#8)
abc0006 feat(ui): show next announcement time in footer (#7)
abc0005 feat(ui): add pulse animation during speech (#6)
abc0004 fix(wakeLock): track user intent with ref (#5)
abc0003 fix(hooks): split voice loading and restoration (#4)
abc0002 fix(voices): use addEventListener with cleanup (#3)
abc0001 fix(timer): align with system clock (#2)
```

## Release-Please Output

With this commit strategy, release-please will auto-generate:

```markdown
## Bug Fixes
* **timer**: align with system clock (#2)
* **voices**: use addEventListener with cleanup (#3)
* **hooks**: split voice loading and restoration (#4)
* **wakeLock**: track user intent with ref (#5)

## Features
* **ui**: add pulse animation during speech (#6)
* **ui**: show next announcement time in footer (#7)
* **ui**: add voice loading indicator (#8)
* **ui**: add dark mode with system preference (#9)
* **ui**: improve voice name display (#10)
* **pwa**: add install prompt banner (#11)
* **a11y**: add aria labels to controls (#12)
* **ui**: make clock clickable (#13)
* **ui**: add checkmark to selected interval (#14)
* **ui**: add onboarding overlay (#15)
```
