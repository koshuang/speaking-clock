# PRD Template for Ralph

> **使用方式**: 複製此範本到 `.omc/prd.md` 並填寫內容
>
> `.omc/` 是本地工作目錄（已 gitignore），不會被 commit

```bash
# 複製範本
cp docs/templates/PRD-TEMPLATE.md .omc/prd.md

# 編輯填寫內容後，啟動 Ralph
/ralph-init
# 或
/ralph "執行 .omc/prd.md 中的任務"
```

---

# [專案名稱] PRD

## Overview
<!-- 簡述這次要完成的工作 -->

## Commit Strategy

**CRITICAL RULES - MUST FOLLOW:**

1. **ONE commit per user story** - 絕對不要把多個 US 合併成一個 commit
2. **Commit IMMEDIATELY** after each US passes verification
3. **Conventional Commit Format**:
   - `fix(<scope>): <description> (#<issue>)` - Bug 修復
   - `feat(<scope>): <description> (#<issue>)` - 新功能
   - `docs(<scope>): <description>` - 文件
   - `refactor(<scope>): <description>` - 重構
   - `chore(<scope>): <description>` - 雜項
   - `test(<scope>): <description>` - 測試

4. **Before each commit**:
   - Run `npm run build` (must pass)
   - Run `npm run test:run` (must pass)

5. **Commit message must include**:
   - Issue number if applicable: `(#123)`
   - Co-author line: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`

## User Stories

<!-- 用表格定義每個 US 和對應的 commit 訊息 -->

| ID | Type | Issue | Description | Commit Message |
|----|------|-------|-------------|----------------|
| US-001 | fix | #2 | Fix timer alignment | `fix(timer): align with system clock (#2)` |
| US-002 | feat | #9 | Add dark mode | `feat(ui): add dark mode toggle (#9)` |
| US-003 | docs | - | Update README | `docs: update README with new features` |

## Execution Order

<!-- 定義執行順序，相依性高的先做 -->

1. **Phase 1: Bug Fixes** (優先修復 bugs)
   - US-001
   - US-002

2. **Phase 2: Features** (新功能)
   - US-003
   - US-004

3. **Phase 3: Polish** (收尾)
   - US-005

## Acceptance Criteria

### Per User Story
- [ ] Implementation complete
- [ ] Build passes
- [ ] Tests pass
- [ ] **Committed with correct message format**

### Overall
- [ ] All user stories completed and committed separately
- [ ] All issues referenced in commits
- [ ] Git log shows individual commits per US

## Verification Command

After completion, verify commits:
```bash
git log --oneline -20
```

Expected output should show separate commits:
```
abc1234 fix(timer): align with system clock (#2)
def5678 fix(voices): use addEventListener (#3)
ghi9012 feat(ui): add dark mode toggle (#9)
...
```

---

## Notes for Ralph

- **DO NOT** batch multiple user stories into one commit
- **DO NOT** wait until the end to commit everything
- **ALWAYS** commit immediately after each US verification passes
- If a US fails verification, fix it before committing
- Use `git status` to verify changes before committing
