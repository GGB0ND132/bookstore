下面是ai总结的，功能实现上我自己写了大部分，当然这个比较好的项目结构也是让ai帮我了一下，在pages和api.ts花费了我很多时间，最后写出来功能没问题但是页面很丑（虽然用了tailwind+MUI），感觉是不太会用，最后让ai美化的页面

# 网上书店应用

这是一个使用现代前端技术栈构建的网上书店应用，提供图书浏览、详情查看、购物车和结账功能。

## 技术栈

### 核心框架
- **React 19** - 最新版本的React框架
- **TypeScript** - 提供类型安全的JavaScript开发体验
- **Vite 6** - 快速的前端构建工具

### UI/设计
- **Material UI 7** - 现代化的UI组件库
- **Emotion** - CSS-in-JS解决方案
- **Tailwind CSS 4** - 实用优先的CSS框架
- **MUI Icons** - Material风格图标库

### 状态管理与数据获取
- **Zustand 5** - 轻量级状态管理库
- **TanStack React Query 5** - 数据获取和缓存工具
- **Axios** - HTTP客户端

### 路由
- **React Router 7** - 声明式路由管理

### 后端模拟
- **JSON Server** - RESTful API模拟工具

### 开发工具
- **ESLint 9** - 代码质量和风格检查
- **TypeScript ESLint** - TypeScript集成的ESLint
- **React Hooks ESLint插件** - React Hooks规则检查

## 功能特点

1. **首页图书列表** - 展示所有可购买的图书
2. **图书详情页** - 查看图书的详细信息
3. **购物车** - 添加/删除商品，查看总价
4. **结账流程** - 完整的结账表单和流程
5. **错误边界处理** - 防止整个应用因局部错误崩溃
6. **响应式设计** - 适配不同屏幕尺寸的设备

## 项目结构

```
src/
├── assets/       # 静态资源文件
├── components/   # 可复用组件
├── pages/        # 页面组件
│   ├── Home.tsx         # 首页
│   ├── BookDetail.tsx   # 图书详情页
│   ├── Cart.tsx         # 购物车页面
│   └── Checkout.tsx     # 结账页面
├── services/     # API服务
├── types/        # TypeScript类型定义
├── App.tsx       # 应用主组件
└── main.tsx      # 应用入口点
```

## 开发与构建

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动模拟后端服务器
npx json-server --watch db.json --port 3001

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 环境要求
- Node.js 18+
- npm 9+

