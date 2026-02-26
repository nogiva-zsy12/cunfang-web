#!/bin/bash

# Website Project Initialization Script
# 用法: ./scripts/init-project.sh <project-name>

set -e

PROJECT_NAME=${1:-my-web-app}

echo "🚀 初始化网站项目: $PROJECT_NAME"

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+"
    exit 1
fi

echo "✅ Node.js 版本检查通过"

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm 已安装"

# 创建 Next.js 项目
echo "📦 创建 Next.js 项目..."
cd "$(dirname "$0")/.."

if [ -d "$PROJECT_NAME" ]; then
    echo "⚠️ 目录 $PROJECT_NAME 已存在，是否删除？[y/n]"
    read -r confirm
    if [ "$confirm" = "y" ]; then
        rm -rf "$PROJECT_NAME"
    else
        echo "❌ 已取消"
        exit 1
    fi
fi

pnpm create next-app@latest "$PROJECT_NAME" \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias "@/*" \
    --use-pnpm

cd "$PROJECT_NAME"

echo "📦 安装 Supabase 依赖..."
pnpm add @supabase/supabase-js @supabase/ssr

echo "📦 安装 shadcn/ui..."
echo "y" | pnpm dlx shadcn-ui@latest init || true

echo "📦 安装常用 UI 组件..."
pnpm dlx shadcn-ui@latest add button card input label textarea form select checkbox switch slider table badge avatar alert toast dialog dropdown-menu separator skeleton progress

echo ""
echo "🎉 项目初始化完成！"
echo ""
echo "下一步操作："
echo "1. cd $PROJECT_NAME"
echo "2. 配置 Supabase 环境变量（参考 references/supabase-setup.md）"
echo "3. pnpm dev 启动开发服务器"
echo ""
