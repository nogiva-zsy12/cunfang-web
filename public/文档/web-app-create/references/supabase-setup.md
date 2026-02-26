# Supabase 配置指南

## 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "New Project"
3. 填写项目信息：
   - Organization（选择或创建组织）
   - Name（项目名称）
   - Database Password（数据库密码，保存好）
   - Region（选择靠近的区域）

## 获取连接凭证

项目创建后，在 Settings → API 中获取：
- **Project URL**: `https://xxxxx.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

## 环境变量配置

在 Next.js 项目根目录创建 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 数据库设计

### 创建数据表

在 Supabase Dashboard → Table Editor 创建表。

#### 示例：电商商品表

```sql
-- 创建 products 表
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  category text,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table products enable row level security;

-- 创建查看策略（所有人可读）
create policy "Products are viewable by everyone"
  on products for select
  using (true);

-- 创建插入策略（仅管理员可写）
create policy "Products can be inserted by authenticated users"
  on products for insert
  with check (auth.role() = 'authenticated');

-- 创建更新策略（仅管理员可更新）
create policy "Products can be updated by authenticated users"
  on products for update
  using (auth.role() = 'authenticated');

-- 创建删除策略（仅管理员可删除）
create policy "Products can be deleted by authenticated users"
  on products for delete
  using (auth.role() = 'authenticated');
```

#### 示例：用户资料表（扩展 auth.users）

```sql
-- 创建 profiles 表
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table profiles enable row level security;

-- 用户只能查看和修改自己的资料
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- 自动创建 profile 的触发器
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### 示例：订单表

```sql
-- 创建 orders 表
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  status text default 'pending' not null,
  total_amount numeric not null,
  shipping_address text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table orders enable row level security;

-- 用户只能查看自己的订单
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

-- 用户可以创建自己的订单
create policy "Users can create own orders"
  on orders for insert
  with check (auth.uid() = user_id);
```

## Storage 配置

### 创建存储桶

1. 在 Supabase Dashboard → Storage
2. 点击 "New bucket"
3. 配置：
   - Name：`products`（存储商品图片）
   - Public bucket（公开访问）

### 存储策略

```sql
-- 允许公开读取
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- 允许认证用户上传
create policy "Authenticated Upload"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
  );

-- 允许文件所有者删除
create policy "Owner Delete"
  on storage.objects for delete    bucket_id =
  using (
 'products'
    and auth.uid() = owner
  );
```

## 实时功能

### 启用实时订阅

```typescript
// 组件中订阅数据库变化
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ProductList() {
  const [products, setProducts] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // 初始加载
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*')
      if (data) setProducts(data)
    }

    fetchProducts()

    // 订阅实时更新
    const channel = supabase
      .channel('products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Change received!', payload)
          fetchProducts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

## 常用 SQL 片段

### 常用查询

```sql
-- 分页查询
select * from products order by created_at desc limit 10 offset 0;

-- 条件查询
select * from products where price > 100 and category = 'electronics';

-- 关联查询
select 
  orders.*,
  profiles.full_name
from orders
join profiles on orders.user_id = profiles.id;

-- 聚合查询
select category, count(*), avg(price) from products group by category;
```

### 索引优化

```sql
-- 为常用查询创建索引
create index idx_products_category on products(category);
create index idx_products_price on products(price);
create index idx_orders_user_id on orders(user_id);
create index idx_orders_status on orders(status);
```

## 故障排除

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| RLS 策略阻止操作 | 检查策略是否正确配置 |
| 无法上传文件 | 确认 Storage 策略和文件大小限制 |
| 实时订阅不工作 | 确认项目设置中启用了 Realtime |
| 认证失败 | 检查 anon key 和 URL 是否正确 |

### 调试 RLS

```sql
-- 查看表的策略
select * from pg_policies where tablename = 'products';

-- 测试当前用户权限
select auth.uid();
select auth.role();
```
