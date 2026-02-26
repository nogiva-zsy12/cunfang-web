# 🔧 Supabase 配置脚本 - 视觉化教程

## 脚本概述

**文件名**: `scripts/setup-supabase.sh`  
**用途**: 配置 Supabase 客户端和环境变量  
**使用方式**: 在 Next.js 项目根目录运行 `./scripts/setup-supabase.sh`

---

## 执行流程图

```
┌─────────────────────────────────────────────────────────────────┐
│              setup-supabase.sh 执行流程                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   开始                                                          │
│     │                                                         │
│     ▼                                                         │
│   检查是否在 Next.js 项目目录                                     │
│     │                                                         │
│     ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ package.json 存在?                                   │   │
│   │    │                                                  │   │
│   │  是   │   否                                          │   │
│   │    │   │                                              │   │
│   ▼    ▼   ▼                                                │
│  继续  ❌ 退出                                                │
│         │                                                    │
│         ▼                                                    │
│   交互式获取 Supabase 凭证                                       │
│   - Project URL                                                │
│   - anon public key                                            │
│     │                                                         │
│     ▼                                                         │
│   验证输入是否为空                                               │
│     │                                                         │
│     ▼                                                         │
│   创建 .env.local 文件                                          │
│     │                                                         │
│     ▼                                                         │
│   创建 lib/supabase/ 目录                                       │
│     │                                                         │
│     ▼                                                         │
│   创建 client.ts (浏览器客户端)                                 │
│     │                                                         │
│     ▼                                                         │
│   创建 server.ts (服务端客户端)                                 │
│     │                                                         │
│     ▼                                                         │
│   创建 types/supabase.ts 类型定义                                │
│     │                                                         │
│     ▼                                                         │
│   完成！输出后续步骤                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 详细步骤说明

### 步骤 1: 环境检查

```
┌─────────────────────────────────────────────────────────────────┐
│  步骤 1: 环境检查                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  检查是否在 Next.js 项目目录:                                    │
│                                                                 │
│  if [ ! -f "package.json" ]; then                             │
│      echo "❌ 请在 Next.js 项目根目录运行此脚本"              │
│      exit 1                                                     │
│  fi                                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 需要存在 package.json 文件才能继续执行                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 步骤 2: 交互式获取凭证

```
┌─────────────────────────────────────────────────────────────────┐
│  步骤 2: 交互式获取 Supabase 凭证                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  用户输入:                                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 请提供 Supabase 项目信息：                               │   │
│  │                                                         │   │
│  │ Supabase Project URL (https://xxxx.supabase.co):        │   │
│  │ ^ 输入: https://abc123.supabase.co                    │   │
│  │                                                         │   │
│  │ Supabase anon public key:                               │   │
│  │ ^ 输入: eyJhbGciOiJIUzI1NiIs...                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  获取凭证位置:                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Supabase Dashboard → Settings → API                     │   │
│  │                                                         │   │
│  │ • Project URL: https://xxxx.supabase.co               │   │
│  │ • anon public key: eyJhbGciOiJIUzI1NiIs...           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 步骤 3: 验证输入

```
┌─────────────────────────────────────────────────────────────────┐
│  步骤 3: 验证输入                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ];  │
│  then                                                           │
│      echo "❌ URL 和 Key 不能为空"                              │
│      exit 1                                                     │
│  fi                                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 检查项:                                                   │   │
│  │ • SUPABASE_URL 不为空                                    │   │
│  │ • SUPABASE_ANON_KEY 不为空                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 步骤 4: 创建环境变量文件

