# Help Center - 帮助中心

一个基于 Nuxt 4 构建的现代化帮助中心模板，支持文档管理、视频培训、搜索等功能。

## ✨ 特性

- 📖 Markdown 文档支持
- 🎬 视频培训中心
- 🔍 全文搜索
- 📱 响应式设计
- 🎨 现代化 UI 设计
- ⚡ 基于 Nuxt 4 + Vue 3

## 🌐 在线预览

**[https://xiaowwww-cyber.github.io/help_center/](https://xiaowwww-cyber.github.io/help_center/)** (由 GitHub Pages 提供)

## 🚀 快速开始

### 安装依赖

```bash
# pnpm (推荐)
pnpm install

# npm
npm install

# yarn
yarn install
```

### 开发模式

```bash
pnpm run dev
```

访问 `http://localhost:3000` 查看效果。

### 生产构建

```bash
pnpm run generate
```

### 预览生产构建

```bash
pnpm preview
```

## 📁 项目结构

```
help_center/
├── app/
│   ├── components/     # Vue 组件
│   ├── config/         # 配置文件
│   ├── layouts/        # 布局组件
│   ├── pages/          # 页面
│   └── composables/    # 组合式函数
├── public/
│   ├── docs/           # Markdown 文档
│   └── image/          # 静态图片
└── nuxt.config.ts      # Nuxt 配置
```

## 📝 自定义内容

### 文档配置

编辑 `app/config/docs-menu.ts` 配置文档菜单结构。

### 添加文档

在 `public/docs/` 目录下添加 Markdown 文件。

### 视频配置

编辑 `app/pages/video.vue` 中的视频数据配置。

## 🔧 环境变量

复制 `.env` 文件并配置您的环境变量：

```bash
cp .env .env.local
```

## 📄 License

MIT License
