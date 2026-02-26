#!/bin/bash

# Supabase Setup Script
# 用法: ./scripts/setup-supabase.sh

set -e

echo "🔧 Supabase 配置脚本"
echo ""

# 检查是否在 Next.js 项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 Next.js 项目根目录运行此脚本"
    exit 1
fi

echo "请提供 Supabase 项目信息："
echo ""

read -p "Supabase Project URL (https://xxxx.supabase.co): " SUPABASE_URL
read -p "Supabase anon public key: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ URL 和 Key 不能为空"
    exit 1
fi

echo ""
echo "📝 创建环境变量文件..."

# 创建 .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

echo "✅ 环境变量已创建: .env.local"

# 创建 Supabase 客户端文件
echo "📝 创建 Supabase 客户端..."

mkdir -p lib/supabase

cat > lib/supabase/client.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
EOF

cat > lib/supabase/server.ts << 'EOF'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component 中调用可能失败
          }
        },
      },
    }
  )
}
EOF

echo "✅ Supabase 客户端已创建"

# 创建类型定义（可选）
echo "📝 创建类型定义..."

mkdir -p types

cat > types/supabase.ts << 'EOF'
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string | null
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      // 添加更多表...
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
EOF

echo "✅ 类型定义已创建"

echo ""
echo "🎉 Supabase 配置完成！"
echo ""
echo "下一步操作："
echo "1. 在 Supabase Dashboard 创建数据库表（参考 references/supabase-setup.md）"
echo "2. pnpm dev 启动开发服务器"
echo ""
