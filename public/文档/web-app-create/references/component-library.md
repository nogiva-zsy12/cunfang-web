# UI 组件库使用规范

本项目使用 shadcn/ui 作为主要 UI 组件库，基于 Radix UI 和 Tailwind CSS。

## 安装配置

### 初始化 shadcn/ui

```bash
npx shadcn-ui@latest init
```

配置选项：
- Style: Default
- Base Color: Slate
- CSS Variables: Yes
- Tailwind config: tailwind.config.ts
- App Router: Yes
- Import alias: @/*

### 安装常用组件

```bash
# 基础组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea

# 表单组件
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add slider

# 布局组件
npx shadcn-ui@latest add sheet     # 侧边栏抽屉
npx shadcn-ui@latest add dialog   # 模态框
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton  # 加载占位

# 数据展示
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar

# 反馈
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add spinner
```

## 组件使用示例

### Button

```tsx
import { Button } from '@/components/ui/button'

// 主要按钮
<Button>Submit</Button>

// 变体
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// 尺寸
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// 加载状态
<Button disabled>
  <Spinner className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>
```

### Card

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Product description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Product details...</p>
  </CardContent>
  <CardFooter>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>
```

### Form

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Price</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map((product) => (
      <TableRow key={product.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>${product.price}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* 表单内容 */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Sheet (Drawer)

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Cart</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Shopping Cart</SheetTitle>
      <SheetDescription>
        Review your items before checkout.
      </SheetDescription>
    </SheetHeader>
    {/* 购物车内容 */}
  </SheetContent>
</Sheet>
```

## 页面布局模式

### 带侧边栏的布局

```tsx
// components/layouts/main-layout.tsx
import { Sidebar } from '@/components/layouts/sidebar'
import { Navbar } from '@/components/layouts/navbar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="w-64 hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 登录/注册布局（简洁）

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        {children}
      </div>
    </div>
  )
}
```

### 响应式网格

```tsx
// 商品列表
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## Tailwind 实用类

### 间距

| 类名 | 像素值 |
|------|--------|
| p-4 | 16px |
| m-4 | 16px |
| gap-4 | 16px |
| space-y-4 | 16px 垂直间距 |

### 响应式

```tsx
// 移动优先
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 内容 */}
</div>
```

### 深色模式

```tsx
// 自动适应深色/浅色
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">Text</p>
</div>
```

## 自定义主题

在 `globals.css` 中修改 CSS 变量：

```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --radius: 0.5rem;
  }
}
```
