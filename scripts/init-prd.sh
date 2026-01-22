#!/bin/bash
# 初始化 PRD 工作檔案
# Usage: ./scripts/init-prd.sh [task-name]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE="$PROJECT_ROOT/docs/templates/PRD-TEMPLATE.md"
OMC_DIR="$PROJECT_ROOT/.omc"
PRD_FILE="$OMC_DIR/prd.md"

# 顏色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 初始化 Ralph PRD${NC}"
echo ""

# 建立 .omc 目錄
if [ ! -d "$OMC_DIR" ]; then
    mkdir -p "$OMC_DIR"
    echo -e "${GREEN}✓${NC} 建立 .omc/ 目錄"
fi

# 檢查是否已有 PRD
if [ -f "$PRD_FILE" ]; then
    echo -e "${YELLOW}⚠${NC}  已存在 .omc/prd.md"
    read -p "要覆蓋嗎？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "取消操作"
        exit 0
    fi
fi

# 複製範本
cp "$TEMPLATE" "$PRD_FILE"
echo -e "${GREEN}✓${NC} 複製範本到 .omc/prd.md"

# 如果有提供任務名稱，替換標題
if [ -n "$1" ]; then
    TASK_NAME="$1"
    sed -i '' "s/\[專案名稱\] PRD/$TASK_NAME PRD/" "$PRD_FILE"
    echo -e "${GREEN}✓${NC} 設定任務名稱: $TASK_NAME"
fi

echo ""
echo -e "${GREEN}完成！${NC}"
echo ""
echo "下一步："
echo -e "  1. 編輯 PRD:  ${BLUE}code .omc/prd.md${NC}  或  ${BLUE}vim .omc/prd.md${NC}"
echo -e "  2. 啟動 Ralph: ${BLUE}/ralph-init${NC}  或  ${BLUE}/ralph \"執行 .omc/prd.md\"${NC}"
echo ""
echo -e "範例參考: ${BLUE}docs/templates/PRD-EXAMPLE.md${NC}"
