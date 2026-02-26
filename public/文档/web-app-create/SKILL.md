---
name: web-app-scaffold
description: 根据需求描述从零搭建 Next.js + Supabase 全栈网站应用。当用户说"帮我搭建网站"、"创建网站项目"、"做一个 Web 应用"、"新建网站"时使用。
---

# 网站应用脚手架

你是一名资深全栈架构师，根据用户提供的网站需求，从零构建完整的 Next.js + Supabase 网站应用。

## 输入格式

用户需要提供：
- 网站名称
- 简要描述（核心功能）
- 目标用户

**示例输入**：
> 做一个电商网站，可以展示商品、加入购物车、下单，用户可以注册登录查看订单

## 工作流程

### Step 1: 需求分析

分析用户描述，识别：
1. **核心功能模块**（如：电商 → 商品列表、购物车、订单、支付）
2. **数据实体**（如：商品 → 名称、价格、描述、图片、库存）
3. **页面结构**（如：首页、商品详情、购物车、订单页、个人中心、管理后台）
4. **用户角色**（如：普通用户、管理员）

### Step 2: 数据库设计

参考 [supabase-setup.md](references/supabase-setup.md) 设计：
- 数据表结构
- 表关系
- Row Level Security (RLS) 策略
- 存储桶（如有图片上传）

### Step 3: 项目初始化

运行初始化脚本：
```bash
pnpm create next-app@latest my-app --typescript --tailwind --eslint
cd my-app
pnpm add @supabase/supabase-js @supabase/ssr
```

### Step 4: 配置 Supabase 客户端

创建 `lib/supabase/client.ts`：
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Step 5: UI 组件库配置

参考 [component-library.md](references/component-library.md) 配置 shadcn/ui：
```bash
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button card input form dialog table
```

### Step 6: 页面开发

按照以下顺序创建页面：

#### 6.1 Landing Page
- 首页 Hero 区
- 特性介绍
- CTA 按钮

#### 6.2 认证模块
- 登录页面
- 注册页面
- 忘记密码

#### 6.3 主功能页面
根据需求分析结果，为每个模块创建：
- 列表页
- 详情页
- 操作表单

#### 6.4 后台管理
- Dashboard 首页
- 数据管理表格
- CRUD 页面

### Step 7: API 路由（如需要）

使用 Next.js Route Handlers：
```typescript
// app/api/products/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('*')
  return NextResponse.json(data)
}
```

### Step 8: 部署

参考 [deployment.md](references/deployment.md) 部署到 Vercel。

## 项目结构

```
my-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证路由组
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # 管理后台
│   │   └── admin/
│   ├── products/           # 商品页面
│   ├── cart/               # 购物车
│   ├── api/                # API 路由
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   ├── forms/              # 表单组件
│   └── layouts/            # 布局组件
├── lib/
│   ├── supabase/           # Supabase 客户端
│   └── utils.ts
├── types/                  # 类型定义
└── public/                 # 静态资源
```

## 技术栈

| 类别 | 方案 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| 后端 | Supabase (Auth + Database + Storage) |
| 部署 | Vercel |

## 输出规范

### 代码质量要求
- 使用 TypeScript，类型完整
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS
- 使用 Server Actions 处理表单提交
- Supabase 操作使用 SSR 客户端

### 交互要求
1. **先展示计划**：生成文件前，先列出将要创建的文件清单
2. **分步执行**：逐步创建文件，让用户了解进度
3. **提供说明**：关键文件创建后简要说明其作用
4. **支持调整**：用户可随时要求调整架构或模块

## 参考资源

- [architecture.md](references/architecture.md) - Next.js + Supabase 架构详解
- [supabase-setup.md](references/supabase-setup.md) - Supabase 配置指南
- [component-library.md](references/component-library.md) - shadcn/ui 使用规范
- [deployment.md](references/deployment.md) - 部署指南
