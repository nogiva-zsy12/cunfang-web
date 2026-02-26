# Next.js + Supabase 架构设计

## 推荐技术栈

| 类别 | 推荐方案 | 备选方案 |
|------|----------|----------|
| 框架 | Next.js 14+ (App Router) | Next.js Pages Router |
| 语言 | TypeScript | JavaScript |
| 样式 | Tailwind CSS + shadcn/ui | CSS Modules, Styled Components |
| 认证 | Supabase Auth | NextAuth.js |
| 数据库 | Supabase PostgreSQL | Prisma + PostgreSQL |
| 表单 | React Hook Form + Zod | Formik |
| 状态 | Zustand | Redux Toolkit, Jotai |
| 部署 | Vercel | Netlify, Cloudflare Pages |

## 目录结构

### App Router 结构

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                # 认证路由组（无布局）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx         # 认证布局（简洁）
│   │
│   ├── (dashboard)/           # 主应用路由组
│   │   ├── layout.tsx         # 主布局（含导航）
│   │   ├── page.tsx           # Dashboard 首页
│   │   ├── products/
│   │   │   ├── page.tsx       # 商品列表
│   │   │   └── [id]/          # 商品详情
│   │   │       └── page.tsx
│   │   └── orders/
│   │       └── page.tsx
│   │
│   ├── api/                   # API 路由
│   │   └── webhooks/
│   │       └── supabase/
│   │           └── route.ts
│   │
│   ├── layout.tsx             # 根布局
│   ├── globals.css            # 全局样式
│   └── not-found.tsx          # 404 页面
│
├── components/
│   ├── ui/                    # shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── forms/                 # 表单组件
│   │   ├── login-form.tsx
│   │   └── product-form.tsx
│   ├── layouts/               # 布局组件
│   │   ├── navbar.tsx
│   │   └── sidebar.tsx
│   └── auth/                  # 认证组件
│       └── auth-button.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # 浏览器客户端
│   │   ├── server.ts          # 服务端客户端
│   │   └── middleware.ts      # 中间件（可选）
│   └── utils.ts               # 工具函数
│
├── types/
│   ├── database.types.ts      # Supabase 类型
│   └── index.ts               # 全局类型
│
└── public/                     # 静态资源
    ├── images/
    └── fonts/
```

## Supabase 客户端配置

### 浏览器端客户端

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 服务端客户端（Server Components）

```typescript
// lib/supabase/server.ts
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
```

### 中间件（可选）

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

## 数据访问层

### Service 层模式

```typescript
// lib/services/product.service.ts
import { createClient } from '@/lib/supabase/server'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  created_at: string
}

export const productService = {
  async getAll() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(product: Omit<Product, 'id' | 'created_at'>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, product: Partial<Product>) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
```

## 表单处理

### Server Actions

```typescript
// app/actions/product.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    image_url: formData.get('image_url') as string,
  }

  const { error } = await supabase.from('products').insert(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/products')
  redirect('/products')
}
```

### 表单组件

```typescript
// components/forms/product-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductFormData } from '@/types/product'

export function ProductForm() {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    await createProduct(formData)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  )
}
```

## 认证流程

### 注册页面

```typescript
// app/(auth)/register/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm />
    </div>
  )
}
```

### 退出登录

```typescript
// app/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
```
