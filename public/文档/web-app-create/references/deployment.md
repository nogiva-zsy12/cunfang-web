# 部署指南

## Vercel 部署

### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库
gh repo create my-app --public --source=. --push
```

### 步骤 2: 导入到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New..." → "Project"
3. 选择刚才创建的 GitHub 仓库
4. 配置项目：
   - Framework Preset: Next.js
   - Build Command: `next build`（默认）
   - Output Directory: `.next`（默认）

### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 步骤 4: 部署

点击 "Deploy"，等待构建完成。

## Supabase 生产环境配置

### 创建生产环境数据库

1. 在 Supabase Dashboard
2. 点击 "New project" 创建生产环境项目
3. 导入开发环境数据：
   - 在开发项目 → Settings → Database
   - 点击 "Download dump" 导出数据
   - 在生产项目 → SQL Editor 运行 dump 文件

### 配置生产环境变量

确保 Vercel 生产部署使用生产环境 Supabase：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
```

## 自定义域名（可选）

### Vercel 域名配置

1. 在 Vercel 项目 → Settings → Domains
2. 添加自定义域名
3. 按照提示配置 DNS 记录

### Supabase 配置

1. 在 Supabase Dashboard → Settings → API
2. 在 "Site URL" 中添加你的自定义域名

## 性能优化

### 静态导出（可选）

如果不需要服务端功能，可以生成静态网站：

```bash
# next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 图片域名配置
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

然后部署到 Netlify 或 Cloudflare Pages。

### 缓存配置

```typescript
// app/products/page.tsx
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60 // 60秒重新验证

export default async function ProductsPage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(12)

  return <ProductGrid products={products || []} />
}
```

## 监控和错误追踪

### Vercel Analytics

在 Vercel 项目设置中启用 Analytics。

### 错误边界

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="mt-4 rounded bg-primary px-4 py-2"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### 加载状态

```typescript
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded mt-4" />
        </div>
      ))}
    </div>
  )
}
```

## 常见部署问题

| 问题 | 解决方案 |
|------|----------|
| 404 错误 | 检查 Vercel 的 Build Output Directory 配置 |
| 环境变量不生效 | 确认在 Vercel 环境变量中添加了 `NEXT_PUBLIC_` 前缀的变量 |
| 样式问题 | 确认 `globals.css` 正确引入 |
| 图片不显示 | 检查 `next.config.js` 的 images 配置 |
| 数据库连接失败 | 检查 Supabase URL 和 Key 是否正确 |

## 快速命令汇总

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 生产运行
pnpm start

# Lint
pnpm lint
```
