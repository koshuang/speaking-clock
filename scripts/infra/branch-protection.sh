#!/bin/bash
#
# GitHub Branch Protection Rules 設定
#
# 特性：
#   - 冪等性：使用 PUT API，重複執行結果相同
#   - 可驗證：執行後顯示當前設定狀態
#
# 使用方式：
#   export GITHUB_TOKEN=your_token
#   npm run infra:branch-protection
#
# 環境變數：
#   GITHUB_TOKEN (必要) - GitHub Personal Access Token，需要 repo 權限
#   BRANCH       (選用) - 目標分支，預設 main
#   DRY_RUN      (選用) - 設為 1 只顯示當前狀態，不做變更
#

set -e

# 顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ═══════════════════════════════════════
# 環境檢查
# ═══════════════════════════════════════

# 支援 GITHUB_TOKEN 或 GH_TOKEN（direnv/envrc 常用）
GITHUB_TOKEN="${GITHUB_TOKEN:-$GH_TOKEN}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}錯誤：請設定 GITHUB_TOKEN 環境變數${NC}"
    echo ""
    echo "取得 token: https://github.com/settings/tokens/new"
    echo "需要權限: repo (Full control of private repositories)"
    echo ""
    echo "使用方式："
    echo "  export GITHUB_TOKEN=your_token"
    echo "  npm run infra:branch-protection"
    exit 1
fi

# 從 git remote 取得 owner/repo
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REMOTE_URL" ]; then
    echo -e "${RED}錯誤：無法取得 git remote URL${NC}"
    exit 1
fi

# 解析 owner/repo (支援 HTTPS 和 SSH 格式)
if [[ "$REMOTE_URL" =~ github\.com[:/]([^/]+)/([^/.]+)(\.git)?$ ]]; then
    OWNER="${BASH_REMATCH[1]}"
    REPO="${BASH_REMATCH[2]}"
else
    echo -e "${RED}錯誤：無法解析 GitHub repository URL${NC}"
    echo "URL: $REMOTE_URL"
    exit 1
fi

BRANCH="${BRANCH:-main}"

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  Branch Protection 設定${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo "Repository: $OWNER/$REPO"
echo "Branch:     $BRANCH"
echo ""

# ═══════════════════════════════════════
# 查詢當前狀態
# ═══════════════════════════════════════

echo -e "${BLUE}► 查詢當前狀態...${NC}"

CURRENT_STATUS=$(curl -s \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/$OWNER/$REPO/branches/$BRANCH/protection" 2>/dev/null)

if echo "$CURRENT_STATUS" | grep -q '"message".*"Branch not protected"'; then
    echo -e "${YELLOW}  目前狀態：未設定保護規則${NC}"
elif echo "$CURRENT_STATUS" | grep -q '"required_status_checks"'; then
    echo -e "${GREEN}  目前狀態：已有保護規則${NC}"
    CURRENT_CHECKS=$(echo "$CURRENT_STATUS" | grep -o '"contexts":\[[^]]*\]' | head -1 || echo "無")
    echo "  Status checks: $CURRENT_CHECKS"
else
    echo -e "${YELLOW}  目前狀態：無法取得（可能無權限或分支不存在）${NC}"
fi
echo ""

# Dry run 模式
if [ "$DRY_RUN" = "1" ]; then
    echo -e "${YELLOW}DRY_RUN=1：僅顯示狀態，不做變更${NC}"
    exit 0
fi

# ═══════════════════════════════════════
# 套用設定
# ═══════════════════════════════════════

echo -e "${BLUE}► 套用保護規則...${NC}"

# 優先使用 gh CLI
if command -v gh &> /dev/null; then
    # 使用 --input 傳送 JSON body（-f 會把 boolean 變成字串）
    echo '{
        "required_status_checks": {
            "strict": true,
            "contexts": ["test"]
        },
        "enforce_admins": false,
        "required_pull_request_reviews": null,
        "restrictions": null,
        "allow_force_pushes": false,
        "allow_deletions": false
    }' | gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/$OWNER/$REPO/branches/$BRANCH/protection" \
        --input - \
        > /dev/null 2>&1
    RESULT=$?
else
    # 使用 curl 作為備用
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
        -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "https://api.github.com/repos/$OWNER/$REPO/branches/$BRANCH/protection" \
        -d '{
            "required_status_checks": {
                "strict": true,
                "contexts": ["test"]
            },
            "enforce_admins": false,
            "required_pull_request_reviews": null,
            "restrictions": null,
            "allow_force_pushes": false,
            "allow_deletions": false
        }')

    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    if [ "$HTTP_CODE" = "200" ]; then
        RESULT=0
    else
        RESULT=1
        echo "$RESPONSE" | head -n -1
    fi
fi

if [ $RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ 設定完成${NC}"
else
    echo -e "${RED}✗ 設定失敗，請檢查 token 權限${NC}"
    exit 1
fi

# ═══════════════════════════════════════
# 驗證結果
# ═══════════════════════════════════════

echo ""
echo -e "${BLUE}► 驗證設定...${NC}"

VERIFY_STATUS=$(curl -s \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/$OWNER/$REPO/branches/$BRANCH/protection" 2>/dev/null)

if echo "$VERIFY_STATUS" | grep -q '"contexts":\["test"\]'; then
    echo -e "${GREEN}✓ 驗證通過：test job 已設為必要檢查${NC}"
else
    echo -e "${YELLOW}⚠ 驗證警告：無法確認設定狀態${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo "已啟用的保護規則："
echo "  • Require status checks to pass (test job)"
echo "  • Require branches to be up to date"
echo "  • Prevent force pushes"
echo "  • Prevent branch deletion"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Renovate PR 現在會等 CI 通過後才自動合併${NC}"