```
┌─────────────────────────────────────────────────────────────────┐
│  步骤 4: 创建 .env.local 文件                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  创建 .env.local:                                               │
│                                                                 │
│  cat > .env.local << EOF                                       │
│  NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL                        │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY             │
│  EOF                                                           │
│                                                                 │
│  生成的文件内容:                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co   │   │
│  │ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs... │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️  注意:                                                     │
│  • NEXT_PUBLIC_ 前缀使变量可在客户端代码中访问                  │
│  • 不要将 .env.local 提交到 Git (已在 .gitignore 中)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 步骤 5: 创建 Supabase 客户端文件

```
┌─────────────────────────────────────────────────────────────────┐
│  步骤 5: 创建 Supabase 客户端文件                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  5.1 创建目录:                                                  │
│      mkdir -p lib/supabase                                      │
│                                                                 │
│  5.2 创建 client.ts (浏览器客户端):                              │
│                                                                 │
│      cat > lib/supabase/client.ts << 'EOF'                    │
│      import { createBrowserClient } from '@supabase/ssr'       │
│                                                                 │
│      export function createClient() {                           │
│        return createBrowserClient(                             │
│          process.env.NEXT_PUBLIC_SUPABASE_URL!,               │
│          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!           │
│        )                                                       │
│      }                                                         │
│      EOF                                                       │
│                                                                 │
│  5.3 创建 server.ts (服务端客户端):                             │
│                                                                 │
│      cat > lib/supabase/server.ts << 'EOF'                    │
│      import { createServerClient } from '@supabase/ssr'      │
│      import { cookies } from 'next/headers'                  │
│                                                                 │
│      export async function createClient() {                   │
│        const cookieStore = await cookies()                   │
│                                                                 │
│        return createServerClient(                             │
│          process.env.NEXT_PUBLIC_SUPABASE_URL!,               │
│          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,          │
│          {                                                    │
│            cookies: {                                         │
│              getAll() {                                      │
│                return cookieStore.getAll()                   │
│              },                                               │
│              setAll(cookiesToSet) {                          │
│                try {                                         │
│                  cookiesToSet.forEach(({ name, value, options }) =>│
│                    cookieStore.set(name, value, options)    │
│                  )                                           │
│                } catch {                                     │
│                  // Server Component 中调用可能失败            │
│                }                                              │
│              },                                               │
│            },                                                  │
│          }                                                    │
│        )                                                       │
│      }                                                         │
│      EOF                                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 步骤 6: 创建类型定义

```
┌─────────────────────────────────────────────────────────────────┐
│ 步骤 6: 创建类型定义文件                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  创建目录:                                                      │
│      mkdir -p types                                             │
│                                                                 │
│  创建 types/supabase.ts:                                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ export type Json =                                      │   │
│  │   | string                                              │   │
│  │   | number                                              │   │
│  │   | boolean                                             │   │
│  │   | null                                                 │   │
│  │   | { [key: string]: Json | undefined }               │   │
│  │   | Json[]                                              │   │
│  │                                                        │   │
│  │ export interface Database {                           │   │
│  │   public: {                                            │   │
│  │     Tables: {                                         │   │
│  │       products: {                                      │   │
│  │         Row: { ... }                                  │   │
│  │         Insert: { ... }                               │   │
│  │         Update: { ... }                               │   │
│  │       }                                                │   │
│  │     }                                                  │   │
│  │   }                                                    │   │
│  │ }                                                      │   │
│  │                                                        │   │
│  │ export type Product = Database['public']['Tables']['products']['Row']│
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  类型说明:                                                      │
│  ┌────────────────┬──────────────────────────────────────┐    │
│  │ 类型           │ 用途                                 │    │
│  ├────────────────┼──────────────────────────────────────┤    │
│  │ Json           │ Supabase 返回的 JSON 类型           │    │
│  │ Database       │ 完整数据库类型定义                   │    │
│  │ Product        │ products 表行类型                   │    │
│  │ ProductInsert  │ products 表插入类型                 │    │
│  │ ProductUpdate  │ products 表更新类型                 │    │
│  └────────────────┴──────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 生成的文件总览

```
┌─────────────────────────────────────────────────────────────────┐
│              生成的文件总览                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  项目根目录                                                     │
│  ├── .env.local                    ← 环境变量                   │
│  ├── lib/                          ← 新建                       │
│  │   └── supabase/                ← 新建                       │
│  │       ├── client.ts           ← 浏览器客户端               │
│  │       └── server.ts           ← 服务端客户端               │
│  └── types/                       ← 新建                       │
│      └── supabase.ts              ← 类型定义                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 客户端使用示例

