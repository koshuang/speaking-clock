#!/bin/bash
#
# 執行所有 setup scripts
#
# 特性：
#   - 冪等性：可重複執行，結果相同
#   - 選擇性：可透過環境變數跳過特定設定
#
# 使用方式：
#   npm run setup:all
#   SKIP_GITHUB=1 npm run setup:all  # 跳過 GitHub 設定
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# 顏色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  Speaking Clock - 環境設定${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# 計數器
TOTAL=0
SUCCESS=0
SKIPPED=0

run_step() {
    local name="$1"
    local skip_var="$2"
    local command="$3"

    TOTAL=$((TOTAL + 1))

    # 檢查是否跳過
    if [ -n "$skip_var" ] && [ "${!skip_var}" = "1" ]; then
        echo -e "${YELLOW}⊘${NC} [$name] 已跳過 (${skip_var}=1)"
        SKIPPED=$((SKIPPED + 1))
        return 0
    fi

    echo -e "${BLUE}►${NC} [$name] 執行中..."

    if eval "$command"; then
        echo -e "${GREEN}✓${NC} [$name] 完成"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}✗${NC} [$name] 失敗"
        return 1
    fi
}

# ═══════════════════════════════════════
# 1. Node.js 依賴
# ═══════════════════════════════════════
echo -e "\n${BLUE}[1/3] Node.js 依賴${NC}"

if [ -d "$PROJECT_ROOT/node_modules" ] && [ -f "$PROJECT_ROOT/node_modules/.package-lock.json" ]; then
    echo -e "${GREEN}✓${NC} [npm] node_modules 已存在，跳過安裝"
    echo "   提示：如需強制重裝，執行 rm -rf node_modules && npm ci"
else
    run_step "npm" "SKIP_NPM" "cd '$PROJECT_ROOT' && npm ci"
fi

# ═══════════════════════════════════════
# 2. Git Hooks (如果使用 husky)
# ═══════════════════════════════════════
echo -e "\n${BLUE}[2/3] Git Hooks${NC}"

if [ -f "$PROJECT_ROOT/.husky/_/husky.sh" ]; then
    echo -e "${GREEN}✓${NC} [husky] Git hooks 已設定"
elif [ -f "$PROJECT_ROOT/package.json" ] && grep -q '"prepare".*husky' "$PROJECT_ROOT/package.json"; then
    run_step "husky" "SKIP_HUSKY" "cd '$PROJECT_ROOT' && npm run prepare"
else
    echo -e "${YELLOW}⊘${NC} [husky] 專案未使用 husky，跳過"
fi

# ═══════════════════════════════════════
# 3. GitHub 設定 (需要 GITHUB_TOKEN)
# ═══════════════════════════════════════
echo -e "\n${BLUE}[3/3] GitHub 設定${NC}"

# 支援 GITHUB_TOKEN 或 GH_TOKEN
GITHUB_TOKEN="${GITHUB_TOKEN:-$GH_TOKEN}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}⊘${NC} [github] GITHUB_TOKEN 未設定，跳過"
    echo "   提示：設定後執行 npm run setup:github"
    SKIPPED=$((SKIPPED + 1))
else
    run_step "branch-protection" "SKIP_GITHUB" "'$SCRIPT_DIR/../infra/branch-protection.sh'"
fi

# ═══════════════════════════════════════
# 結果摘要
# ═══════════════════════════════════════
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  設定完成${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}成功${NC}: $SUCCESS"
echo -e "  ${YELLOW}跳過${NC}: $SKIPPED"
echo ""
echo "下一步："
echo -e "  開發模式：${BLUE}npm run dev${NC}"
echo -e "  執行測試：${BLUE}npm run test${NC}"
echo ""