### 浏览器端 (客户端组件)

```
┌─────────────────────────────────────────────────────────────────┐
│ 浏览器端客户端使用                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  文件: components/product-list.tsx                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 'use client'                                         │   │
│  │                                                      │   │
│  │ import { createClient } from '@/lib/supabase/client'│   │
│  │ import { useEffect, useState } from 'react'          │   │
│  │                                                      │   │
│  │ export function ProductList() {                     │   │
│  │   const [products, setProducts] = useState([])      │   │
│  │   const supabase = createClient()                   │   │
│  │                                                      │   │
│  │   useEffect(() => {                                 │   │
│  │     supabase.from('products').select('*')          │   │
│  │       .then(({ data }) => setProducts(data || [])) │   │
│  │   }, [])                                             │   │
│  │                                                      │   │
│  │   return <ul>{/* ... */}</ul>                      │   │
│  │ }                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 服务端 (Server Components / Server Actions)

```
┌─────────────────────────────────────────────────────────────────┐
│ 服务端客户端使用                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  文件: app/products/page.tsx                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ import { createClient } from '@/lib/supabase/server'   │   │
│  │                                                      │   │
│  │ export default async function ProductsPage() {        │   │
│  │   const supabase = await createClient()              │   │
│  │   const { data: products } = await supabase         │   │
│  │     .from('products')                                │   │
│  │     .select('*')                                     │   │
│  │                                                      │   │
│  │   return <ProductGrid products={products || []} />  │   │
│  │ }                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  文件: app/actions/product.ts                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 'use server'                                          │   │
│  │                                                      │   │
│  │ import { createClient } from '@/lib/supabase/server'│   │
│  │ import { revalidatePath } from 'next/cache'         │   │
│  │                                                      │   │
│  │ export async function createProduct(formData: FormData) {│
│  │   const supabase = await createClient()              │   │
│  │   // ... 处理逻辑                                     │   │
│  │   revalidatePath('/products')                        │   │
│  │ }                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 使用示例

```
┌─────────────────────────────────────────────────────────────────┐
│              使用示例                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  运行脚本:                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ cd my-ecommerce                                       │   │
│  │ ./scripts/setup-supabase.sh                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  交互输入:                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔧 Supabase 配置脚本                                 │   │
│  │                                                      │   │
│  │ 请提供 Supabase 项目信息：                           │   │
│  │                                                      │   │
│  │ Supabase Project URL (https://xxxx.supabase.co):    │   │
│  │ https://abc123.supabase.co                          │   │
│  │                                                      │   │
│  │ Supabase anon public key:                           │   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...            │   │
│  │                                                      │   │
│  │ ✅ 环境变量已创建: .env.local                        │   │
│  │ ✅ Supabase 客户端已创建                             │   │
│  │ ✅ 类型定义已创建                                     │   │
│  │                                                      │   │
│  │ 🎉 Supabase 配置完成！                               │   │
│  │                                                      │   │
│  │ 下一步操作：                                           │   │
│  │ 1. 在 Supabase Dashboard 创建数据库表               │   │
│  │ 2. pnpm dev 启动开发服务器                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 常见问题

```
┌─────────────────────────────────────────────────────────────────┐
│              常见问题                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Q: 如何获取 Supabase 凭证？                                   │
│  A: Supabase Dashboard → Settings → API                        │
│                                                                 │
│  Q: .env.local 和 .env.production 区别？                      │
│  A: .env.local 用于本地开发，.env.production 用于生产环境       │
│                                                                 │
│  Q: 可以重复运行脚本吗？                                       │
│  A: 可以，会覆盖现有的 .env.local 和客户端文件                  │
│                                                                 │
│  Q: 类型定义需要手动更新吗？                                   │
│  A: 可用 Supabase CLI 的 db pull 命令自动生成                   │
│      npx supabase gen types types/supabase.ts                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
